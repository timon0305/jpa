package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult

interface CprReportRepositoryCustom {
    fun searchCprReportByUserId(query: TableQuery, userId: Long): TableResult
}