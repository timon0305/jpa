package com.digitalipvoice.cps.somos.message

object UplErrorCode{
    val ConfirmationFlag = 'C'.toByte()
    val CorrelationID = 'M'.toByte()
    val SourceNodeName = 'O'.toByte()
    val DRC = 'D'.toByte()
    val Default = ' '.toByte()
}