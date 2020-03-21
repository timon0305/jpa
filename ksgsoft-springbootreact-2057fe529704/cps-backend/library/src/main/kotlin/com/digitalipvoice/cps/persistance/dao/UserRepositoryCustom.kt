package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.model.AppUser

interface UserRepositoryCustom {
    /**
     * Find users
     */
    fun findUsers(user: AppUser, query: TableQuery): TableResult

    /**
     * Find User Id Ro Mappings
     */
    fun findUserIdRoMappings(user: AppUser, query:TableQuery): TableResult
}