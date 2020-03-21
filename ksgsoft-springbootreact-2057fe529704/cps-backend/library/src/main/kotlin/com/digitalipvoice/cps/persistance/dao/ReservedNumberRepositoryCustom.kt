package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.model.SomosIdRo

interface ReservedNumberRepositoryCustom {
    /**
     * Search messages. And for activity log.
     */
    fun search(idRo: SomosIdRo?, query: TableQuery): TableResult
}