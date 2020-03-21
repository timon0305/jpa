package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.utils.nativeTableQuery
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class DcmMessageRepositoryImpl: DcmMessageRepositoryCustom {

    @PersistenceContext
    private lateinit var em: EntityManager

    // Search activity log
    override fun search(user: AppUser, query: TableQuery): TableResult {
        // columns to select
        val cols = arrayOf("dm.id as dm_id", "dm.source_node_name", "dm.destination_node_name", "dm.error_code", "dm.message_code", "dm.created_at as dm_created_at",
                "sms.id as message_id", "sms.created_at as sms_created_at", "sms.drc", "sms.confirmation_flag", "sms.correlation_id", "sms.verb", "sms.mod", "sms.year", "sms.month", "sms.day", "sms.hour", "sms.minute", "sms.second", "sms.timezone",
                "sms.status_term_rept", "sms.status_error_code", "sms.data", "sms.sms_id as somos_id", "sms.ro", "sms.user_id", "sms.request_message_id", "sms.response_message_id",
                "u.username"
        )
        // username: currently logged in user
        // username1: user created by currently logged in user

        val buffer = StringBuffer()
        buffer.append(""" sms_message sms
                LEFT JOIN dcm_message dm ON dm.sms_message_id = sms.id
                 LEFT JOIN user u ON u.id = sms.user_id
                """)

        // In case of non super admin
        if (!user.isSuperAdmin) {
            // Only display the messages by this user or by users created by this user.
            buffer.append(" WHERE u.id = '${user.id}' OR u.created_by = '${user.id}' ")
        }

        return em.nativeTableQuery(query, buffer.toString(), * cols)
    }
}