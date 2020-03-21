package com.digitalipvoice.cps.somos

import com.digitalipvoice.cps.persistance.model.DcmMessage
import com.digitalipvoice.cps.somos.message.Y1DcmMsg
import com.digitalipvoice.cps.somos.message.Y1T1iHdr

fun DcmMessage.updateValues(from:Y1DcmMsg) {
    updateValues(from.t1iHdr)
}

fun DcmMessage.updateValues(from:Y1T1iHdr) {
    version = from.version.toInt()
    priority = from.priority.toInt()
    messageTag = from.messageId
    messageCode = from.messageCode.code.toInt()
    errorCode = from.errorCode.code.toByte()
    sourceNodeName = from.srcNodeName
    destinationNodeName = from.destNodeName
}