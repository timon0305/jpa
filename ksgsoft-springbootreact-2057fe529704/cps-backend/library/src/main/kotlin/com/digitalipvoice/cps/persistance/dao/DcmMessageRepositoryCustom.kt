package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.model.AppUser


interface DcmMessageRepositoryCustom {
    /**
     * Search messages. And for activity log.
     */
    fun search(user: AppUser, query: TableQuery): TableResult
}