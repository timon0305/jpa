package com.archil.persistance.dao

import com.archil.persistance.model.Privilege
import org.springframework.data.jpa.repository.JpaRepository

interface PrivilegeRepository:JpaRepository<Privilege, Long> {
    /**
     * Find Privilege by name
     * @param name : Name to be searched
     * @return Privilege object or null
     */
    fun findByName(name:String): Privilege?
}