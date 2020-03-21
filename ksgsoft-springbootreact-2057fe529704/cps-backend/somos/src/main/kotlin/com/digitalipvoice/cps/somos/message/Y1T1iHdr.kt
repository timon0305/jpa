package com.digitalipvoice.cps.somos.message

import com.turkcelltech.jac.ASN1Integer
import com.turkcelltech.jac.OctetString
import com.turkcelltech.jac.Sequence

/**
 * Class representing  SMS Transport Header
 */
data class Y1T1iHdr @JvmOverloads constructor(
        var version: Long = 1,
        var priority:Long = 0,
        var messageId:String = "",
        var destNodeName:String = "",
        var srcNodeName:String = "",
        var errorCode: ErrorCode = ErrorCode.NO_ERROR,
        var messageCode: MessageCode = MessageCode.DATA
) : ISequenceConvertible{

    @Throws(Exception::class)
    constructor(sequence:Sequence):this() {
        version = (sequence.get(0) as ASN1Integer).value
        priority = (sequence.get(1) as ASN1Integer).value
        messageId = String((sequence.get(2) as OctetString).value)
        destNodeName = String((sequence.get(3) as OctetString).value)
        srcNodeName = String((sequence.get(4) as OctetString).value)
        errorCode = ErrorCode(sequence.get(5) as ASN1Integer)
        messageCode = MessageCode(sequence.get(6) as ASN1Integer)
    }

    override fun toSequence() =
        Sequence("tliHdr").apply {
            addElement(ASN1Integer(version, "version"))
            addElement(ASN1Integer(priority, "priority"))
            addElement(OctetString("messageId", messageId.toByteArray()))
            addElement(OctetString("destNodeName", destNodeName.toByteArray()))
            addElement(OctetString("srcNodeName", srcNodeName.toByteArray()))
            addElement(errorCode.toBerNode())
            addElement(messageCode.toBerNode()) }

    override fun toString(): String {
        return "version => $version\n" +
                "priority => $priority\n"+
                "messageId => $messageId\n"+
                "destNodeName => $destNodeName\n"+
                "srcNodeName => $srcNodeName\n"+
                "errorCode => $errorCode\n"+
                "messageCode => $messageCode"
    }
}