package com.digitalipvoice.cps.somos.proxy

import io.netty.buffer.ByteBuf
import io.netty.channel.ChannelHandlerContext
import io.netty.handler.codec.MessageToByteEncoder

/**
 * Simple ByteArray Encoder
 */
class BytesEncoder: MessageToByteEncoder<ByteArray>() {
    @Throws(Exception::class)
    override fun encode(p0: ChannelHandlerContext?, obj: ByteArray, out: ByteBuf) {
        try {
            out.writeBytes(obj)
        }catch(ex:Exception) {
            ex.printStackTrace()
        }
    }
}