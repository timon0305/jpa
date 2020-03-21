package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.somos.IMessageIDGenerator
import com.digitalipvoice.cps.utils.RandomString
import org.springframework.stereotype.Component

/**
 * Message ID Generator for SMS Transport Header
 */
@Component
class MessageIdGen: RandomString(11), IMessageIDGenerator {
    override fun next() = nextString()
}