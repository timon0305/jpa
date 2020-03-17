package com.archil.persistance.dao

import com.archil.persistance.model.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Long>{
    /**
     * Find user by username
     * @param username Username to be searched
     * @return User or null
     */
    fun findByUsername(username:String): User?
}