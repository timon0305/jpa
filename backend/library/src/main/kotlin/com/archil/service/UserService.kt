package com.archil.service

import com.archil.persistance.dao.UserRepository
import com.archil.persistance.model.User
import com.archil.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserService {
    private val log = logger(javaClass)
    @Autowired
    private lateinit var userRepository: UserRepository

    fun findUserByName(username: String): User? {
        return userRepository.findByUsername(username)
    }
}