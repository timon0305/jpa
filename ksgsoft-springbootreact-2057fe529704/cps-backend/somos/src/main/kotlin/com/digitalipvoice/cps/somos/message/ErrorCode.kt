package com.digitalipvoice.cps.somos.message

import com.turkcelltech.jac.ASN1Integer

class ErrorCode @JvmOverloads constructor(val code: Long = 0L) : IBerNodeConvertible {
    companion object {
        val NO_ERROR = ErrorCode(0L)
        val BAD_SOURCE = ErrorCode(1L)
        val BAD_DESTINATION = ErrorCode(2L)
        val BAD_VERSION = ErrorCode(3L)
    }

    val description:String
        get() = when(code) {
            NO_ERROR.code -> "No Error"
            BAD_SOURCE.code -> "Bad Source"
            BAD_DESTINATION.code -> "Bad Destination"
            BAD_VERSION.code -> "Bad Version"
            else -> "Unknown Error"
        }

    constructor(integer: ASN1Integer):this(integer.value)

    override fun equals(other: Any?) = (other as? ErrorCode)?.code == code
    override fun hashCode() = super.hashCode() + 0

    override fun toBerNode() = ASN1Integer(code, "errorCode")

    override fun toString() = "$code : $description"
}