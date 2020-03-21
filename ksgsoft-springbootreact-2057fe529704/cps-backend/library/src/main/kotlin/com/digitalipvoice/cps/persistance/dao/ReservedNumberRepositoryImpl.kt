package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.model.SomosIdRo
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class ReservedNumberRepositoryImpl: ReservedNumberRepositoryCustom {
    @PersistenceContext
    private lateinit var em: EntityManager

    /**
     * Search reserved numbers
     */
    override fun search(idRo: SomosIdRo?, query: TableQuery): TableResult {
        // columns to select
        val cols = arrayOf("r.number","r.sms_id", "r.ro", "r.reserved_until", "r.last_activated", "r.contact_person", "r.contact_number")
        // username: currently logged in user
        // username1: user created by currently logged in user

        val buffer = StringBuffer()
        buffer.append("reserved_number r")

        // In case of non super admin
        if (idRo != null){
            buffer.append(" WHERE r.sms_id = '${idRo.id}'")
        }
        return em.nativeTableQuery(query, buffer.toString(), * cols)
    }
}