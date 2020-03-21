package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.SmsIDInfoDTO
import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.dao.UserIDRORepository
import com.digitalipvoice.cps.persistance.dao.UserRepository
import com.digitalipvoice.cps.persistance.model.UserIDRO
import com.digitalipvoice.cps.utils.findByIdKt
import org.hibernate.ObjectNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserIDROService {
    @Autowired
    private lateinit var userRepository:UserRepository

    @Autowired
    private lateinit var userIDRORepository: UserIDRORepository

    /**
     * find User ID RO mappings
     */
    fun findUserIDROs(user: AppUser, query:TableQuery) : TableResult {
        if (query.sorts?.isEmpty() != false) {
            // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("username"))
        }
        return userRepository.findUserIdRoMappings(user, query)
    }

    /**
     * Find User ID RO for specific user
     */
    fun findIDROByUserId(userId:Long): UserIDRO {
        return userIDRORepository.findByIdKt(userId) ?: UserIDRO("", "").apply { id = userId }
    }

    /**
     * Delete IDRO by Id
     */
    fun deleteIDROByUserId(userId: Long) {
        userIDRORepository.findByIdKt(userId)?.let {
            it.user = null
            userIDRORepository.delete(it)
        }
    }

    /**
     * Set ID and RO for user
     */
    fun setIDROForUserId(userId: Long, dto:SmsIDInfoDTO): UserIDRO {
        // Find user first
        val user = userRepository.findByIdKt(userId) ?: throw ObjectNotFoundException(userId, "User")
        val idro = user.idro ?: UserIDRO(dto.id, dto.ro)

        idro.fromDTO(dto)
        idro.id = userId
        idro.user = user

        userIDRORepository.save(idro)
        userRepository.save(user)
        return idro
    }
}