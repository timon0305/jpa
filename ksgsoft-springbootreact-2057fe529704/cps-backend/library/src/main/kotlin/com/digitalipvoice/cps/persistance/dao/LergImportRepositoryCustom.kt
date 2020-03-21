package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult

interface LergImportRepositoryCustom {
    /**
     * Find users
     */
    fun searchLerg(query: TableQuery): TableResult
}