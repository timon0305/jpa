package com.digitalipvoice.cps.somos.io

import com.digitalipvoice.cps.somos.message.Y1DcmMsg
import com.digitalipvoice.cps.somos.message.fromByteArray
import com.digitalipvoice.cps.utils.hexString
import com.digitalipvoice.cps.utils.logger
import io.netty.buffer.ByteBuf
import io.netty.channel.ChannelHandlerContext
import io.netty.handler.codec.ByteToMessageDecoder
import java.io.IOException

class Asn1Decode : ByteToMessageDecoder() {
    private val log = logger(javaClass)

    @Throws(Exception::class)
    public override fun decode(ctx: ChannelHandlerContext, `in`: ByteBuf, out: MutableList<Any>) {
        try {
            val bytesCount = `in`.readableBytes()
            val bytes = ByteArray(bytesCount)
            `in`.readBytes(bytes)
            log.debug("Hex : " + bytes.hexString())
            try {
                val msg = Y1DcmMsg(Y1DcmMsg.parseSequence.fromByteArray(bytes))
                out.add(msg)
                log.debug("Decoded Y1DcmMsg")
                log.debug(msg.toString())
            } catch (e2: Exception) {
                log.error("ASN.1 Decode Error: " + e2.toString())
                e2.printStackTrace()
            }

        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
}