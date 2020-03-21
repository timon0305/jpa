package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.persistance.dao.SMSConnectionRepository
import com.digitalipvoice.cps.somos.SMSClient
import com.digitalipvoice.cps.somos.SMSClientHandler
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.util.concurrent.Executors

/**
 * SMSConnections service
 * This class managements connections to SMS Application Server
 */
@Component
class SMSConnectionManager {
    /**
     * SMS Connections information manage repository
     */
    @Autowired
    lateinit var connectionRepository:SMSConnectionRepository
    private var handlers = arrayListOf<SMSClient>()

    /**
     * DcmMessageManager Service
     */
    @Autowired
    lateinit var dcmMessageManager: DcmMessageManager

    /**
     * Connection management executor service
     */
    private var connectManageExecutorService = Executors.newScheduledThreadPool(1)

    @Autowired
    lateinit var messageIdGen: MessageIdGen

    /**
     * Start Connections
     */
    fun startConnections(){
        val connections = connectionRepository.findAll().filter { it.isActive }
        for (con in connections) {
            val client = SMSClient(con.serverAddress, con.port, con.srcNodeName, con.destNodeName, connectManageExecutorService)
            // Assign handler factory. As handler can not be used multiple times
            client.handlerFactory = {  SMSClientHandler(con.srcNodeName, con.destNodeName, messageIdGen) .apply {
                messageHandler = { msg -> dcmMessageManager.onNewMessageArrived(msg) }
            } }
            client.connect()
            // Add client to list to keep reference
            handlers.add(client)
        }
    }

    fun stopConnections(){
        // Stop Connections
        handlers.forEach{
            // Remove handler factory
            it.handlerFactory = null
            it.destroy()
        }
        // Remove all
        handlers = arrayListOf()
    }

    fun restartConnections(){
        // Restart Connections
        stopConnections()
        startConnections()
    }

    /**
     * Get Active Client
     */
    fun getActiveClient():SMSClient?{
        handlers.forEach{ c ->
            if (c.isActive)
                return c
        }
        return null
    }
}