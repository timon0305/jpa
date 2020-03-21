package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.SMSMessage
import org.springframework.data.jpa.repository.JpaRepository

interface SMSMessageRepository : JpaRepository<SMSMessage, Long> {
    /**
     * Find Mgi Request message for response in case of request.
     * By Correlation Id and client message should be true and order by ID Descending
     * And also message mod
     */
    fun findByCorrelationIdAndModAndIsClientMessageTrueOrderByIdDesc(correlationId:String, mod:String) : SMSMessage?

    fun findByIdAndIsClientMessageTrue(id:Long): SMSMessage?

    fun findByRequestMessageIdAndIsClientMessageFalse(requestMessageId: Long):SMSMessage?
}