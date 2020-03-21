package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.nativeTableQuery
import com.digitalipvoice.cps.utils.nativeTableQueryGroupBy
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class LcrReportRepositoryImpl : LcrReportRepositoryCustom {
    @PersistenceContext
    private lateinit var em: EntityManager

    private val table = "lcr_report"

    override fun searchLcrReport(query: TableQuery): TableResult {
        if (query.sorts?.isEmpty() != false) {
            query.addSortsItem(SortOption().column("updated_at").direction(SortOption.DirectionEnum.DESC))
        }
        // columns to select
        val cols = arrayOf("u.id", "u.user_id", "u.created_at", "u.updated_at", "u.name", "u.rate_decks")
        val table = " $table u  WHERE u.is_deleted = 0"

        return em.nativeTableQuery(query, table, * cols)
    }

    override fun searchLcrReportByUserId(query: TableQuery, userId: Long): TableResult {
        if (query.sorts?.isEmpty() != false) {
            query.addSortsItem(SortOption().column("updated_at").direction(SortOption.DirectionEnum.DESC))
        }
        // columns to select
        val cols = arrayOf("u.id", "u.user_id", "u.created_at", "u.updated_at", "u.name", "GROUP_CONCAT(rd.name SEPARATOR ', ') as names", "GROUP_CONCAT(rd.carrier SEPARATOR ', ') as carriers")
        val table = """
             $table u
             INNER JOIN lcr_report_rate_deck lrrd ON u.id = lrrd.lcr_report_id
             INNER JOIN rate_deck rd ON lrrd.rate_deck_id = rd.id
             WHERE u.is_deleted = 0
        """.trimIndent()

        return em.nativeTableQueryGroupBy(query, table, " GROUP BY (u.id) ", * cols)
    }
}