package com.digitalipvoice.cps.somos.message

import com.digitalipvoice.cps.somos.SMSClientHandler

/**
 * Create Good Day MgiMessage for given parameters in SMS Client Handler
 */
fun SMSClientHandler.gdMessage() = GDMessage(srcNodeName, "", messageIdGenerator.next())