package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult

interface LcrReportRepositoryCustom {
    /**
     * Find users
     */
    fun searchLcrReport(query: TableQuery): TableResult

    fun searchLcrReportByUserId(query: TableQuery, userId: Long): TableResult

}