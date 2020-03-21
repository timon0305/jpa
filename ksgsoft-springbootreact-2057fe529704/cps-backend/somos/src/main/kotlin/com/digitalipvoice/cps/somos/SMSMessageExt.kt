package com.digitalipvoice.cps.somos

import com.digitalipvoice.cps.client.somos.models.DcmMessageDTO
import com.digitalipvoice.cps.client.somos.models.SMSTransportHeaderDTO
import com.digitalipvoice.cps.client.somos.models.UPLHeaderDTO
import com.digitalipvoice.cps.persistance.model.SMSMessage
import com.digitalipvoice.cps.somos.message.*
import java.util.*

/**
 * Update values from mgi message
 * @param mgi: MgiMessage instance parsed from received packet
 */
fun SMSMessage.updateValues(mgi:MgiMessage) {
    verb = mgi.verb
    mod = mgi.mod
    year = mgi.year
    month = mgi.month
    day = mgi.day
    hour = mgi.hour
    minute = mgi.minute
    second = mgi.second
    timezone = mgi.timezone
    statusErrorCode = mgi.status_errorCode
    statusTermRept = mgi.status_termRept
    sequence = mgi.sequence
    testMessage = mgi.testMessage

    data = mgi.messageDataBlockString()
}

/**
 * Update values from Y1Upl instance
 * @param upl : Y1Upl object
 */
fun SMSMessage.updateValues(upl: Y1Upl) {
    // Update header first
    confirmationFlag = upl.header.confirmationFlag
    correlationId = upl.header.correlationID
    sourceNodeName = upl.header.sourceNodeName
    DRC = upl.header.DRC
    errorCode = upl.header.errorCode

    // Try to parse Mgi message
    val mgiMessage = upl.toMgiMessage() ?: return

    // update values from mgi message
    updateValues(mgiMessage)
}

/**
 * Create Basic Y1DcmMsg based on data at this object
 * @param longSourceNodeName: SourceNodeName of MGI Client, will capture first 11 byte of it and prepend "O"
 * @returns Y1DcmMsg to send over network
 */
fun SMSMessage.toY1DcmMsg(longSourceNodeName:String? = null): Y1DcmMsg {
    // If source Node name is not nil, update source node name
    if (longSourceNodeName != null) {
        sourceNodeName = "O" + longSourceNodeName.substring(IntRange(0, 11))
    }
    val header = UplHeader(confirmationFlag, correlationId, sourceNodeName, RouteID.get("$verb-$mod"))
    return Y1DcmMsg(data = Y1Upl(header, toUplDataByteArray()))
}

/**
 * Convert to UPL String
 */
fun SMSMessage.toUplDataString(): String {
    val verbMod = "$verb-$mod"

    val dateTimePart = if  (verbMod != VerbMod.AppStatusInfoRetrieve) ",$year-${"%02d".format(month)}-${"%02d".format(day)},${"%02d".format(hour)}-${"%02d".format(minute)}-${"%02d".format(second)}-$timezone" else ""
    val statusPart = if (Verbs.isResponse(verb)) "$statusTermRept,$statusErrorCode" else ""
    val testMessageSequencePart = if (mod == Mods.TestCapabilities) sequence else ""
    val testMessageMsgPart = if (mod == Mods.TestCapabilities) ":\"$testMessage\"" else ""

    // First part before message data block
    val first = "$verbMod:$dateTimePart::$testMessageSequencePart:$statusPart:"

    // Test message or data
    val second = if (testMessageMsgPart.isNotEmpty()) testMessageMsgPart else data

    return "$first$second;"
}

fun SMSMessage.fillDateTime(date: Date = Date(), timezone:String = "CST") {
    val cal = Calendar.getInstance(TimeZone.getTimeZone(timezone))
    cal.time = date

    year = cal.get(Calendar.YEAR)
    month = cal.get(Calendar.MONTH) + 1
    day = cal.get(Calendar.DATE)
    hour = cal.get(Calendar.HOUR_OF_DAY)
    minute = cal.get(Calendar.MINUTE)
    second = cal.get(Calendar.SECOND)
    this.timezone = timezone
}
/**
 * Convert into upl data byte array
 * @return ByteArray representation of data
 */
private fun SMSMessage.toUplDataByteArray(): ByteArray  = toUplDataString().toByteArray()


/**
 * Create DcmMessage DTO from SMSMessage for detailed information about each request/response.
 * For API.
 */
fun SMSMessage.createDcmMessageDTO(): DcmMessageDTO {
    return DcmMessageDTO()
            .transportHeader(
                    dcmMessage?.let {
                        return@let SMSTransportHeaderDTO().version(it.version)
                                .priority(it.priority)
                                .messageId(it.messageTag)
                                .messageCode(it.messageCode)
                                .srcNodeName(it.sourceNodeName)
                                .destNodeName(it.destinationNodeName)
                                .errorCode(it.errorCode.toInt())
                    }
            )
            .uplHeader(
                    UPLHeaderDTO()
                            .confirmationFlag(confirmationFlag.toInt())
                            .correlationID(correlationId)
                            .srcNodeName(sourceNodeName)
                            .DRC(DRC)
                            .errorCode(errorCode.toInt())
            ).upl(toUplDataString())
}