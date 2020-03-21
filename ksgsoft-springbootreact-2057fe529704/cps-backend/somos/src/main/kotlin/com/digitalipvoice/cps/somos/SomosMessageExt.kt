package com.digitalipvoice.cps.somos

import com.digitalipvoice.cps.client.somos.models.SomosMessage
import com.digitalipvoice.cps.persistance.model.SMSMessage
import com.digitalipvoice.cps.somos.message.DataElement
import com.digitalipvoice.cps.somos.message.MgiMessage

/**
 * Setup a message Object from sms message
 * @param msg : SMSMessage instance object
 * params will be values separated with \n
 */
fun SomosMessage.from(msg:SMSMessage) {
    routeId = msg.DRC
    termrpt = msg.statusTermRept
    errorCode = msg.statusErrorCode

    // Parse message
    val mgiMessage = MgiMessage(msg.toUplDataString())
    val list = mgiMessage.data

    // Generate params string
    val lines = arrayListOf<String>()
    for(map in list) {
        for ( (key, array) in map ) {
            for (elem in array) {
                val line = when (elem.type) {
                    DataElement.IDENTIFIER, DataElement.DECIMAL, DataElement.BINARY -> "${elem.value}"
                    DataElement.TEXT -> {
                        val str = elem.value.toString()
                        if (str.length > 2) {
                            str.slice(IntRange(1, str.length - 2)).trim()
                        }  else ""
                    }
                    else -> ""
                }
                lines.add("$key=$line")
            }
        }
    }
    params = lines.joinToString("\n")
}