package com.digitalipvoice.cps.somos.io

import com.digitalipvoice.cps.somos.message.Y1DcmMsg
import com.digitalipvoice.cps.somos.message.toByteArray
import com.digitalipvoice.cps.utils.hexString
import com.digitalipvoice.cps.utils.logger
import io.netty.buffer.ByteBuf
import io.netty.channel.ChannelHandlerContext
import io.netty.handler.codec.MessageToByteEncoder

class Asn1Encode : MessageToByteEncoder<Y1DcmMsg>() {
    private val log = logger(javaClass)

    @Throws(Exception::class)
    public override fun encode(ctx: ChannelHandlerContext, msg: Y1DcmMsg, out: ByteBuf) {
        try {
            out.writeByte(126)        // 0x7e
            out.writeByte(126)
            out.writeByte(126)
            out.writeByte(126)

            val byteArray = msg.toSequence().toByteArray()
            out.writeInt(byteArray.size)
            out.writeBytes(byteArray)

            log.debug("Encoded Y1DcmMsg")
            log.debug(msg.toString())

            log.debug("Encoded ASN.1")
            log.debug(byteArray.hexString())
        } catch (e: Exception) {
            log.error("ASN.1 Encode Error: " + e.toString())
            e.printStackTrace()
        }

    }
}