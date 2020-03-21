package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.utils.nativeTableQuery
import org.springframework.stereotype.Repository
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

class UserRepositoryImpl: UserRepositoryCustom {
    @PersistenceContext
    private lateinit var em:EntityManager

    /**
     * Find users with mapping
     */
    override fun findUsers(user: AppUser, query:TableQuery): TableResult {
        // columns to select
        val cols = arrayOf("u.id", "u.username", "u.first_name", "u.last_name", "u.email", "v1.username as created_by", "v2.username as updated_by", "u.is_active", "r.id as role_id", "r.role", "u.created_at", "u.updated_at")
        val buffer = StringBuffer()
        buffer.append(""" ( user u, role r, user_role ur )
            LEFT JOIN user v1 on v1.id=u.created_by
            LEFT JOIN user v2 on v2.id=u.updated_by
            WHERE u.id = ur.user_id AND r.id = ur.role_id AND u.id <> ${user.id}

                """.trimMargin())

        val nonSuperUserId = user.nonSuperUserId
        if (nonSuperUserId > 0){
            // Add condition when user is not super user.
            buffer.append(" AND u.created_by = $nonSuperUserId")
        }
        return em.nativeTableQuery(query, buffer.toString(), * cols)
    }

    /**
     * FInd UserIdRoMappings
     */
    override fun findUserIdRoMappings(user: AppUser, query: TableQuery): TableResult {
        /**
        user_idro first mode
        val table = """
        user_idro uir JOIN user u ON uir.id = u.id
        WHERE
        ((uir.somos_id <> '' AND uir.somos_id IS NOT NULL) OR
        (uir.ro <> '' AND uir.ro IS NOT NULL))
        """.trimMargin()
         **/

        val buffer = StringBuffer()
        buffer.append("""
            user u
            LEFT JOIN user_idro uir ON u.id = uir.user_id
            LEFT JOIN user v1 on v1.id=uir.created_by
            LEFT JOIN user v2 on v2.id=uir.updated_by

            WHERE u.is_active = 1
            """.trimMargin())

        // check if user is super admin
        // Only grant access to users that are created by logged-in user.

        val nonSuperUserId = user.nonSuperUserId
        if (nonSuperUserId > 0){
            // Add condition when user is not super user.
            buffer.append(" AND u.created_by = $nonSuperUserId")
        }
        if (nonSuperUserId > 0) {
            // Also add condition
            buffer.append(" AND u.created_by = $nonSuperUserId")
        }

        val table = buffer.toString()

        val cols = arrayOf("u.id", "u.username", "uir.somos_id", "uir.ro", "uir.created_at", "uir.updated_at", "v1.username as created_by", "v2.username as updated_by")
        return em.nativeTableQuery(query, table, * cols)
    }
}