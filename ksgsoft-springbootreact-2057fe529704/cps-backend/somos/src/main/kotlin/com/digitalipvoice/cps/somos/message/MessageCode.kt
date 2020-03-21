package com.digitalipvoice.cps.somos.message

import com.turkcelltech.jac.ASN1Integer

data class MessageCode @JvmOverloads constructor(val code: Long = 19L) :  IBerNodeConvertible {
    companion object {
        val GOOD_DAY = MessageCode(1L)
        val GOOD_NIGHT = MessageCode(5L)
        val GOOD_BYE = MessageCode(6L)
        val ERROR = MessageCode(9L)
        val DATA = MessageCode(19L)
    }

    val description:String
        get() = when (code) {
            GOOD_DAY.code -> "Good Day"
            GOOD_NIGHT.code -> "Good Night"
            GOOD_BYE.code -> "Good Bye, Disconnect Request"
            ERROR.code -> "Error"
            DATA.code -> "Data(UPL Header/UPL Data)"
            else -> "Unknown Message Code"
        }

    override fun toString() = "$code: $description"
    override fun toBerNode() = ASN1Integer(code, "messageCode")
    constructor(integer: ASN1Integer):this(integer.value)
}