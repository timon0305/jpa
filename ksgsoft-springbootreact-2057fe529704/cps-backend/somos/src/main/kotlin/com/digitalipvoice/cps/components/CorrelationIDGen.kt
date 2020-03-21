package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.somos.IMessageIDGenerator
import com.digitalipvoice.cps.utils.RandomString
import org.springframework.stereotype.Component

/**
 * CorrelationID Generator in UPL Header
 */
@Component
class CorrelationIDGen: RandomString(9), IMessageIDGenerator {
    override fun next() = "O${nextString()}"
}