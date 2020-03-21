package com.digitalipvoice.cps.somos.proxy

import io.netty.buffer.ByteBuf
import io.netty.channel.ChannelHandlerContext
import io.netty.handler.codec.ByteToMessageDecoder

/**
 * Simple ByteArray Decoder
 */
class BytesDecoder: ByteToMessageDecoder() {
    @Throws(Exception::class)
    override fun decode(p0: ChannelHandlerContext?, buf: ByteBuf, out: MutableList<Any>) {
        try {
            val count = buf.readableBytes()
            val byteArray = ByteArray(count)
            buf.readBytes(byteArray)
            out.add(byteArray)
        }catch(ex:Exception){
            ex.printStackTrace()
        }
    }
}