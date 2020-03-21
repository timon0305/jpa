package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult

interface LataNpanxxReport2RepositoryCustom {
    /**
     * Find users
     */
    fun searchLataNpanxxReport2(query: TableQuery): TableResult

    fun searchLataNpanxxReport2ByUserId(query: TableQuery, userId: Long): TableResult

}