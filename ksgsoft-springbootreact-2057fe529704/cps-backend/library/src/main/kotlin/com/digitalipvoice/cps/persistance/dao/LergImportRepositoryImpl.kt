package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class LergImportRepositoryImpl : LergImportRepositoryCustom {
    @PersistenceContext
    private lateinit var em: EntityManager

    override fun searchLerg(query: TableQuery): TableResult {
        // columns to select
        val cols = arrayOf("u.npa", "u.nxx", "u.state", "u.lata", "u.npa_nxx", "u.acna", "u.cic", "u.acna_cic", "u.carrier")
        val table = " lerg_import u "

        return em.nativeTableQuery(query, table, * cols)
    }
}