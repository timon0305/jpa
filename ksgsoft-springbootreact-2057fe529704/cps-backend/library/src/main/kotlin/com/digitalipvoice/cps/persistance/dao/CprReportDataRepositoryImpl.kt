package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class CprReportDataRepositoryImpl : CprReportDataRepositoryCustom {
    private val table = "cpr_report_data"

    @PersistenceContext
    private lateinit var em: EntityManager

    override fun searchReportDataByUserId(query: TableQuery, userId: Long): TableResult {
        if (query.sorts?.isEmpty() != false) {
            // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("id").direction(SortOption.DirectionEnum.ASC))
        }
        val cols = arrayOf("u.id", "u.row_ani", "u.user_id", "u.cost", "u.rate", "u.duration", "u.lrn", "u.cpr_report_id", "u.re_rate", "u.cost_savings", "u.carrier")
        val table = " $table u WHERE u.user_id = $userId"

        return em.nativeTableQuery(query, table, * cols)
    }

    override fun searchReportDataByUserIdAndReportId(query: TableQuery, reportId: Long, userId: Long): TableResult {
        if (query.sorts?.isEmpty() != false) {
            // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("id").direction(SortOption.DirectionEnum.ASC))
        }
        val cols = arrayOf("u.id", "u.row_ani", "u.user_id", "u.cost", "u.rate", "u.duration", "u.lrn", "u.cpr_report_id", "u.re_rate", "u.cost_savings", "u.carrier")
        val table = " $table u WHERE u.user_id = $userId AND u.cpr_report_id = $reportId"

        return em.nativeTableQuery(query, table, * cols)
    }
}