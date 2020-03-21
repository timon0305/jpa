package com.digitalipvoice.cps.somos.proxy

import com.digitalipvoice.cps.*
import com.digitalipvoice.cps.somos.io.Asn1Decode
import com.digitalipvoice.cps.somos.io.Asn1Encode
import com.digitalipvoice.cps.somos.message.Y1DcmMsg
import io.netty.bootstrap.ServerBootstrap
import io.netty.channel.*
import io.netty.channel.nio.NioEventLoopGroup
import io.netty.channel.socket.SocketChannel
import io.netty.channel.socket.nio.NioServerSocketChannel
import io.netty.handler.codec.LengthFieldBasedFrameDecoder

/**
 * Proxy server that forwards message to/from client/remote server
 */
typealias ProxyMessage = Y1DcmMsg
class ProxyServer(val address:String, val port:Int) {
    var clientMessageForward:((ProxyMessage) -> Unit)? = null
    private val log = proxyLogger(javaClass)
    private var _channel: Channel? = null
    private var activeClients = arrayListOf<Channel>()
    fun start(){
        Thread{
            try {
                val group = NioEventLoopGroup()
                val bootstrap = ServerBootstrap()
                bootstrap.group(group)
                        .channel(NioServerSocketChannel::class.java)
                        .option(ChannelOption.SO_BACKLOG, 1024)
                        .localAddress(address, port)
                        .childHandler(object : ChannelInitializer<SocketChannel>(){
                            override fun initChannel(ch: SocketChannel) {
                                ch.pipeline()
                                        .addLast(LengthFieldBasedFrameDecoder(MAX_FRAME_LENGTH, LENGTH_FIELD_OFFSET, LENGTH_FIELD_LENGTH, LENGTH_ADJUSTMENT, INITIAL_BYTES_TO_STRIP, false))
                                        .addLast(Asn1Decode())      // Inbound
                                        .addLast(Asn1Encode())      // OutBound
                                        .addLast(object:ChannelInboundHandlerAdapter(){
                                            /**
                                             * When Channel became inactive
                                             */
                                            override fun channelInactive(ctx: ChannelHandlerContext) {
                                                super.channelInactive(ctx)
                                                val channel = ctx.channel()
                                                log.debug("Channel inactivated. Removing from connections")
                                                activeClients.remove(channel)
                                            }

                                            // Whenever a message is arrived from client
                                            // Just redirect to server
                                            override fun channelRead(ctx: ChannelHandlerContext, msg: Any) {
                                                val channel = ctx.channel()
                                                if (activeClients.indexOf(channel) == -1) {
                                                    activeClients.add(channel)
                                                }
                                                // Call forward message handler
                                                (msg as? Y1DcmMsg)?.let {
                                                    log.debug("Forwarding Y1DcmMsg to server")
                                                    log.debug("-----------------------------------------------------------")
                                                    log.debug(it.toString())
                                                    log.debug("-----------------------------------------------------------")
                                                    clientMessageForward?.invoke(it)
                                                }
                                            }
                                        })
                            }
                        })
                val future = bootstrap.bind().sync()
                log.debug("Proxy Server Running on $address:$port")
                _channel = future.channel()
                future.channel().closeFuture().sync()
            }catch(ex: Exception){
                log.error("Error Listening on $address:$port, error => ${ex.localizedMessage}")
            }
        }.start()
    }

    /**
     * Send Message
     */
    fun send(msg: ProxyMessage){
        for (c in activeClients) {
            //if (c.isActive) {
            log.debug("Forwarding message from remote to client")
            log.debug("------------------------------------------")
            log.debug(msg)
            log.debug("------------------------------------------")
            c.writeAndFlush(msg)
            return
            //}
        }
        log.debug("No active connections to forward message")
    }

    val hasActiveConnections:Boolean
        get() = activeClients.size > 0
}