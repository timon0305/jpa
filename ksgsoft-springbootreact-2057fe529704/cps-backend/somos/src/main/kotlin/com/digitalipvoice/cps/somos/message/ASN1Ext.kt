package com.digitalipvoice.cps.somos.message

import com.chaosinmotion.asn1.BerInputStream
import com.chaosinmotion.asn1.BerOutputStream
import com.turkcelltech.jac.Sequence
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream

@Throws(Exception::class)
fun Sequence.toByteArray(): ByteArray {
    val outStream = ByteArrayOutputStream()
    val outBs = BerOutputStream(outStream)
    encode(outBs)
    return outStream.toByteArray()
}

@Throws(Exception::class)
fun Sequence.fromByteArray(bytes:ByteArray):Sequence {
    val bis = BerInputStream(ByteArrayInputStream(bytes))
    decode(bis)
    return this
}