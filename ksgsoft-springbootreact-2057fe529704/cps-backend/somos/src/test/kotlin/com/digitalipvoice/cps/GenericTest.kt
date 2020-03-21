package com.digitalipvoice.cps

import com.digitalipvoice.cps.persistance.model.SMSMessage
import com.digitalipvoice.cps.somos.fillDateTime
import org.junit.Test

class GenericTest {
    @Test
    fun testTimezone() {
        val smsMessage = SMSMessage()
        smsMessage.fillDateTime()
        System.out.println(smsMessage)
    }
}