package com.digitalipvoice.cps.somos

import com.digitalipvoice.cps.client.somos.models.SomosMessage
import com.digitalipvoice.cps.client.somos.models.SomosResponse
import com.digitalipvoice.cps.client.somos.models.SomosResponseNew
import com.digitalipvoice.cps.client.somos.models.SomosResponseStandalone
import com.digitalipvoice.cps.service.SMSMessageService

/**
 * Get Somos Response via request id
 * This function is old and should be deprecated, but used by cps-customer-frontend
 */
fun SMSMessageService.getSomosResponse(requestId: Long): SomosResponse? {
    val message = findResponseMessage(requestId) ?: return null
    return SomosResponse()
            .requestId(requestId)
            .data(listOf(SomosMessage().apply { from(message) } ))
}

/**
 * Get Somos Response New via request id
 * This function is old and should be deprecated, but used by cps-customer-frontend
 */
fun SMSMessageService.getSomosResponseNew(requestId: Long): SomosResponseNew? {
    val message = findResponseMessage(requestId) ?: return null
    // returns response
    return SomosResponseNew()
            .requestId(requestId)
            .message(message.toUplDataString())
}

fun SMSMessageService.getSomosResponseStandalone(requestId: Long): SomosResponseStandalone {
    val req = findRequestMessage(requestId) ?: return SomosResponseStandalone().requestId(requestId)
    val res = findResponseMessage(requestId)

    return SomosResponseStandalone()
            .requestId(requestId)
            .sent(req.createDcmMessageDTO())
            .received(res?.createDcmMessageDTO())
}