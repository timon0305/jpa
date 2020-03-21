package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.persistance.model.RateDeck

interface RateDeckDataRepositoryCustom {
    /**
     * Find rate deck data
     */
    fun searchRateDeckData(query: TableQuery): TableResult
}