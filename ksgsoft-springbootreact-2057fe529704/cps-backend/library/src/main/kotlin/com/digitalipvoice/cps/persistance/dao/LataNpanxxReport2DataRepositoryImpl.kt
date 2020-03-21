package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class LataNpanxxReport2DataRepositoryImpl : LataNpanxxReport2DataRepositoryCustom {
    @PersistenceContext
    private lateinit var em: EntityManager

    private val table = "lata_npanxx_report_2_data"

    override fun searchLataNpanxxReport2Data(query: TableQuery): TableResult {
        if (query.sorts?.isEmpty() != false) {
            // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("npa_nxx").direction(SortOption.DirectionEnum.ASC))
        }
        // columns to select
        val cols = arrayOf("u.npa_nxx", "u.lata_npanxx_report_2_id", "u.calls", "u.lata", "u.state", "u.total_duration", "u.min_carrier", "u.min_rate")
        val table = " $table u"

        return em.nativeTableQuery(query, table, * cols)
    }

    override fun searchLataNpanxxReport2DataByReportId(query: TableQuery, reportId: Long): TableResult {
        // columns to select
        if (query.sorts?.isEmpty() != false) {
            // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("npa_nxx").direction(SortOption.DirectionEnum.ASC))
        }
        val cols = arrayOf("u.npa_nxx", "u.lata_npanxx_report_2_id", "u.calls", "u.lata", "u.state", "u.total_duration", "u.min_carrier", "u.min_rate")
        val table = " $table u WHERE lata_npanxx_report_2_id = $reportId"

        return em.nativeTableQuery(query, table, * cols)
    }
}