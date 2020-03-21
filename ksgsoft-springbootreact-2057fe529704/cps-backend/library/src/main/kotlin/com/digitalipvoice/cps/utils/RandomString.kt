package com.digitalipvoice.cps.utils

import java.security.SecureRandom
import java.util.*

open class RandomString @JvmOverloads constructor(length:Int = 21, private val random:Random = SecureRandom(), symbols:String = RandomString.alphanum) {
    /**
     * Generate a random string
     */
    fun nextString():String {
        for (i in 0 until buf.size) {
            buf[i] = symbols[random.nextInt(symbols.size)]
        }
        return String(buf)
    }

    companion object {
        const val upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        // val lower = upper.toLowerCase(Locale.ROOT)
        const val digits = "0123456789"
        val alphanum = upper /*+ lower*/ + digits
    }

    val symbols = symbols.toCharArray()
    val buf = CharArray(length)
}