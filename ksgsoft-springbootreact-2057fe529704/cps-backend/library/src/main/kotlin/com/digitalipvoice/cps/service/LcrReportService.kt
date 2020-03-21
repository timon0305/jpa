package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.dao.LcrReportDataRepository
import com.digitalipvoice.cps.persistance.dao.LcrReportRepository
import com.digitalipvoice.cps.persistance.dao.RateDeckDataRepository
import com.digitalipvoice.cps.persistance.dao.RateDeckRepository
import com.digitalipvoice.cps.persistance.model.LcrReport
import com.digitalipvoice.cps.persistance.model.LcrReportData
import com.digitalipvoice.cps.utils.findByIdKt
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import java.util.*
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@Service
class LcrReportService {
    private val log = logger(javaClass)

    private val listTable = "lcr_report"
    private val dataTable = "lcr_report_data"

    @PersistenceContext
    private lateinit var em: EntityManager

    @Autowired
    private lateinit var lcrReportRepository: LcrReportRepository

    @Autowired
    private lateinit var lcrReportDataRepository: LcrReportDataRepository

    @Autowired
    private lateinit var rateDeckRepository: RateDeckRepository

    @Autowired
    private lateinit var rateDeckDataRepository: RateDeckDataRepository

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    companion object {
        const val maxComparableCarriers = 5
    }

    /**
     * Find Report by Id
     */
    fun findLcrReportById(id: Long) = lcrReportRepository.findByIdKt(id)


    /**
     * Search Report List By UserId
     */
    fun searchLcrReportByUserId(query: TableQuery, userId: Long) = lcrReportRepository.searchLcrReportByUserId(query, userId)

    fun generateLcrReportByRateNames(user: AppUser, rateNames: List<String>, name: String = "") {
        val rateDecks = rateNames.mapNotNull { rateDeckRepository.findByUserIdAndNameAndIsDeletedFalse(user.id, it) }
        val carriersForQuery = rateDecks.map { "'${it.carrier}'" }

        /*
        val current = LocalDateTime.now()
        var formatter = DateTimeFormatter.ISO_LOCAL_DATE
        var date = current.format(formatter).toString()
        date = date.replace("-", "")
        formatter = DateTimeFormatter.ISO_LOCAL_TIME
        var time = current.format(formatter).toString()
        time = time.replace(":", "")
        time = time.substring(0..(time.indexOf(".") - 1))


        val generatedName = "LcrReport_${user.username}_${user.id}_${date}_${time}"
        var reportName = name
        if (reportName.isEmpty())
            reportName = generatedName

        */

        val newLcrReportItem = LcrReport(name, user.id)
        newLcrReportItem.rateDecks = HashSet(rateDecks)


        /*newLcrReportItem.rateDecks =
        newLcrReportItem.rateDecks.*/
        saveLcrReport(newLcrReportItem)

        //deleteLcrReportDataByReportId(newLcrReportItem.id)

        // Sample query for generating Rate Report
        /** [r_RateName0 = 'r_'+rate_deck_id]
         *
         * INSERT INTO rate_report_data (npa_nxx, min_carrier, min_rate,  lcr_report_id)
         * SELECT
         *      r_RateName0.npa_nxx,
         *      (CASE
         *          WHEN LEAST(r_RateName0.inter_rate, r_RateName1.inter_rate) = r_RateName0.inter_rate THEN 'ATT'
         *          WHEN LEAST(r_RateName0.inter_rate, r_RateName1.inter_rate) = r_RateName1.inter_rate THEN 'TST'
         *          ELSE '---'
         *      End) as min_carrier,
         *      LEAST(r_RateName0.inter_rate, r_RateName1.inter_rate) as min_rate,
         *      17012 as report_id
         * FROM rate_deck_data r_RateName0
         *      LEFT JOIN rate_deck_data r_tst ON r_RateName0.npa_nxx = r_RateName1.npa_nxx
         * WHERE
         *      //r_RateName0.user_id = 45 AND r_RateName0.carrier_name = 'ATT' AND
         *      //r_RateName1.user_id = 45 AND r_RateName1.carrier_name = 'TST'
         *
         *      r_RateName0.rate_deck_id = id1 AND
         *      r_RateName1.rate_deck_id = id2
         */
        val tableList = rateDecks.map { "r_${it.id}" }
        val leastList = tableList.map { "${it}.inter_rate" }

        val leastListString = leastList.joinToString(prefix = "(", postfix = ")", separator = ",")
        val whenList: ArrayList<String> = ArrayList()
        val fromList: ArrayList<String> = ArrayList()
        val whereList: ArrayList<String> = ArrayList()
        for (i in 0 until tableList.count()) {
            whenList.add("WHEN LEAST${leastListString} = ${tableList[i]}.inter_rate THEN ${carriersForQuery[i]}")
            if (i == 0) {
                fromList.add("FROM rate_deck_data ${tableList[0]}")
            } else {
                fromList.add("LEFT JOIN rate_deck_data ${tableList[i]} ON ${tableList[0]}.npa_nxx = ${tableList[i]}.npa_nxx")
            }
            whereList.add("${tableList[i]}.rate_deck_id = ${rateDecks[i].id}")
        }

        val partNpanxx = "${tableList[0]}.npa_nxx as npa_nxx"
        val partMinCarrier = whenList.joinToString(prefix = "(CASE ", postfix = " ELSE 'UNKNOWN' END) AS min_carrier", separator = " ")
        val partMinRate = "LEAST${leastListString} AS min_rate"
        val partReportId = "${newLcrReportItem.id} AS report_id"
        val partFrom = fromList.joinToString(prefix = " ", postfix = " ", separator = " ")
        val partWhere = whereList.joinToString(prefix = " WHERE ", postfix = " ", separator = " AND ")

        // generate RateReportData
        val queryStringBuffer = StringBuffer()
        queryStringBuffer.append("INSERT INTO lcr_report_data (npa_nxx, min_carrier, min_rate,  lcr_report_id)")
        queryStringBuffer.append("SELECT ${partNpanxx}, ${partMinCarrier}, ${partMinRate}, ${partReportId} ")
        queryStringBuffer.append(partFrom)
        queryStringBuffer.append(partWhere)
        queryStringBuffer.append(";")

        val sql = queryStringBuffer.toString()

        try {

            log.debug("--------------------Executing SQL to generate LCR Report---------------------")
            log.debug(sql)
            log.debug("-----------------------------------------------------------------------------")

            jdbcTemplate.execute(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while LcrReport generate")
        }
    }

    fun generateLcrReportByRateNamesNew(user: AppUser, rateNames: List<String>, name: String = ""): Int {
        val rateDecks = rateNames.mapNotNull { rateDeckRepository.findByUserIdAndNameAndIsDeletedFalse(user.id, it) }
        val carriers = rateDecks.map { "${it.carrier}" }

        val newLcrReportItem = LcrReport(name, user.id)
        newLcrReportItem.rateDecks = HashSet(rateDecks)
        saveLcrReport(newLcrReportItem)

        if (rateDecks.size == 1) {
            val sql = """INSERT INTO $dataTable (lcr_report_id, npa_nxx, min_rate, carrier_1, min_carrier)
                SELECT
                    ${newLcrReportItem.id},
                    rdd.npa_nxx,
                    rdd.inter_rate,
                    rd.carrier,
                    rd.carrier
                FROM rate_deck_data rdd
                LEFT JOIN rate_deck rd ON rd.id = rdd.rate_deck_id
                WHERE rdd.rate_deck_id = ${rateDecks[0].id};
            """.trimMargin()
            return jdbcTemplate.update(sql)
        }
        val selectionQuery = createRateDeckMergeTable(newLcrReportItem.id, rateDecks.map { it.id }, carriers)
        return jdbcTemplate.update(selectionQuery)
    }

    /*
    fun createRateDeckMergeTable(ids:List<Long>) :List<String> {
        val tablePrefix = "t_" + UUID.randomUUID().toString().replace("-","")
        var tblCount = 0

        val resultArray = mutableListOf<String>()

        // Table Creation Query for each rate deck
        val rateDeckDataTables = ids.map{"${tablePrefix}_${tblCount++}"}
        val createTableQueries = ids.mapIndexed{ index, value -> "CREATE TABLE ${rateDeckDataTables[index]} (`npa_nxx` VARCHAR(20) NOT NULL, rate_1 FLOAT NULL DEFAULT NULL, PRIMARY KEY (`npa_nxx`)) SELECT inter_rate as rate_1, npa_nxx FROM rate_deck_data WHERE rate_deck_id = $value;\n"}

        resultArray.addAll(createTableQueries)

        fun unionTables(leftTable: String, rightTable:String, rightRateIndex:Int): String {
            val rateColumn = "rate_$rightRateIndex"

            val l = "l_$rightRateIndex"
            val r = "r_$rightRateIndex"

            val ll = "l_${rightRateIndex}_1"
            val rr = "r_${rightRateIndex}_1"

            val columns = (1 until rightRateIndex).joinToString(", ") { "$l.rate_$it as rate_$it" }
            val columnsll = (1 until rightRateIndex).joinToString(", ") { "$ll.rate_$it as rate_$it" }


            return """SELECT $l.npa_nxx, $columns, $r.rate_1 as $rateColumn FROM $leftTable $l
                LEFT JOIN $rightTable $r ON $l.npa_nxx = $r.npa_nxx
                UNION
                SELECT $rr.npa_nxx, $columnsll, $rr.rate_1 as $rateColumn FROM $leftTable $ll
                RIGHT JOIN $rightTable $rr ON $ll.npa_nxx = $rr.npa_nxx WHERE $ll.npa_nxx IS NULL
            """.trimMargin()
        }

        var tableQuery = unionTables(rateDeckDataTables[0], rateDeckDataTables[1], 2)
        if (ids.size > 2) {
            for (i in 2 until rateDeckDataTables.size) {
                val tableName = "${tablePrefix}_${tblCount++}"

                val rateCols = (1..i).joinToString(", ") { "rate_$it FLOAT NULL DEFAULT NULL" }
                val tableDefinition = "(`npa_nxx` VARCHAR(20) NOT NULL, $rateCols, PRIMARY KEY (`npa_nxx`))"
                val leftTableQuery = "CREATE TABLE $tableName $tableDefinition $tableQuery ;"
                resultArray.add(leftTableQuery)
                tableQuery = unionTables(tableName, rateDeckDataTables[i], i + 1)
            }
        }
        resultArray.add(tableQuery)
        return resultArray
    }
    */

    fun createRateDeckMergeTable(reportId: Long, ids: List<Long>, carriers: List<String>): String {
        // Table Creation Query for each rate deck
        val rateDeckDataTables = ids.map { "SELECT inter_rate as rate_1, npa_nxx FROM rate_deck_data WHERE rate_deck_id = $it" }

        fun unionTables(leftTable: String, rightTable: String, rightRateIndex: Int): String {
            val rateColumn = "rate_$rightRateIndex"
            val columns = (1 until rightRateIndex).joinToString(", ") { "l.rate_$it as rate_$it" }

            return """SELECT l.npa_nxx, $columns, r.rate_1 as $rateColumn FROM ($leftTable) l
                LEFT JOIN ($rightTable) r ON l.npa_nxx = r.npa_nxx
                UNION
                SELECT r.npa_nxx, $columns, r.rate_1 as $rateColumn FROM ($leftTable) l
                RIGHT JOIN ($rightTable) r ON l.npa_nxx = r.npa_nxx WHERE l.npa_nxx IS NULL
            """.trimMargin()
        }

        var tableQuery = unionTables(rateDeckDataTables[0], rateDeckDataTables[1], 2)
        if (rateDeckDataTables.size > 2)
            for (i in 2 until rateDeckDataTables.size) {
                tableQuery = unionTables(tableQuery, rateDeckDataTables[i], i + 1)
            }

        val strLeast = (1..ids.size).joinToString(", ", "LEAST (", ")") { "IF(t.rate_$it IS NULL, 99999, t.rate_$it)" }

        val carriersColumn = (1..maxComparableCarriers).joinToString(", ") { "carrier_$it" }


        val whenClauses = carriers.mapIndexed { index, value -> "WHEN $strLeast = t.rate_${index + 1} THEN '$value'" }

        val minCarrier = "(CASE ${whenClauses.joinToString(" ")} ELSE NULL END)"

        val carriersValues = (0 until maxComparableCarriers).map { i ->
            if (i < whenClauses.size) {
                val str = whenClauses.subList(i, whenClauses.size).joinToString(" ")
                "(CASE $str ELSE NULL END) as carrier_$i"
            } else {
                "NULL as carrier_$i"
            }
        }



        return """INSERT INTO lcr_report_data (lcr_report_id, npa_nxx, min_rate, min_carrier, $carriersColumn)
             SELECT '$reportId', t.npa_nxx, $strLeast, $minCarrier, ${carriersValues.joinToString(", ")}
             FROM ($tableQuery) t
        """.trimMargin()
    }


    fun findLcrReport(userId: Long, name: String) = lcrReportRepository.findByUserIdAndNameAndIsDeletedFalse(userId, name)

    fun findLcrReportsByUserId(userId: Long) = lcrReportRepository.findAllByUserIdAndIsDeletedFalse(userId)

    fun saveLcrReport(report: LcrReport) = lcrReportRepository.save(report)

    // For Data
    /**
     * Search Reports
     */
    fun searchLcrReportData(query: TableQuery) = lcrReportDataRepository.searchLcrReportData(query)

    /**
     * search LcrReportData by report id
     */
    fun searchLcrReportDataByReportId(query: TableQuery, reportId: Long) = lcrReportDataRepository.searchLcrReportDataByReportId(query, reportId)

    /**
     * delete LcrReportData by report id
     */
    fun deleteLcrReportDataByReportId(reportId: Long): Int {
        lcrReportRepository.findByIdKt(reportId)?.let {
            it.isDeleted = true
            lcrReportRepository.save(it)
        }

        val sql = "DELETE FROM $dataTable WHERE lcr_report_id = $reportId ;"
        try {
            return jdbcTemplate.update(sql)
        } catch (ex: java.lang.Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while LcrReportData delete")
        }
        return 0
    }

    // Get page
    fun getLcrData(reportId: Long, page: Int = 0, pageSize: Int = 1000): Pair<List<LcrReportData>, Int> {
        val pageable = PageRequest.of(0, pageSize, Sort.by("npaNxx"))
        val result = lcrReportDataRepository.findAllByLcrReportId(reportId, pageable)
        return Pair(result.content, result.totalPages)
    }

}