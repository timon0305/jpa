package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult

interface LcrReportDataRepositoryCustom {
    /**
     * Find users
     */
    fun searchLcrReportData(query: TableQuery): TableResult

    fun searchLcrReportDataByReportId(query: TableQuery, reportId: Long): TableResult
}