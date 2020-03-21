package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.dao.DcmMessageRepository
import com.digitalipvoice.cps.persistance.model.DcmMessage
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class DcmMessageService {
    @Autowired
    private lateinit var repository: DcmMessageRepository

    /**
     * Save message,
     * @param msg
     * @param flush - Default to true
     */
    fun save(msg:DcmMessage, flush:Boolean = true) = if (flush) repository.saveAndFlush(msg) else repository.save(msg)

    /**
     * Search sms_messages
     */
    fun search(user: AppUser, query:TableQuery) = repository.search(user, query)
}