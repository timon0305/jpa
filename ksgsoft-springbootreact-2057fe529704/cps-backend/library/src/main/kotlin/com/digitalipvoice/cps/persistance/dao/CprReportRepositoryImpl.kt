package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class CprReportRepositoryImpl: CprReportRepositoryCustom {
    private val table = "cpr_report"

    @PersistenceContext
    private lateinit var em: EntityManager

    override fun searchCprReportByUserId(query: TableQuery, userId: Long): TableResult {
        if (query.sorts?.isEmpty() != false) {

            query.addSortsItem(SortOption().column("updated_at").direction(SortOption.DirectionEnum.DESC))
        }
        // columns to select
        val cols = arrayOf("u.id", "u.user_id", "u.created_at", "u.updated_at", "u.name", "lr.name as lcr_report_name")
        val table = " $table u LEFT JOIN lcr_report lr ON lr.id = u.lcr_report_id WHERE u.user_id = $userId "

        return em.nativeTableQuery(query, table, * cols)
    }
}