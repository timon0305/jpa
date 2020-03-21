package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class RateDeckDataRepositoryImpl: RateDeckDataRepositoryCustom {
    @PersistenceContext
    private lateinit var em: EntityManager

    override fun searchRateDeckData(query: TableQuery): TableResult {
        // columns to select
        val cols = arrayOf("l.name", "l.carrier", "u.npa_nxx", "u.rate_deck_id", "u.eff_date", "u.increment_duration", "u.init_duration", "u.inter_rate", "u.intra_rate", "u.lata", "u.npa", "u.nxx", "u.ocn")
        val table = " rate_deck_data u INNER JOIN rate_deck l ON l.id = u.rate_deck_id WHERE l.is_deleted = 0"

        return em.nativeTableQuery(query, table, * cols)
    }

}