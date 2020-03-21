package com.digitalipvoice.cps.somos.message

import com.digitalipvoice.cps.utils.takePadding
import com.turkcelltech.jac.OctetString

data class UplHeader @JvmOverloads constructor(
        var confirmationFlag:Byte = FLAG_APPLICATION_APPLICATION,
        var correlationID:String = "",
        var sourceNodeName:String = "",
        var DRC:String = "",
        var errorCode:Byte = UplErrorCode.Default): IBerNodeConvertible {

    override fun toBerNode() =
            OctetString("uplHeader",
                    mutableListOf<Byte>().apply {
                        add(confirmationFlag)
                        addAll(correlationID.toByteArray().takePadding(10))
                        addAll(sourceNodeName.toByteArray().takePadding(12))
                        addAll(DRC.toByteArray().takePadding(3))
                        add(errorCode)
                    }.toByteArray())

    @Throws(Exception::class)
    constructor(octetString: OctetString):this(){
        val bytes = octetString.value
        confirmationFlag = bytes[0]
        correlationID = String(bytes, 1, 10)
        sourceNodeName = String(bytes, 11, 12)
        DRC = String(bytes, 23, 3)
        errorCode = bytes[26]
    }

    companion object {
        const val HEADER_SIZE = 1 + 10 + 12 + 3 + 1 //27 bytes
        const val FLAG_NONE = '0'.toByte()
        const val FLAG_APPLICATION_APPLICATION = '3'.toByte()
    }
}