package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.persistance.dao.SMSMessageRepository
import com.digitalipvoice.cps.persistance.model.SMSMessage
import com.digitalipvoice.cps.utils.findByIdKt
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class SMSMessageService {
    @Autowired
    private lateinit var repository: SMSMessageRepository

    /**
     * Find by Id
     */
    fun findById(id:Long) = repository.findByIdKt(id)

    /**
     * Get response messages for request id
     */
    fun findResponseMessage(requestId: Long) = repository.findByRequestMessageIdAndIsClientMessageFalse(requestId)

    /**
     * Find request message
     */
    fun findRequestMessage(requestId: Long) = repository.findByIdAndIsClientMessageTrue(requestId)

    /**
     * Find Request message for Arrived Message with correlationId and mod
     */
    fun findRequestMessage(correlationId:String, mod: String) = repository.findByCorrelationIdAndModAndIsClientMessageTrueOrderByIdDesc(correlationId, mod)


    /**
     * Save message
     * @param msg : Message to save
     * @param flush Default to true
     */
    fun save(msg:SMSMessage, flush:Boolean = true) = if (flush) repository.saveAndFlush(msg) else repository.save(msg)
}