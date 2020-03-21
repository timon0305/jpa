package com.digitalipvoice.cps.utils

import java.text.SimpleDateFormat
import java.util.*


/**
 * Convert Date into ISO8601 format
 */
fun Date.toISO8601Format(): String {
    val df = SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'")
    df.timeZone = TimeZone.getTimeZone("UTC")
    return df.format(this)
}

/**
 * Get Date applied calendar of central US/Central timezone
 * @param dt Date (Defaults to now)
 */
fun Date.calendarOfCentral() :Calendar {
    val dt = this
    return Calendar.getInstance(TimeZone.getTimeZone("US/Central")).apply { time = dt }
}

/**
 * NMS Date Format
 */
const val NMSDateFormat = "yyyy-MM-dd'T'HH:mm:ddZ"
/**
 * Get US/Central based Ed and Et to send to SOMOS MGI Interface from NMSDateFormatted Date String or "NOW"
 * @param str - "NOW" or NMSDateFormat ("yyyy-MM-dd'T'HH:mm:ddZ") date
 * @return Pair<ed, et>
 */
fun edAndet(str:String): Pair<String, String?> {
    if (str == "NOW") {
        return Pair("NOW", null)
    }
    val format = SimpleDateFormat(NMSDateFormat)
    val dt = format.parse(str)
    val cal = dt.calendarOfCentral()
    val year = cal.get(Calendar.YEAR)
    val month = cal.get(Calendar.MONTH) + 1
    val day = cal.get(Calendar.DATE)
    val hour = cal.get(Calendar.HOUR)
    val min = cal.get(Calendar.MINUTE)
    val x = if (cal.get(Calendar.AM_PM) == Calendar.AM) "A" else "P"

    val ed = "${"%02d".format(month)}/${"%02d".format(day)}/${"%02d".format(year % 100)}"
    val et = "${"%02d".format(hour)}:${"%02d".format(min)}$x/C"

    return Pair(ed, et)
}