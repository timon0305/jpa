package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.dao.LataNpanxxReport2DataRepository
import com.digitalipvoice.cps.persistance.dao.LataNpanxxReport2Repository
import com.digitalipvoice.cps.persistance.dao.RateDeckDataRepository
import com.digitalipvoice.cps.persistance.dao.RateDeckRepository
import com.digitalipvoice.cps.persistance.model.LataNpanxxReport2
import com.digitalipvoice.cps.persistance.model.LataNpanxxReport2Data
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
class LataNpanxxReport2Service {
    private val log = logger(javaClass)

    private val listTable = "lata_npanxx_report_2"
    private val dataTable = "${listTable}_data"

    @PersistenceContext
    private lateinit var em: EntityManager

    @Autowired
    private lateinit var lataNpanxxReport2Repository: LataNpanxxReport2Repository

    @Autowired
    private lateinit var lataNpanxxReport2DataRepository: LataNpanxxReport2DataRepository

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
    fun findLataNpanxxReport2ById(id: Long) = lataNpanxxReport2Repository.findByIdKt(id)


    /**
     * Search Report List By UserId
     */
    fun searchLataNpanxxReport2ByUserId(query: TableQuery, userId: Long) = lataNpanxxReport2Repository.searchLataNpanxxReport2ByUserId(query, userId)

    fun generateLataNpanxxReport2(user: AppUser, rateNames: List<String>, name: String = ""): Int {
        val rateDecks = rateNames.mapNotNull { rateDeckRepository.findByUserIdAndNameAndIsDeletedFalse(user.id, it) }
        val carriers = rateDecks.map { "${it.carrier}" }

        val newLataNpanxxReport2Item = LataNpanxxReport2(name, user.id)
        newLataNpanxxReport2Item.rateDecks = HashSet(rateDecks)
        saveLataNpanxxReport2(newLataNpanxxReport2Item)

        if (rateDecks.size == 1) {
            val sql = """INSERT INTO $dataTable (lata_npanxx_report_2_id, npa_nxx, calls, lata, state, total_duration, min_rate, min_carrier, carrier_1)
                SELECT
                    ${newLataNpanxxReport2Item.id},
                    rdd.npa_nxx,
                    IFNULL(lnr1.calls, 0),
                    lnr1.lata,
                    lnr1.state,
                    IFNULL(lnr1.total_duration, 0),
                    rdd.inter_rate,
                    rd.carrier,
                    rd.carrier
                FROM rate_deck_data rdd
                LEFT JOIN rate_deck rd ON rd.id = rdd.rate_deck_id
                INNER JOIN lata_npanxx_report_1_${user.id} lnr1 ON lnr1.npa_nxx = rdd.npa_nxx
                WHERE rdd.rate_deck_id = ${rateDecks[0].id};
            """.trimMargin()
            return jdbcTemplate.update(sql)
        }
        val selectionQuery = createRateDeckMergeTable(newLataNpanxxReport2Item.id, rateDecks.map { it.id }, carriers, user.id)
        return jdbcTemplate.update(selectionQuery)
    }

    fun createRateDeckMergeTable(reportId: Long, ids: List<Long>, carriers: List<String>, userId: Long): String {
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

        return """INSERT INTO $dataTable (lata_npanxx_report_2_id, npa_nxx, calls, lata, state, total_duration, min_rate, min_carrier, $carriersColumn)
             SELECT '$reportId', t.npa_nxx, IFNULL(lnr1.calls, 0), lnr1.lata, lnr1.state, IFNULL(lnr1.total_duration,0), $strLeast, $minCarrier, ${carriersValues.joinToString(", ")}
             FROM ($tableQuery) t
             INNER JOIN lata_npanxx_report_1_$userId lnr1 ON t.npa_nxx = lnr1.npa_nxx
        """.trimMargin()
    }


    fun findLataNpanxxReport2(userId: Long, name: String) = lataNpanxxReport2Repository.findByUserIdAndNameAndIsDeletedFalse(userId, name)

    fun findLataNpanxxReport2sByUserId(userId: Long) = lataNpanxxReport2Repository.findAllByUserIdAndIsDeletedFalse(userId)

    fun saveLataNpanxxReport2(report: LataNpanxxReport2) = lataNpanxxReport2Repository.save(report)


    // For Data

    /**
     * Search Reports
     */
    fun searchLataNpanxxReport2Data(query: TableQuery) = lataNpanxxReport2DataRepository.searchLataNpanxxReport2Data(query)

    /**
     * search LataNpanxxReport2 by report id
     */
    fun searchLataNpanxxReport2DataByReportId(query: TableQuery, reportId: Long) = lataNpanxxReport2DataRepository.searchLataNpanxxReport2DataByReportId(query, reportId)

    /**
     * delete LataNpanxxReport2 by report id
     */
    fun deleteLataNpanxxReport2DataByReportId(reportId: Long): Int {
        lataNpanxxReport2Repository.findByIdKt(reportId)?.let {
            it.isDeleted = true
            lataNpanxxReport2Repository.save(it)
        }

        val sql = "DELETE FROM $dataTable WHERE lata_npanxx_report_2_id = $reportId ;"
        try {
            return jdbcTemplate.update(sql)
        } catch (ex: java.lang.Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while LataNpanxxReport2 delete")
        }
        return 0
    }

    // Get page
    fun getLataNpanxxReport2Data(reportId: Long, page: Int = 0, pageSize: Int = 1000): Pair<List<LataNpanxxReport2Data>, Int> {
        val pageable = PageRequest.of(0, pageSize, Sort.by("npaNxx"))
        val result = lataNpanxxReport2DataRepository.findAllByLataNpanxxReport2Id(reportId, pageable)
        return Pair(result.content, result.totalPages)
    }

}