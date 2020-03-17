package com.archil.persistance.dao

import com.archil.persistance.model.Role
import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository: JpaRepository<Role, Long> {
    /**
     * Find Role by name
     * @param role : Role to be searched
     * @return Role object or null
     */
    fun findByRole(role: String): Role?

    /**
     * Find roles created by specific user
     * @param createdBy: Created user id
     * @return List of Role objects
     */
    fun findByCreatedBy(createdBy: Long): List<Role>
}