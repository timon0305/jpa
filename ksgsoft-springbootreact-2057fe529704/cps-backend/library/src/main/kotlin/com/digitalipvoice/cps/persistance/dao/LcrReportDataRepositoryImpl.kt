package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class LcrReportDataRepositoryImpl : LcrReportDataRepositoryCustom {
    @PersistenceContext
    private lateinit var em: EntityManager

    private val table = "lcr_report_data"

    override fun searchLcrReportData(query: TableQuery): TableResult {
        if (query.sorts?.isEmpty() != false) {
            // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("npa_nxx").direction(SortOption.DirectionEnum.ASC))
        }
        // columns to select
        val cols = arrayOf("u.npa_nxx", "u.lcr_report_id", "u.min_carrier", "u.min_rate")
        val table = " $table u"

        return em.nativeTableQuery(query, table, * cols)
    }

    override fun searchLcrReportDataByReportId(query: TableQuery, reportId: Long): TableResult {
        // columns to select
        if (query.sorts?.isEmpty() != false) {
                // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("npa_nxx").direction(SortOption.DirectionEnum.ASC))
        }
        val cols = arrayOf("u.npa_nxx", "u.lcr_report_id", "u.carrier_1 as min_carrier", "u.min_rate")
        val table = " $table u WHERE lcr_report_id = $reportId"

        return em.nativeTableQuery(query, table, * cols)
    }
}