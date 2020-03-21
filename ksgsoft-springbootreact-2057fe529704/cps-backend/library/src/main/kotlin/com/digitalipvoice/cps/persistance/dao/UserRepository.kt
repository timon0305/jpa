package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Long>, UserRepositoryCustom {
    /**
     * Find user by username
     * @param username Username to be searched
     * @return User or null
     */
    fun findByUsername(username:String): User?
}