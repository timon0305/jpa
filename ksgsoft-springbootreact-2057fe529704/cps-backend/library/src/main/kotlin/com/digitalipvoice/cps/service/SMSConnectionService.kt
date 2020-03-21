package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.SMSConnectionDTO
import com.digitalipvoice.cps.persistance.dao.SMSConnectionRepository
import com.digitalipvoice.cps.persistance.model.SMSConnection
import com.digitalipvoice.cps.utils.findByIdKt
import org.hibernate.ObjectNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SMSConnectionService {
    @Autowired
    private lateinit var repository: SMSConnectionRepository

    fun findById(id:Long) = repository.findByIdKt(id) ?: throw ObjectNotFoundException(id, "SMSConnection")

    /**
     * Get All Connections
     */
    fun getConnections(): List<SMSConnection>{
        return repository.findAll(Sort.by("srcNodeName"))
    }

    /**
     * Create New Connection
     */
    fun createConnection(data:SMSConnectionDTO):SMSConnection {
        val connection = SMSConnection()
        connection.fromDTO(data)

        repository.save(connection)
        return connection
    }

    /**
     * Update connection
     */
    fun updateConnection(id:Long, req:SMSConnectionDTO) {
        val connection = findById(id)
        connection.fromDTO(req)
        repository.save(connection)
    }

    /**
     * Delete Connection
     */
    fun deleteConnection(id:Long) {
        val connection = findById(id)
        repository.delete(connection)
    }

    /**
     * Set connection active status
     */
    fun setConnectionActive(id:Long, isActive:Boolean){
        val connection = findById(id)
        connection.isActive = isActive
        repository.save(connection)
    }
}