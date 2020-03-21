package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.persistance.dao.CprNpanxxReportDataRepository
import com.digitalipvoice.cps.persistance.dao.CprReportDataRepository
import com.digitalipvoice.cps.persistance.dao.CprReportRepository
import com.digitalipvoice.cps.persistance.model.CprNpanxxReportData
import com.digitalipvoice.cps.persistance.model.CprReport
import com.digitalipvoice.cps.persistance.model.CprReportData
import com.digitalipvoice.cps.utils.findByIdKt
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class CprReportService {
    val log = logger(javaClass)
    private val listTable = "cpr_report"
    private val dataTable = "cpr_report_data"
    private val cdrTable = "cdr_data"
    private val cprNpaNxxReportTable = "cpr_npanxx_report_data"

    // This is limit from somos
    private val cprNpaNxxReportMaxCount = 33000

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    private lateinit var cprReportRepository: CprReportRepository

    @Autowired
    private lateinit var cprReportDataRepository: CprReportDataRepository

    @Autowired
    private lateinit var cprNpanxxReportDataRepository: CprNpanxxReportDataRepository

    fun findById(id:Long) = cprReportRepository.findByIdKt(id)

    // for cpr report list itme
    fun findCprReportByName(name: String, userId: Long) = cprReportRepository.findByUserIdAndName(userId, name)

    fun searchCprReportsByUserId(r: TableQuery, userId: Long) = cprReportRepository.searchCprReportByUserId(r, userId)

    fun saveCprReportItem(cprReport: CprReport) = cprReportRepository.saveAndFlush(cprReport)

    fun deleteCprReportItem(cprReport: CprReport) = cprReportRepository.delete(cprReport)

    // for cpr report data
    fun searchReportDataByReportId(r: TableQuery, reportId: Long, userId: Long) = cprReportDataRepository.searchReportDataByUserIdAndReportId(r, reportId, userId)

    // Get page
    fun getCprData(reportId: Long, page: Int = 0, pageSize: Int = 1000): Pair<List<CprReportData>, Int> {
        val pageable = PageRequest.of(0, pageSize, Sort.by("id"))
        val result = cprReportDataRepository.findAllByCprReportId(reportId, pageable)
        return Pair(result.content, result.totalPages)
    }

    // Get cpr_npa_nxx data
    fun getCprNpaNxxsData(reportId: Long, page: Int = 0, pageSize: Int = 2000): Pair<List<CprNpanxxReportData>, Int> {
        val pageable = PageRequest.of(0, pageSize, Sort.by("id"))
        val result = cprNpanxxReportDataRepository.findAllByCprReportId(reportId, pageable)
        return Pair(result.content, result.totalPages)
    }

    // generate cpr report
    fun generateCprReport(lcrReportId: Long, name: String, userId: Long, reportId: Long, defaultRate: Float): Int {
        /*
        val sql = """
            INSERT INTO $dataTable (row_ani, user_id, cost, duration, lrn, rate, re_rate, cost_savings, carrier, cpr_report_id)
            SELECT
                cd.row_ani, cd.user_id, IF(cd.cost IS NULL, 0, cd.cost) , cd.duration, cd.lrn, cd.rate, ld.min_rate, IF(cd.cost IS NULL, 0, cd.cost) - (ld.min_rate*cd.duration), ld.min_carrier, $reportId
            FROM (SELECT * FROM cdr_data WHERE user_id = '$userId') cd
                LEFT JOIN (SELECT * FROM lcr_report_data WHERE lcr_report_id = $lcrReportId) ld ON cd.npa_nxx = ld.npa_nxx
        """.trimIndent()
        */
        var retVal = 0
        try {
            var sql = """
            INSERT INTO $dataTable (row_ani, user_id, cost, duration, lrn, rate, carrier, cpr_report_id, npa_nxx)
            SELECT
                cd.row_ani, cd.user_id, cd.duration * IF(ld.min_rate IS NULL, '$defaultRate', ld.min_rate) / 60, cd.duration, cd.lrn, IF(ld.min_rate IS NULL, '$defaultRate', ld.min_rate), ld.carrier_1, $reportId, cd.npa_nxx
            FROM (SELECT * FROM cdr_data WHERE user_id = '$userId') cd
                LEFT JOIN (SELECT * FROM lcr_report_data WHERE lcr_report_id = $lcrReportId) ld ON cd.npa_nxx = ld.npa_nxx
        """.trimIndent()

            log.debug("Filling cpr report table with ----- $sql")

            // Step 1. Insert data into cpr_report_data
            retVal = jdbcTemplate.update(sql)

            // Step 2. Update cpr_report table with summary
            val sqlTotalCost = "SELECT SUM(cost) FROM cpr_report_data where cpr_report_id = $reportId"
            log.debug("Total Cost SQL ---- $sqlTotalCost")
            val totalCost = try {jdbcTemplate.queryForObject(sqlTotalCost, Double::class.java) } catch(ex:Exception) {null}?: 0.0

            val sqlAverageRate = "SELECT AVG(rate) FROM cpr_report_data where cpr_report_id = $reportId"
            log.debug("Average Rate SQL ---- $sqlTotalCost")
            val average = try {jdbcTemplate.queryForObject(sqlAverageRate, Double::class.java)?.toFloat() } catch(ex:Exception) {null}?: 0f

            log.debug("TotalCost=$totalCost\n Average Rate=$average")

            // Get default carrier first, which has the most count of npa_nxx in cpr_report_table
            sql = """SELECT t.npa_nxx, crd.carrier
                FROM (SELECT crd.npa_nxx FROM cpr_report_data crd WHERE crd.cpr_report_id=$reportId AND crd.carrier IS NOT NULL GROUP BY crd.npa_nxx ORDER BY COUNT(crd.npa_nxx) DESC LIMIT 1) t
                INNER JOIN cpr_report_data crd ON crd.npa_nxx = t.npa_nxx LIMIT 1
            """.trimMargin()
            log.debug("Default Carrier and Default Npa NXX Fetch SQL ---- $sql")

            // Save cpr report table again.
            val map = jdbcTemplate.queryForMap(sql)
            val defaultCarrierNpaNxx = map["npa_nxx"]?.toString() ?: ""
            val defaultCarrier = map["carrier"]?.toString() ?: ""
            val cprReport = cprReportRepository.findByIdKt(reportId)
            cprReport?.let{
                it.defaultCarrier = defaultCarrier
                it.totalCost = totalCost
                it.averageRate = average
                it.defaultCarrierNpaNxx = defaultCarrierNpaNxx
                cprReportRepository.save(it)
            }

            log.debug("Updated CPR Report details with defaultCarrierNpaNxx = $defaultCarrierNpaNxx,  defaultCarrier = $defaultCarrier")


            // After getting default carrier, just fill the CprNpaNxxReportData table
            // Maximum 33K
            val tbl = """
                SELECT t.npa_nxx, t.report_id, t.sum_duration, t.rate, t.carrier, lerg.lata FROM
                 (
                    SELECT DISTINCT t.npa_nxx, '$reportId' as report_id , t.sum_duration, crd.rate, crd.carrier
                    FROM (SELECT crd.npa_nxx, SUM(crd.duration) as sum_duration FROM cpr_report_data crd WHERE crd.npa_nxx <> '$defaultCarrierNpaNxx' GROUP BY crd.npa_nxx  ORDER BY SUM(crd.duration) DESC ) t
                    INNER JOIN cpr_report_data crd ON crd.npa_nxx = t.npa_nxx
                 ) t
                 LEFT JOIN lerg_import lerg ON lerg.npa_nxx = t.npa_nxx
                 LIMIT $cprNpaNxxReportMaxCount
            """.trimIndent()

            sql = "INSERT INTO $cprNpaNxxReportTable (npa_nxx, cpr_report_id, sum_duration, rate, carrier, lata) $tbl"
            log.debug("Executing final sql to get 33K npa nxx records sorted by total duration ----------- $sql")

            // Insert into npanxx report table
            jdbcTemplate.update(sql)
        }catch(ex: Exception) {
            ex.printStackTrace()
            log.error("Exception Occured while generating CPR Report : ${ex.message}")
            throw ex
        }

        return retVal
    }

    /*
    fun getCprReportSummary(reportId: Long): CprReportSummary {
        val sqlTotalCost = "SELECT SUM(cost) FROM cpr_report_data where cpr_report_id = $reportId"
        val totalCost = try {jdbcTemplate.queryForObject(sqlTotalCost, Double::class.java) } catch(ex:Exception) {null}?: 0.0
        val sqlAverageRate = "SELECT AVG(rate) FROM cpr_report_data where cpr_report_id = $reportId"
        val average = try {jdbcTemplate.queryForObject(sqlAverageRate, Double::class.java)?.toFloat() } catch(ex:Exception) {null}?: 0f
        return CprReportSummary().averageRate(average).totalCost(totalCost)
    }*/
}