package com.archil.repository

import com.archil.util.SortOption
import com.archil.util.TableQuery
import com.archil.util.TableResult
import com.archil.util.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class ProductRepositoryImpl : ProductRepositoryCustom {
    private val table = "products"
    @PersistenceContext
    private lateinit var em: EntityManager

    override fun searchProducts(query: TableQuery): TableResult {
        if (query.sorts?.isEmpty() != false) {
            query.addSortsItem(SortOption().column("id").direction("asc"))
        }
        var between = ""
        if (query.dateRange != null) {
            between += " WHERE u.startdate BETWEEN '"
            between += query.dateRange?.startDate ?: "0000-00-00"
            between += "' AND '"
            between += query.dateRange?.endDate ?: "9999-12-31"
            between += "' "
        }

        val cols = arrayOf("u.*")
        val table = " $table u $between"

        return em.nativeTableQuery(query, table, * cols)

    }
}