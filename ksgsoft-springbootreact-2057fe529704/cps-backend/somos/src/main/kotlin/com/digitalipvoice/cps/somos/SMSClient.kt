package com.digitalipvoice.cps.somos

import com.digitalipvoice.cps.*
import com.digitalipvoice.cps.somos.io.Asn1Decode
import com.digitalipvoice.cps.somos.io.Asn1Encode
import com.digitalipvoice.cps.somos.message.Y1DcmMsg
import com.digitalipvoice.cps.utils.logger
import io.netty.bootstrap.Bootstrap
import io.netty.channel.*
import io.netty.channel.nio.NioEventLoopGroup
import io.netty.channel.socket.SocketChannel
import io.netty.channel.socket.nio.NioSocketChannel
import io.netty.handler.codec.LengthFieldBasedFrameDecoder
import io.netty.handler.timeout.IdleStateHandler
import java.io.IOException
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

class SMSClient(val server:String, val port:Int, val sourceNodeName:String, val destinationNodeName:String, private val executorService: ScheduledExecutorService) {
    private var _channel: Channel? = null
    private var isReconnect = true
    private val log = logger(javaClass)
    var handlerFactory: (() -> SMSClientHandler)? = null
    private val group = NioEventLoopGroup()
    private val bootstrap by lazy {
        Bootstrap().apply {
            group(group)
            channel(NioSocketChannel::class.java)
            option(ChannelOption.TCP_NODELAY, true)
            handler(object : ChannelInitializer<SocketChannel>(){
                override fun initChannel(ch: SocketChannel?) {
                    // Add Handlers to pipeline
                    ch?.pipeline()?.let {
                        it.addLast(LengthFieldBasedFrameDecoder(MAX_FRAME_LENGTH, LENGTH_FIELD_OFFSET, LENGTH_FIELD_LENGTH, LENGTH_ADJUSTMENT, INITIAL_BYTES_TO_STRIP, false))
                        it.addLast(Asn1Decode())    // Inbound
                        it.addLast(Asn1Encode())  //OutBound
                        it.addLast(IdleStateHandler(READ_IDLE_TIME_OUT, WRITE_IDLE_TIME_OUT, ALL_IDLE_TIME_OUT, TimeUnit.SECONDS))
                        handlerFactory?.invoke()?.let {handler -> it.addLast(handler)}  // Add somos client handler
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
            }catch(ex:Exception){}
        }
    }

    fun destroy(){
        disconnect()
        executorService.submit{
            group.shutdownGracefully()
        }
    }

    /**
     * Send MgiMessage
     */
    @Throws(Exception::class)
    fun sendMessage(message: Y1DcmMsg) {
        if (this._channel?.isActive == true) {
            // update sms transport header
            // Send MgiMessage
            // Update source node name and destination node name before sending
            with(message.t1iHdr){
                srcNodeName = sourceNodeName
                destNodeName = destinationNodeName
            }
            this._channel?.writeAndFlush(message)
        } else {
            throw IOException("Can't send message to inactive connection")
        }
    }

    private fun _connect(){
        log.debug("Connecting to $server:$port")
        try {
            val future = bootstrap.connect(server, port)
            // Add close listener
            future.addListener (ChannelFutureListener{ f: ChannelFuture ->
                // When not succeed
                if (!f.isSuccess){
                    log.debug("Connection failed to server $server:$port, Scheduling reconnect")
                    f.channel().close()
                    scheduleConnect(SOMOS_RECONNECT_INTERVAL)
                } else {
                    log.debug("Connection succeed $server:$port")
                    // Add a listener to detect the connection lost
                    val channel = f.channel()
                    channel.closeFuture().addListener{ if (isReconnect) scheduleConnect(SOMOS_RECONNECT_INTERVAL) }
                    this._channel = f.channel()
                }
            })
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

    val isActive:Boolean
        get() = _channel?.isActive ?: false
}