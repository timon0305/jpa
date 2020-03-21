package com.digitalipvoice.cps.somos

import com.digitalipvoice.cps.controller.VolumeTester
import com.digitalipvoice.cps.somos.message.Y1DcmMsg
import com.digitalipvoice.cps.somos.message.gdMessage
import com.digitalipvoice.cps.utils.logger
import io.netty.channel.ChannelHandlerContext
import io.netty.channel.ChannelInboundHandlerAdapter
import io.netty.handler.timeout.IdleState
import io.netty.handler.timeout.IdleStateEvent

/**
 * SOMOS Client Handler
 * Constructor parameters
 * @param srcNodeName: Source Node Name
 * @param destNodeName: Destination Node Name
 * @param messageIdGenerator : MgiMessage ID Generator to be used to send message
 */
class SMSClientHandler(val srcNodeName:String, val destNodeName:String, val messageIdGenerator:IMessageIDGenerator): ChannelInboundHandlerAdapter(){
    private val log = logger(javaClass)
    /**
     * MgiMessage Handler
     */
    var messageHandler: ((Y1DcmMsg) -> Unit)? = null

    /**
     * Triggered when channel became active
     */
    override fun channelActive(ctx: ChannelHandlerContext) {
        super.channelActive(ctx)
        log.debug("Channel Became Active : ",  ctx.name() )

        // Send GoodDay MgiMessage when channel became active
        ctx.writeAndFlush(gdMessage())
    }

    /**
     * Trigger read?
     */
    override fun channelRead(ctx: ChannelHandlerContext, msg: Any) {
        // super.channelRead(ctx, msg)
        (msg as? Y1DcmMsg)?.let{
            // First of all, check if this is volume test message
            if (VolumeTester.checkIfVolumeTestMessage(it))
                return
            log.debug("Message arrived")
            log.debug("------------------------------------------------")
            log.debug(it.toString())
            log.debug("------------------------------------------------")
            messageHandler?.invoke(it)
        }
    }

    override fun userEventTriggered(ctx: ChannelHandlerContext, evt: Any?) {
        // When Channel has been IDLE for period of time, send Good Day MgiMessage
        (evt as? IdleStateEvent)?.let {
            if (it.state() == IdleState.ALL_IDLE){
                log.debug("Became Idle state")
                ctx.writeAndFlush(gdMessage())
            }
        }
        super.userEventTriggered(ctx, evt)
    }
}