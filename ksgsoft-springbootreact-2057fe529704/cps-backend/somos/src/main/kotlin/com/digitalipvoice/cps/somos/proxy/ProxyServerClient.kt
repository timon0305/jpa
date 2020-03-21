package com.digitalipvoice.cps.somos.proxy

import com.digitalipvoice.cps.*
import com.digitalipvoice.cps.somos.io.Asn1Decode
import com.digitalipvoice.cps.somos.io.Asn1Encode
import com.digitalipvoice.cps.somos.message.MessageCode
import com.digitalipvoice.cps.somos.message.Y1DcmMsg
import io.netty.bootstrap.Bootstrap
import io.netty.channel.*
import io.netty.channel.nio.NioEventLoopGroup
import io.netty.channel.socket.SocketChannel
import io.netty.channel.socket.nio.NioSocketChannel
import io.netty.handler.codec.LengthFieldBasedFrameDecoder
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

/**
 * Proxy Client that connects to remote server
 */
class ProxyServerClient(val server:String, val port:Int, val srcNodeName:String = "", val destNodeName:String = ""){
    val log = proxyLogger(javaClass)
    val executorService = Executors.newSingleThreadScheduledExecutor()
    val group = NioEventLoopGroup()
    var serverMessageForward:((ProxyMessage) -> Unit)? = null
    var isReconnect = false
    var _channel:Channel? = null
    var _channelFuture:ChannelFuture? = null

    private val bootstrap by lazy {
        Bootstrap().apply {
            group(group)
            channel(NioSocketChannel::class.java)
            option(ChannelOption.TCP_NODELAY, true)
            handler(object : ChannelInitializer<SocketChannel>(){
                override fun initChannel(ch: SocketChannel?) {
                    // Add Handlers to pipeline
                    ch?.pipeline()?.let { pipeline ->
                        pipeline.addLast(LengthFieldBasedFrameDecoder(MAX_FRAME_LENGTH, LENGTH_FIELD_OFFSET, LENGTH_FIELD_LENGTH, LENGTH_ADJUSTMENT, INITIAL_BYTES_TO_STRIP, false))
                                .addLast(Asn1Decode())      // Inbound
                                .addLast(Asn1Encode())      // OutBound
                                .addLast(object: ChannelInboundHandlerAdapter(){
                            // Whenever a message is arrived from client
                            // Just redirect to server
                            override fun channelRead(ctx: ChannelHandlerContext?, msg: Any?) {
                                // Call forward message handler
                                (msg as? ProxyMessage)?.let{
                                    log.debug("Message arrived from server, forwarding message to clients")
                                    log.debug("----------------------------------------------------------------")
                                    log.debug(msg)
                                    log.debug("----------------------------------------------------------------")
                                    serverMessageForward?.invoke(it)
                                }
                            }

                            override fun channelWritabilityChanged(ctx: ChannelHandlerContext?) {
                                log.debug("Channel Writability changed")
                                super.channelWritabilityChanged(ctx)
                            }

                            override fun channelInactive(ctx: ChannelHandlerContext?) {
                                log.error("Channel became inactive")
                                super.channelInactive(ctx)
                            }

                            override fun channelUnregistered(ctx: ChannelHandlerContext?) {
                                log.error("Channel unregistered")
                                super.channelUnregistered(ctx)
                            }

                            override fun exceptionCaught(ctx: ChannelHandlerContext, cause: Throwable) {
                                log.error("Exception caught : $cause")
                                cause.printStackTrace()
                            }
                        })
                    }
                }
            })
        }
    }

    /**
     * Connect function
     */
    fun connect(){
        disconnect()
        isReconnect = true
        executorService.submit{
            if (isReconnect) _connect()
        }
    }

    /**
     * Disconnect connection
     */
    fun disconnect(){
        isReconnect = false
        executorService.submit{
            try {
                this._channel?.close()
                this._channel = null
                this._channelFuture = null
            }catch(ex:Exception){}
        }

    }

    fun destroy(){
        disconnect()
        executorService.submit{
            group.shutdownGracefully()
        }
    }

    private fun _connect(){
        log.info("Connecting to $server:$port")
        try {
            val future = bootstrap.connect(server, port)
            // Add close listener
            future.addListener (ChannelFutureListener{ f: ChannelFuture ->
                // When not succeed
                if (!f.isSuccess){
                    log.error("Connection failed to server $server:$port, Scheduling reconnect")
                    f.channel().close()
                    scheduleConnect(SOMOS_RECONNECT_INTERVAL)
                } else {
                    log.info("Connection succeed $server:$port")
                    // Add a listener to detect the connection lost
                    val channel = f.channel()
                    channel.closeFuture().addListener{
                        log.info("Connection is closed, trying to connect again")
                        if (isReconnect) scheduleConnect(SOMOS_RECONNECT_INTERVAL)
                    }
                    this._channel = channel
                }
            })

            // Store future in this
            this._channelFuture = future
        }catch(ex: Exception) {
            ex.printStackTrace()
            // Try re-connect again
            scheduleConnect(SOMOS_RECONNECT_INTERVAL)
        }
    }

    /**
     * Schedule Connect function
     */
    private fun scheduleConnect(seconds:Int) {
        executorService.schedule({
            if (isReconnect)
                _connect()
        }, seconds.toLong(), TimeUnit.SECONDS)
    }

    /**
     * Send message to remote server
     */
    fun send(msg:Y1DcmMsg) {
        // Change msg's destNodeName to correct destNodeName
        if (msg.t1iHdr.messageCode != MessageCode.GOOD_DAY) {
            msg.t1iHdr.destNodeName = destNodeName
        }
        msg.t1iHdr.srcNodeName = srcNodeName

        if (_channel?.isActive == true) {
            log.debug("Sending data to remote server")
            log.debug("-------------------------------------------------------")
            log.debug(msg)
            log.debug("-------------------------------------------------------")
            _channel?.writeAndFlush(msg)/*?.addListener { object:ChannelFutureListener{
                override fun operationComplete(f: ChannelFuture) {
                    if (f.isSuccess){
                        log.info("Write successful!")
                    } else {
                        log.error("Error writing message to host")
                    }
                }
            } }*/
        }
        else{
            log.debug("This Channel is Inactive")
        }
    }
}