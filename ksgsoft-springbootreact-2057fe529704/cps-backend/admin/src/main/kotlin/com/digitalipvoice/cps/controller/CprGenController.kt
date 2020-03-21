package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.*
import com.digitalipvoice.cps.components.AppState
import com.digitalipvoice.cps.configuration.FileStorageProperties
import com.digitalipvoice.cps.exceptions.BadRequestException
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.BaseResponse
import com.digitalipvoice.cps.persistance.model.*
import com.digitalipvoice.cps.service.*
import com.digitalipvoice.cps.utils.escapeStringForMySQL
import com.digitalipvoice.cps.utils.isNumeric
import com.digitalipvoice.cps.utils.logger
import com.opencsv.CSVParserBuilder
import com.opencsv.CSVReader
import com.opencsv.CSVReaderBuilder
import org.apache.commons.io.FilenameUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.FileReader
import java.io.OutputStreamWriter
import java.util.*
import javax.servlet.http.HttpServletResponse

@Controller
@RequestMapping("/cprgen")
class CprGenController {
    private val log = logger(javaClass)

    @Autowired
    private lateinit var appState: AppState

    @Autowired
    private lateinit var storageProperties: FileStorageProperties

    @Autowired
    private lateinit var lergImportService: LergImportService

    @Autowired
    private lateinit var rateDeckService: RateDeckService

    @Autowired
    private lateinit var cdrDataService: CdrDataService

    @Autowired
    private lateinit var notificationService: NotificationService

    @Autowired
    private lateinit var lcrReportService: LcrReportService

    @Autowired
    private lateinit var cprReportService: CprReportService

    @Autowired
    private lateinit var lataNpanxxReport2Service: LataNpanxxReport2Service

    @Value("\${spring.jpa.properties.hibernate.jdbc.batch_size}")
    private var batchInsertSize = 0

    /**
     * Upload Lerg File
     */
    @PostMapping("/lerg/upload")
    @PreAuthorize("hasAuthority('${Privilege.LergImport}')")
    @ResponseBody
    fun uploadLerg(@RequestParam("file") file: MultipartFile, @RequestParam("delimiter") delimiter: String): ResponseEntity<Any> {
        val originalFileName = file.originalFilename
        val ext = FilenameUtils.getExtension(originalFileName)

        val uploadDir = storageProperties.uploadDir ?: ""
        if (uploadDir.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse("Upload directory is invalid."))
        }

        var reader: CSVReader? = null
        try {
            // Make directory
            File(uploadDir).mkdirs()
            // Generate file name
            val filename = "lerg_${UUID.randomUUID()}.$ext"

            val save2File = File(uploadDir + File.separator + filename)
            file.transferTo(save2File)
            val separator = when (delimiter) {
                InsertLergRequest.DelimiterEnum.COMMA.value -> ','
                InsertLergRequest.DelimiterEnum.PIPE.value -> '|'
                InsertLergRequest.DelimiterEnum.SEMICOLON.value -> ';'
                InsertLergRequest.DelimiterEnum.TAB.value -> '\t'
                else -> throw BadRequestException("Delimiter not specified")
            }

            // Try open file
            reader = CSVReaderBuilder(FileReader(save2File))
                    .withCSVParser(
                            CSVParserBuilder()
                                    .withSeparator(separator)

                                    .build())
                    .build()

            val row = reader.readNext()

            val columns = mutableListOf<String>()

            // Support 20 columns
            for (i in 0..20) {
                columns.add(if (row.size > i) row[i] else "")
            }

            return ResponseEntity.ok(UploadLergResponse().filename(filename).message("").columns(columns))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse("Upload failed."))
        } finally {
            reader?.close()
        }
    }

    /**
     * Insert Lerg
     */
    @PostMapping("/lerg/insert")
    @PreAuthorize("hasAuthority('${Privilege.LergImport}')")
    @ResponseBody
    fun insertLerg(@RequestBody r: InsertLergRequest, user: AppUser): ResponseEntity<Any> {
        val uploadDir = storageProperties.uploadDir ?: ""
        val filePath = uploadDir + File.separator + r.filename

        // Check colum indices

        val file = File(filePath)

        if (!file.exists() || !file.isFile || r.delimiter == null)
            return ResponseEntity.badRequest()
                    .body(BaseResponse("Uploaded file not found"))

        val separator = when (r.delimiter) {
            InsertLergRequest.DelimiterEnum.COMMA -> ','
            InsertLergRequest.DelimiterEnum.PIPE -> '|'
            InsertLergRequest.DelimiterEnum.SEMICOLON -> ';'
            InsertLergRequest.DelimiterEnum.TAB -> '\t'
            else -> throw BadRequestException("Delimiter not specified")
        }


        // Create a new thread to perform lerg import
        var reader: CSVReader? = null
        Thread {
            appState.isLergImportInProgress = true

            var wholeCount = 0
            try {

                // Build reader
                if (r.insertType == InsertLergRequest.InsertTypeEnum.OVERWRITE) {
                    lergImportService.deleteAll()
                }


                reader = CSVReaderBuilder(FileReader(file))
                        .withCSVParser(
                                CSVParserBuilder()
                                        .withSeparator(separator)

                                        .build())
                        .build()
                val batchSize = 1000
                val values = ArrayList<String>(batchSize)
                for (row in reader!!) {
                    // Skip first row
                    if (r.isHasColumnHeader) {
                        r.isHasColumnHeader = false
                        continue
                    }

                    val state = (if (row.size > r.state) row[r.state].trim() else "").escapeStringForMySQL()
                    val npa = (if (row.size > r.npa) row[r.npa].trim() else "").escapeStringForMySQL()
                    val nxx = (if (row.size > r.nxx) row[r.nxx].trim() else "").escapeStringForMySQL()

                    val npaNxx = npa + nxx

                    val x = (if (row.size > r.x) row[r.x].trim() else "").escapeStringForMySQL()
                    val lata = (if (row.size > r.lata) row[r.lata].trim() else "").escapeStringForMySQL()
                    val carrier = (if (row.size > r.carrier) row[r.carrier].trim() else "").escapeStringForMySQL()
                    val acna = (if (row.size > r.acna) row[r.acna].trim() else "").escapeStringForMySQL()
                    val cic = (if (row.size > r.cic) row[r.cic].trim() else "").escapeStringForMySQL()
                    val acnaCic = ("$acna-$cic").escapeStringForMySQL()

                    // if non numeric npanxx found, just ignore
                    if (!npaNxx.isNumeric()) continue

                    values.add("('$npaNxx','$npa','$nxx','$state','$lata','$carrier','$acna','$cic','$acnaCic')")

                    // When exceeded batch size,
                    if (values.size >= batchSize) {
                        wholeCount += lergImportService.insertBatch(values)
                        values.clear()
                    }
                }

                // If any padding (remaining) lergs...
                if (values.size > 0) {
                    wholeCount += lergImportService.insertBatch(values)
                }
            } catch (ex: Exception) {
                ex.printStackTrace()
            } finally {
                // Close reader
                reader?.close()
                // Notification
                val notification = Notification().apply {
                    userId = user.id
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "Lerg Import $wholeCount Record(s) done"
                    description = ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
                appState.isLergImportInProgress = false
            }
        }.start()
        return ResponseEntity.ok(BaseResponse("Lerg Import started"))
    }

    /**
     *  Search Lerg
     * */
    @PostMapping("/lerg/search")
    @PreAuthorize("hasAnyAuthority('${Privilege.LergImport}', '${Privilege.ViewLerg}')")
    @ResponseBody
    fun searchLerg(@RequestBody r: TableQuery): ResponseEntity<TableResult> {
        return ResponseEntity.ok(lergImportService.searchLerg(r))
    }

    /**
     * Upload Rate File
     */
    @PostMapping("/rate/upload")
    @PreAuthorize("hasAuthority('${Privilege.RateImport}')")
    @ResponseBody
    fun uploadRate(@RequestParam("file") file: MultipartFile, @RequestParam("delimiter") delimiter: String): ResponseEntity<Any> {
        val originalFileName = file.originalFilename
        val ext = FilenameUtils.getExtension(originalFileName)

        val uploadDir = storageProperties.uploadDir ?: ""
        if (uploadDir.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse("Upload directory is invalid."))
        }

        var reader: CSVReader? = null
        try {
            // Make directory
            File(uploadDir).mkdirs()
            // Generate file name
            val filename = "rate_${UUID.randomUUID()}.$ext"

            val save2File = File(uploadDir + File.separator + filename)
            file.transferTo(save2File)
            val separator = when (delimiter) {
                InsertRateRequest.DelimiterEnum.COMMA.value -> ','
                InsertRateRequest.DelimiterEnum.PIPE.value -> '|'
                InsertRateRequest.DelimiterEnum.SEMICOLON.value -> ';'
                InsertRateRequest.DelimiterEnum.TAB.value -> '\t'
                else -> throw BadRequestException("Delimiter not specified")
            }

            // Try open file
            reader = CSVReaderBuilder(FileReader(save2File))
                    .withCSVParser(
                            CSVParserBuilder()
                                    .withSeparator(separator)

                                    .build())
                    .build()

            val row = reader.readNext()

            val columns = mutableListOf<String>()

            // Support 20 columns
            for (i in 0..20) {
                columns.add(if (row.size > i) row[i] else "")
            }

            return ResponseEntity.ok(UploadRateResponse().filename(filename).message("").columns(columns))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse("Upload failed."))
        } finally {
            reader?.close()
        }
    }

    /**
     * Insert Rate Decks
     */
    @PostMapping("/rate/insert")
    @PreAuthorize("hasAuthority('${Privilege.RateImport}')")
    @ResponseBody
    fun insertRateDeck(@RequestBody r: InsertRateRequest, user: AppUser): ResponseEntity<Any> {
        val uploadDir = storageProperties.uploadDir ?: ""
        val filePath = uploadDir + File.separator + r.filename

        if (r.rateName?.trim()?.isNotEmpty() != true || r.rateName?.trim()?.isNotEmpty() != true) {
            throw BadRequestException("Please specify RateName and CIC")
        }

        // Check column indices

        val file = File(filePath)

        if (!file.exists() || !file.isFile || r.delimiter == null)
            return ResponseEntity.badRequest()
                    .body(BaseResponse("Uploaded file not found"))

        val separator = when (r.delimiter) {
            InsertRateRequest.DelimiterEnum.COMMA -> ','
            InsertRateRequest.DelimiterEnum.PIPE -> '|'
            InsertRateRequest.DelimiterEnum.SEMICOLON -> ';'
            InsertRateRequest.DelimiterEnum.TAB -> '\t'
            else -> throw BadRequestException("Delimiter not specified")
        }

        // Check carrier name, validate (3 character, uppercase), insert new carrier if user hasn't this carrier
        val carrierName = r.carrierName?.trim()?.toUpperCase() ?: ""
        if (carrierName.length != 3) {
            throw BadRequestException("Carrier Name must contain 3 characters")
        }

        val rateName = if (r.rateName.isNotEmpty()) r.rateName else ""
        if (rateName.length < 0) {
            throw BadRequestException("RateDeck Name must be specified")
        }
        // if posted rate deck name exist, reject
        if (rateDeckService.findRateDeckItemByUserIdAndRateName(user.id, rateName) != null) {
            throw BadRequestException("RateDeck '$rateName' already exists")
        }

        val userId: Long = user.id

        // Create a new thread to perform rate import
        var reader: CSVReader? = null
        Thread {

            var wholeCount = 0
            try {
                appState.setRateDeckInProgress(userId, true)

                // update rate deck list
                val rateDeckItem = rateDeckService.createRateDeckItemIfNotFound(rateName, carrierName, userId)
                rateDeckService.saveRateDeckItem(rateDeckItem)


                reader = CSVReaderBuilder(FileReader(file))
                        .withCSVParser(
                                CSVParserBuilder()
                                        .withSeparator(separator)

                                        .build())
                        .build()

                val values = ArrayList<String>()
                val batchSize = 3000

                for (row in reader!!) {
                    // Skip first row
                    if (r.isHasColumnHeader) {
                        r.isHasColumnHeader = false
                        continue
                    }

                    val effDate = if (r.effDate.isNotEmpty()) r.effDate else ""
                    val incrementDuration = r.incrementDuration?.let { if (r.incrementDuration.isNotEmpty()) r.incrementDuration else null }
                            ?: ""
                    val initDuration = r.initDuration?.let { if (r.initDuration.isNotEmpty()) r.initDuration else null }?.toFloatOrNull()
                            ?: ""
                    val interRate = r.interRate?.let { if (row.size > it) row[r.interRate].trim() else null }?.toFloatOrNull()
                    val intraRate = r.intraRate?.let { if (row.size > it) row[r.intraRate].trim() else null }?.toFloatOrNull()


                    val lata = r.lata?.let { if (row.size > it) row[r.lata].trim() else null } ?: ""
                    val npa = r.npa?.let { if (row.size > it) row[r.npa].trim() else null } ?: ""
                    val npaNxx = r.npanxx?.let {
                        if (row.size > it) {
                            row[r.npanxx].trim()
                        } else null
                    } ?: ""
                    val nxx = r.nxx?.let { if (row.size > it) row[r.nxx].trim() else null } ?: ""
                    val ocn = r.ocn?.let { if (row.size > it) row[r.ocn].trim() else null } ?: ""

                    // If non numeric npanxx found, just ignore
                    if (!npaNxx.isNumeric()) continue

                    values.add("('$npaNxx',${rateDeckItem.id}, '$effDate', '$incrementDuration','$initDuration',$interRate,$intraRate,'$lata','$npa','$nxx','$ocn')")

                    if (values.size >= batchSize) {
                        wholeCount += rateDeckService.insertBatch(values)
                        values.clear()
                    }
                }

                // If any padding (remaining) rates...
                if (values.size > 0) {
                    wholeCount += rateDeckService.insertBatch(values)
                    values.clear()
                }
            } catch (ex: Exception) {
                ex.printStackTrace()
            } finally {
                // Close reader
                reader?.close()
                // Notification
                val notification = Notification().apply {
                    this.userId = userId
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "Rate Import $wholeCount Record(s) done"
                    description = ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
                appState.setRateDeckInProgress(userId, false)
            }
        }.start()
        return ResponseEntity.ok(BaseResponse("Rate Decks Import Started"))
    }

    @GetMapping("/rate/list")
    @PreAuthorize("hasAnyAuthority('${Privilege.RateImport}', '${Privilege.ViewRate}')")
    @ResponseBody
    fun getRateDeckList(user: AppUser): ResponseEntity<List<RateDeckDTO>> {
        return ResponseEntity.ok(rateDeckService.getRateDeckByUserId(user.id).map {
            RateDeckDTO().apply {
                id = it.id
                name = it.name
                carrier = it.carrier
            }
        })
    }

    @PutMapping("/rate/list/rename/{id}")
    @PreAuthorize("hasAuthority('${Privilege.RateImport}')")
    @ResponseBody
    fun renameRateDeck(@PathVariable("id") rateDeckId: Long, @RequestParam("newName") newName: String, user: AppUser): ResponseEntity<Any> {
        // Check if role is able to rename
        val rateDeckItem = rateDeckService.findRateDeckItemById(rateDeckId)
        if (rateDeckItem == null || rateDeckItem.userId != user.id) {
            return ResponseEntity.badRequest().body(BaseResponse("Selected RateDeck($rateDeckId) doesn't exist or isn't yours"))
        }
        if (rateDeckService.renameRateDeckItemById(rateDeckId, newName) == 0)
            return ResponseEntity.badRequest().body(BaseResponse("Failed to rename"))
        return ResponseEntity.ok(BaseResponse("Rename RateDeck Success"))
    }

    @DeleteMapping("/rate/list/delete/{id}")
    @PreAuthorize("hasAuthority('${Privilege.RateImport}')")
    @ResponseBody
    fun deleteRateDeck(@PathVariable("id") rateDeckId: Long, user: AppUser): ResponseEntity<Any> {
        // Check if role is deletable
        val rateDeckItem = rateDeckService.findRateDeckItemById(rateDeckId)
        if (rateDeckItem == null || rateDeckItem.userId != user.id) {
            return ResponseEntity.badRequest().body(BaseResponse("Selected RateDeck($rateDeckId) doesn't exist or isn't yours"))
        }
        try {
            rateDeckService.deleteRateDeck(rateDeckItem)
        } catch (ex: Exception) {
            ex.printStackTrace()
        }
        return ResponseEntity.ok(BaseResponse("Rate Decks Delete Success"))
    }


    @PostMapping("/rate/search")
    @PreAuthorize("hasAnyAuthority('${Privilege.RateImport}', '${Privilege.ViewRate}')")
    @ResponseBody
    fun searchRate(@RequestBody r: TableQuery): ResponseEntity<TableResult> {
        return ResponseEntity.ok(rateDeckService.searchRateDeckData(r))
    }

    /**
     * Get ALL LCR REPORT LIST
     */
    @GetMapping("/lcr_report/list")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun getLcrReportList(user: AppUser): ResponseEntity<List<LcrReportDTO>> {
        return ResponseEntity.ok(lcrReportService.findLcrReportsByUserId(user.id).map {
            LcrReportDTO().apply {
                id = it.id
                name = it.name
            }
        })
    }

    /**
     * LCR Report List Search
     */
    @PostMapping("/lcr_report/search")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun searchLcrReportData(@RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(lcrReportService.searchLcrReportByUserId(r, user.id))
    }


    /**
     * Create a new LCR Report & Report Data
     */
    @PostMapping("/lcr_report")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun generateLCRReport(@RequestBody r: LCRReportRequest, user: AppUser): ResponseEntity<Any> {
        if (appState.isRateDeckInProgress(user.id))
            throw BadRequestException("Rate Deck Import in progress, Please wait a moment")

        if (r.rateNames == null || r.rateNames.size < 1) {
            throw BadRequestException("Please select more than 1 rate deck(s) to generate LCR report")
        }

        if (r.name?.isNotEmpty() != true) {
            throw BadRequestException("Please set name for new LCR Report")
        }

        if (lcrReportService.findLcrReport(user.id, r.name) != null) {
            throw BadRequestException("The report with '${r.name}' exists. Please try with anther name")
        }

        for (rateName in r.rateNames) {
            if (rateDeckService.findRateDeckItemByUserIdAndRateName(user.id, rateName) == null)
                return ResponseEntity.badRequest().body(BaseResponse("No RateDeck named '($rateName)' found"))
        }

        Thread {
            try {
                lcrReportService.generateLcrReportByRateNamesNew(user, r.rateNames, r.name)
            } catch (ex: Exception) {
                ex.printStackTrace()
                // Notification
                val notification = Notification().apply {
                    userId = user.id
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "LcrReport Generation failed"
                    description = ex.message ?: ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
            } finally {
                // Notification
                val notification = Notification().apply {
                    userId = user.id
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "LcrReport Generation was done"
                    description = ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
            }
        }.start()
        return ResponseEntity.ok(BaseResponse("LcrReport Generation started"))
    }

    /**
     * LCR Report Data view by id
     */
    @PostMapping("/lcr_report/{id}")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun searchLcrReportDataById(@PathVariable("id") reportId: Long, @RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(lcrReportService.searchLcrReportDataByReportId(r, reportId))
    }

    @DeleteMapping("/lcr_report/{id}")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun deleteLcrReportById(@PathVariable("id") reportId: Long, user: AppUser): ResponseEntity<Any> {
        lcrReportService.deleteLcrReportDataByReportId(reportId)
        return ResponseEntity.ok(BaseResponse("Deleted"))
    }

    @PostMapping("/lcr_report/{id}/download")
    @PreAuthorize("hasAuthority('${Privilege.CPRReport}')")
    fun downloadLcrReportDataById(@PathVariable("id") reportId: Long, user: AppUser, response: HttpServletResponse) {

        response.contentType = "text/csv"
        response.setHeader("Content-Disposition", "attachment; filename=\"lcr_report.csv\"")

        val writer = OutputStreamWriter(response.outputStream)

        try {
            writer.write("NPANXX,MIN_RATE,Carrier1,Carrier2,Carrier3,Carrier4,Carrier5\n")
            fun writeRows(rows: List<LcrReportData>) {
                for (i in 0 until rows.count()) {
                    with(rows[i]) {
                        writer.write("$npaNxx,${String.format("%.5f", minRate)},$carrier_1,$carrier_2,$carrier_3,$carrier_4,$carrier_5\n")
                    }
                }
            }

            val (firstItems, totalPages) = lcrReportService.getLcrData(reportId)
            writeRows(firstItems)
            // first Item
            if (totalPages >= 0) {
                for (i in 1 until totalPages) {
                    writeRows(lcrReportService.getLcrData(reportId, i).first)
                }
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
        } finally {
            writer.flush()
            writer.close()
        }
    }


    @PostMapping("/cpr_report")
    @PreAuthorize("hasAuthority('${Privilege.CPRReport}')")
    @ResponseBody
    fun generateCprReport(@RequestBody r: CreateCprReportRequest, user: AppUser): ResponseEntity<Any> {
        if (appState.isLergImportInProgress) {
            throw BadRequestException("LergImport in progress, Please wait a moment")
        }
        if (appState.isRateDeckInProgress(user.id))
            throw BadRequestException("Rate Deck Import in progress, Please wait a moment")
        if (appState.isCdrImportInProgress(user.id))
            throw BadRequestException("CDR Import in progress, Please wait a moment")

        if (r.name?.isEmpty() != false) {
            throw BadRequestException("Please set name for new CPR Report")
        }

        if (r.defaultRate == null) {
            throw BadRequestException("Please specify default rate")
        }

        if (cprReportService.findCprReportByName(r.name, user.id) != null) {
            throw BadRequestException("The report with '${r.name}' exists. Please try with anther name")
        }

        val lcrReport = lcrReportService.findLcrReportById(r.lcrReportId)
                ?: throw BadRequestException("No lcr report with id '${r.lcrReportId}' found")
        val userId = user.id
        var count = 0

        val newCprReportItem = CprReport(r.name, userId)
        newCprReportItem.lcrReport = lcrReport
        cprReportService.saveCprReportItem(newCprReportItem)

        Thread {
            try {
                count = cprReportService.generateCprReport(lcrReport.id, r.name, userId, newCprReportItem.id, r.defaultRate)
            } catch (ex: Exception) {
                ex.printStackTrace()
            } finally {
                // Notification
                val notification = Notification().apply {
                    this.userId = userId
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "CprReport Generation ($count records) was done"
                    description = ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
            }
        }.start()
        return ResponseEntity.ok(BaseResponse("CprReport Generation started"))
    }

    @PostMapping("/cpr_report/list")
    @PreAuthorize("hasAuthority('${Privilege.CPRReport}')")
    @ResponseBody
    fun getCprReports(@RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(cprReportService.searchCprReportsByUserId(r, user.id))
    }

    @PostMapping("/cpr_report/{id}")
    @PreAuthorize("hasAuthority('${Privilege.CPRReport}')")
    @ResponseBody
    fun getCprReportDataById(@PathVariable id: Long, @RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(cprReportService.searchReportDataByReportId(r, id, user.id))
    }

    @PostMapping("/cpr_report/{id}/download")
    @PreAuthorize("hasAuthority('${Privilege.CPRReport}')")
    fun downloadCprReportDataById(@PathVariable("id") reportId: Long, user: AppUser, response: HttpServletResponse) {

        response.contentType = "text/csv"
        response.setHeader("Content-Disposition", "attachment; filename=\"cpr_report.csv\"")

        val writer = OutputStreamWriter(response.outputStream)

        try {
            writer.write("Ani,Cost,Duration,Rate,LRN,ReRate,CostSavings,Carrier\n")
            fun writeRows(rows: List<CprReportData>) {
                for (i in 0 until rows.count()) {
                    with(rows[i]) {
                        writer.write("$rowAni,$cost,$duration,$rate,$lrn,${String.format("%.5f", reRate)},${String.format("%.5f", costSavings)},$carrier\n")
                    }
                }
            }

            val (firstItems, totalPages) = cprReportService.getCprData(reportId)
            writeRows(firstItems)
            // first Item
            if (totalPages >= 0) {
                for (i in 1 until totalPages) {
                    writeRows(cprReportService.getCprData(reportId, i).first)
                }
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
        } finally {
            writer.flush()
            writer.close()
        }
    }

    @PostMapping("cpr_report/{id}/download_npanxx")
    @PreAuthorize("hasAuthority('${Privilege.CPRReport}')")
    fun downloadCprReportNpaNxxDataById(@PathVariable("id") reportId: Long, user: AppUser, response: HttpServletResponse) {
        response.contentType = "text/csv"
        response.setHeader("Content-Disposition", "attachment; filename=\"cpr_report_npanxx.csv\"")

        val writer = OutputStreamWriter(response.outputStream)

        try {
            writer.write("Lata,LRN/6digits,LCRVendor,LCRVendor/Rate\n")
            fun writeRows(rows: List<CprNpanxxReportData>) {
                for (i in 0 until rows.count()) {
                    with(rows[i]) {
                        writer.write("$lata,$npaNxx,$carrier rate,${String.format("%.5f", rate)}\n")
                    }
                }
            }

            val (firstItems, totalPages) = cprReportService.getCprNpaNxxsData(reportId)
            writeRows(firstItems)
            // first Item
            if (totalPages >= 0) {
                for (i in 1 until totalPages) {
                    writeRows(cprReportService.getCprNpaNxxsData(reportId, i).first)
                }
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
        } finally {
            writer.flush()
            writer.close()
        }
    }

    @GetMapping("/cpr_report/{id}/summary")
    @ResponseBody
    fun getCPRReportSummary(@PathVariable("id") reportId: Long): ResponseEntity<CprReportSummary> {
        val report = cprReportService.findById(reportId) ?: throw BadRequestException("No report exist with $reportId")
        val summary = with(report) {
            CprReportSummary()
                    .averageRate(averageRate)
                    .defaultCarrier(defaultCarrier)
                    .defaultCarrierNpaNxx(defaultCarrierNpaNxx)
                    .totalCost(totalCost)
        }
        return ResponseEntity.ok(summary)
    }

    /**
     * Upload CDR File
     */
    @PostMapping("/cdr/upload")
    @PreAuthorize("hasAuthority('${Privilege.CDRImport}')")
    @ResponseBody
    fun uploadCDR(@RequestParam("file") file: MultipartFile, @RequestParam("delimiter") delimiter: String): ResponseEntity<Any> {
        val originalFileName = file.originalFilename
        val ext = FilenameUtils.getExtension(originalFileName)

        val uploadDir = storageProperties.uploadDir ?: ""
        if (uploadDir.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponse("Upload directory is invalid."))
        }

        var reader: CSVReader? = null
        try {
            // Make directory
            File(uploadDir).mkdirs()
            // Generate file name
            val filename = "rate_${UUID.randomUUID()}.$ext"

            val save2File = File(uploadDir + File.separator + filename)
            file.transferTo(save2File)
            val separator = when (delimiter) {
                InsertRateRequest.DelimiterEnum.COMMA.value -> ','
                InsertRateRequest.DelimiterEnum.PIPE.value -> '|'
                InsertRateRequest.DelimiterEnum.SEMICOLON.value -> ';'
                InsertRateRequest.DelimiterEnum.TAB.value -> '\t'
                else -> throw BadRequestException("Delimiter not specified")
            }

            // Try open file
            reader = CSVReaderBuilder(FileReader(save2File))
                    .withCSVParser(
                            CSVParserBuilder()
                                    .withSeparator(separator)

                                    .build())
                    .build()

            val row = reader.readNext()

            val columns = mutableListOf<String>()

            // Support 20 columns
            for (i in 0..20) {
                columns.add(if (row.size > i) row[i] else "")
            }

            return ResponseEntity.ok(UploadCDRResponse().filename(filename).message("").columns(columns))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse("Upload failed."))
        } finally {
            reader?.close()
        }
    }


    /**
     * Insert CDR
     */
    @PostMapping("/cdr/insert")
    @PreAuthorize("hasAuthority('${Privilege.RateImport}')")
    @ResponseBody
    fun insertCDR(@RequestBody r: InsertCDRRequest, user: AppUser): ResponseEntity<Any> {
        // Check if CdrImportInProgress is true
        if (appState.isCdrImportInProgress(user.id))
            throw BadRequestException("CDR Import in progress, Please wait a moment")

        if (r.durationUnit != InsertCDRRequest.DurationUnitEnum.MINUTE && r.durationUnit != InsertCDRRequest.DurationUnitEnum.SECOND) {
            throw BadRequestException("Please select duration unit for this cdr file")
        }

        val uploadDir = storageProperties.uploadDir ?: ""
        val filePath = uploadDir + File.separator + r.filename

        // Check column indices

        val file = File(filePath)

        if (!file.exists() || !file.isFile || r.delimiter == null)
            return ResponseEntity.badRequest()
                    .body(BaseResponse("Uploaded file not found"))

        val separator = when (r.delimiter) {
            InsertCDRRequest.DelimiterEnum.COMMA -> ','
            InsertCDRRequest.DelimiterEnum.PIPE -> '|'
            InsertCDRRequest.DelimiterEnum.SEMICOLON -> ';'
            InsertCDRRequest.DelimiterEnum.TAB -> '\t'
            else -> throw BadRequestException("Delimiter not specified")
        }

        val userId = user.id
        // Create a new thread to perform cdr import
        var reader: CSVReader? = null
        Thread {
            var wholeCount = 0
            try {
                // Set AppState: CdrImportInProgress to true
                appState.setCdrImportInProgress(userId, true)

                // Build reader
                if (r.insertType == InsertCDRRequest.InsertTypeEnum.OVERWRITE) {
                    cdrDataService.deleteAllByUserId(userId)
                }


                reader = CSVReaderBuilder(FileReader(file))
                        .withCSVParser(
                                CSVParserBuilder()
                                        .withSeparator(separator)

                                        .build())
                        .build()

                val batchSize = 2000
                val arr = ArrayList<String>()
                for (row in reader!!) {
                    // Skip first row
                    if (r.isHasColumnHeader) {
                        r.isHasColumnHeader = false
                        continue
                    }

                    val rowAni = r.rowAni?.let { if (row.size > it) row[r.rowAni].trim() else null } ?: ""

                    var duration = r.duration?.let { if (row.size > it) row[r.duration].trim() else null }?.toFloatOrNull()
                            ?: continue

                    // In case of minute, just multiply with 60, so all values are stored in seconds.
                    if (r.durationUnit == InsertCDRRequest.DurationUnitEnum.MINUTE)
                        duration *= 60

                    if (rowAni.isEmpty() || !rowAni.isNumeric() || rowAni.length < 10 || rowAni.startsWith("000000"))
                        continue

                    val cost = r.cost?.let { if (row.size > it) row[r.cost].trim() else null }?.toFloatOrNull()
                    val rate = r.rate?.let { if (row.size > it) row[r.rate].trim() else null }?.toFloatOrNull()
                    var lrn = r.lrn?.let {
                        if (row.size > it) {
                            row[r.lrn].trim()
                        } else null
                    } ?: ""

//                  One step import fill npanxx from lrn
//                    lrn = if (lrn.isEmpty()) "(SELECT ld.lrn from lrn_data ld WHERE ld.did = '$rowAni')" else "'$lrn'"
//
//                    //val npaNxx = "IF(CHAR_LENGTH(SUBSTR($lrn, 0, 6)) >= 6, SUBSTR($lrn, 0, 6), SUBSTR('$rowAni', 0, 6))"
//                    val aniPrefix = rowAni.substring(0, 6)  // kotlin
//
//                    val npaNxx = "IF(CHAR_LENGTH(SUBSTR($lrn, 1, 6)) >= 6, SUBSTR($lrn, 1, 6), '$aniPrefix')"

//                  One step import ignore lrn
//                    var npaNxx: String
//                    if (lrn.isEmpty()) {
//                        lrn = "'$rowAni'"
//                        npaNxx = rowAni.substring(0,6)
//                    }
//
//                    arr.add("('$rowAni', $cost, $duration, $lrn, $rate, $npaNxx)")
//
//                    // When exceeded batch size,
//                    if (arr.size >= batchSize) {
//                        wholeCount += cdrDataService.insertBatch(arr, userId)
//                        arr.clear()
//                    }
//                }
//
//                // If any padding (remaining) cdrs...
//                if (arr.size > 0) {
//                    wholeCount += cdrDataService.insertBatch(arr, userId)
//                }

                    // Three step import
                    arr.add("('$rowAni', $cost, $duration, '$lrn', $rate)")

                    // When exceeded batch size,
                    if (arr.size >= batchSize) {
                        wholeCount += cdrDataService.insertBatchImproved(arr, userId)
                        arr.clear()
                    }
                }

                // If any padding (remaining) cdrs...
                if (arr.size > 0) {
                    wholeCount += cdrDataService.insertBatchImproved(arr, userId)
                }

                // prepare cdr data for lata_npanxx_report_1 (group by row_ani, fill npa_nxx)
                cdrDataService.combineWithLrn(userId)

            } catch (ex: Exception) {
                ex.printStackTrace()
            } finally {
                // Close reader
                reader?.close()
                // Notification
                val notification = Notification().apply {
                    this.userId = userId
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "CDR Import $wholeCount Record(s) done"
                    description = ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)

                // Set AppState: CdrImportInProgress to false
                appState.setCdrImportInProgress(userId, false)
            }
        }.start()
        return ResponseEntity.ok(BaseResponse("CDR Import started"))
    }

    @PostMapping("/cdr/search")
    @PreAuthorize("hasAnyAuthority('${Privilege.CDRImport}', '${Privilege.ViewCDR}')")
    @ResponseBody
    fun searchCDR(@RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(cdrDataService.searchCDR(r, user.id))
    }

    /**
     * Generate LataNpanxxReport1
     */
    @PostMapping("/lata_npanxx_report_1")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun generateLataNpanxxReport1(user: AppUser): ResponseEntity<Any> {
        if (appState.isCdrImportInProgress(user.id))
            throw BadRequestException("CDR Import in progress, Please wait a moment")
        if (appState.isLataNpanxxReport1InProgress(user.id))
            throw BadRequestException("LataNpanxxReport1 in progress, Please wait a moment")

        val userId = user.id
        Thread {
            try {
                appState.setLataNpanxxReport1InProgress(userId, true)
                cdrDataService.emptyLataNpanxxReport1(userId)
                cdrDataService.generateLataNpanxxReport1(userId)
            } catch (ex: Exception) {
                // Notification
                val notification = Notification().apply {
                    this.userId = userId
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "LataNpanxxReport 1 Generation failed"
                    description = ex.message ?: ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
            } finally {
                // Notification
                val notification = Notification().apply {
                    this.userId = userId
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "LataNpanxxReport 1 Generation was done"
                    description = ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
                appState.setLataNpanxxReport1InProgress(userId, false)
            }
        }.start()
        return ResponseEntity.ok(BaseResponse("LataNpanxxReport 1 Generation started"))
    }

    @PostMapping("/lata_npanxx_report_1/search")
    @PreAuthorize("hasAnyAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun searchLataNpanxxReport1(@RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(cdrDataService.searchLataNpanxxReport1(r, user.id))
    }

    // for lata npanxx report 2

    @GetMapping("/lata_npanxx_report_2/list")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun getLataNpanxxReport2List(user: AppUser): ResponseEntity<List<LataNpanxxReport2DTO>> {
        return ResponseEntity.ok(lataNpanxxReport2Service.findLataNpanxxReport2sByUserId(user.id).map {
            LataNpanxxReport2DTO().apply {
                id = it.id
                name = it.name
            }
        })
    }

    /**
     * LCR Report List Search
     */
    @PostMapping("/lata_npanxx_report_2/search")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun searchLataNpanxxReport2(@RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(lataNpanxxReport2Service.searchLataNpanxxReport2ByUserId(r, user.id))
    }

    /**
     * Create a new Lata Npanxx Report 2
     */
    @PostMapping("/lata_npanxx_report_2")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun generateLataNpanxxReport2(@RequestBody r: LataNpanxxReport2Request, user: AppUser): ResponseEntity<Any> {
        if (appState.isRateDeckInProgress(user.id))
            throw BadRequestException("Rate Deck Import in progress, Please wait a moment")

        if (r.rateNames == null || r.rateNames.size < 1) {
            throw BadRequestException("Please select more than 1 rate deck(s) to generate LataNpanxx Report2")
        }

        if (r.name?.isNotEmpty() != true) {
            throw BadRequestException("Please set name for new LataNpanxx Report2")
        }

        if (lataNpanxxReport2Service.findLataNpanxxReport2(user.id, r.name) != null) {
            throw BadRequestException("The report with '${r.name}' exists. Please try with anther name")
        }

        for (rateName in r.rateNames) {
            if (rateDeckService.findRateDeckItemByUserIdAndRateName(user.id, rateName) == null)
                return ResponseEntity.badRequest().body(BaseResponse("No RateDeck named '($rateName)' found"))
        }

        val userId = user.id
        Thread {
            try {
                lataNpanxxReport2Service.generateLataNpanxxReport2(user, r.rateNames, r.name)
            } catch (ex: Exception) {
                ex.printStackTrace()
                // Notification
                val notification = Notification().apply {
                    this.userId = userId
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "LataNpanxxReport2 Generation failed"
                    description = ex.message ?: ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
            } finally {
                // Notification
                val notification = Notification().apply {
                    this.userId = userId
                    section = Notification.SECTION_ADMIN
                    type = Notification.TYPE_INFO
                    message = "LataNpanxxReport2 Generation was done"
                    description = ""
                }
                // Save notification will save notification to db and send to user subscribing to notification.
                notificationService.save(notification)
            }
        }.start()
        return ResponseEntity.ok(BaseResponse("LataNpanxxReport2 Generation started"))
    }

    /**
     * LCR Report Data view by id
     */
    @PostMapping("/lata_npanxx_report_2/{id}")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun searchLataNpanxxReport2DataById(@PathVariable("id") reportId: Long, @RequestBody r: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        return ResponseEntity.ok(lataNpanxxReport2Service.searchLataNpanxxReport2DataByReportId(r, reportId))
    }

    @DeleteMapping("/lata_npanxx_report_2/{id}")
    @PreAuthorize("hasAuthority('${Privilege.LCRReport}')")
    @ResponseBody
    fun deleteLataNpanxxReport2ById(@PathVariable("id") reportId: Long, user: AppUser): ResponseEntity<Any> {
        lataNpanxxReport2Service.deleteLataNpanxxReport2DataByReportId(reportId)
        return ResponseEntity.ok(BaseResponse("Deleted"))
    }

    @PostMapping("/lata_npanxx_report_2/{id}/download")
    @PreAuthorize("hasAuthority('${Privilege.CPRReport}')")
    fun downloadLataNpanxxReport2DataById(@PathVariable("id") reportId: Long, user: AppUser, response: HttpServletResponse) {

        response.contentType = "text/csv"
        response.setHeader("Content-Disposition", "attachment; filename=\"lata_npanxx_report_2.csv\"")

        val writer = OutputStreamWriter(response.outputStream)

        try {
            //writer.write("LATA,STATE,NPANXX,CALLS,Total Duration,MIN_RATE,MIN_CARRIER,CARRIER_1,CARRIER_2,CARRIER_3,CARRIER_4,CARRIER_5\n")
            writer.write("NPANXX,LATA,STATE,CALLS,Total Duration,MIN_RATE,MIN_CARRIER\n")
            fun writeRows(rows: List<LataNpanxxReport2Data>) {
                for (i in 0 until rows.count()) {
                    with(rows[i]) {
                        //writer.write("$lata,$state,$npaNxx,$calls,$totalDuration,${String.format("%.5f", minRate)},$minCarrier,$carrier_1,$carrier_2,$carrier_3,$carrier_4,$carrier_5\n")
                        val _lata = if (lata == null) "" else lata
                        val _state = if (state == null) "" else state
                        writer.write("$npaNxx,$_lata,$_state,$calls,$totalDuration,${String.format("%.5f", minRate)},$minCarrier\n")
                    }
                }
            }

            val (firstItems, totalPages) = lataNpanxxReport2Service.getLataNpanxxReport2Data(reportId)
            writeRows(firstItems)
            // first Item
            if (totalPages >= 0) {
                for (i in 1 until totalPages) {
                    writeRows(lataNpanxxReport2Service.getLataNpanxxReport2Data(reportId, i).first)
                }
            }
        } catch (ex: Exception) {
            ex.printStackTrace()
        } finally {
            writer.flush()
            writer.close()
        }
    }


}