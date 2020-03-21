package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult

interface CprReportDataRepositoryCustom {
    fun searchReportDataByUserId(query: TableQuery, userId: Long): TableResult

    fun searchReportDataByUserIdAndReportId(query: TableQuery, reportId: Long, userId: Long): TableResult
}