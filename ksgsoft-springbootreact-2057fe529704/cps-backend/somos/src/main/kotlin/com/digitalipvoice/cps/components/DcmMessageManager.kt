package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.persistance.model.DcmMessage
import com.digitalipvoice.cps.persistance.model.SMSMessage
import com.digitalipvoice.cps.service.DcmMessageService
import com.digitalipvoice.cps.service.SMSMessageService
import com.digitalipvoice.cps.somos.message.*
import com.digitalipvoice.cps.somos.toY1DcmMsg
import com.digitalipvoice.cps.somos.updateValues
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.util.concurrent.Executors
import java.util.concurrent.LinkedBlockingDeque

/**
 * Manages DcmMessageManager
 * Sends Y1DcmMsg over sms client, or processes Y1DcmMsg from server
 * This service internally have blocking queue
 */
@Component
class DcmMessageManager {
    /**
     * UPL Header CorrelationID Generator
     */
    @Autowired
    private lateinit var correlationIDGen: CorrelationIDGen

    /**
     * SMS Transport Header MessageTag(Message ID) generator
     */
    @Autowired
    private lateinit var messageIDGen: CorrelationIDGen

    /**
     * MGI Message repository (UPL + Header)
     */
    @Autowired
    private lateinit var smsMessageService: SMSMessageService

    /**
     * Y1DcmMessage Header repository
     */
    @Autowired
    private lateinit var dcmMessageService: DcmMessageService

    @Autowired
    private lateinit var connectionsManager: SMSConnectionManager

    @Autowired
    lateinit var requestManager: SMSRequestManager

    /**
     * SMS Response message processor. Currently update reserved tollfree number tables.
     */
    @Autowired
    lateinit var messageProcessor:SMSResponseProcessor

    /**
     * Queue of SMSMessage Entity Ids to send
     */
    private val messageQueue =  LinkedBlockingDeque<Long>()

    /**
     * Logger
     */
    private val log = logger(javaClass)

    /**
     * Received Y1DcmMsg ExecutorService
     */
    private val receiveMessageExecutor by lazy {
        Executors.newFixedThreadPool(1).apply {
            submit{
                // Initialize transaction synchronization on this thread
                // Do not uncomment this in spring boot based application!
                /*
                try {
                    TransactionSynchronizationManager.initSynchronization()
                }catch(ex:Exception){
                    ex.printStackTrace()
                }
                */
            }
        }
    }

    /**
     * Default initialization code
     */
    init {
        // Start new thread for peeking message
        Thread{
            // Initialize transaction synchronization on this thread
            // Do not open this in spring boot based application!
            /*
            try {
                TransactionSynchronizationManager.initSynchronization()
            }catch(ex:Exception){}
            */

            while (true) {
                // Peek a new message
                val id = messageQueue.take()
                log.debug("Picked message to send, id : $id")

                // Find message in database table
                val msg = smsMessageService.findById(id) ?: continue
                val client = connectionsManager.getActiveClient()
                if (client != null) {
                    // Create Y1DcmMsg skeleton from sms message object
                    val y1dcmMsg = msg.toY1DcmMsg(client.sourceNodeName).apply {
                        t1iHdr.messageId = messageIDGen.next()
                    }
                    try {
                        // When sending message, un-filled values like tliHeader's srcNodeName and destNodeName
                        client.sendMessage(y1dcmMsg)
                        // Save and flush message
                        // Set sent to server to true
                        msg.isSentToServer = true

                        // Create Y1DcmMsg header entity and save it to db after sent
                        val dcmMsg = DcmMessage()
                        dcmMsg.updateValues(y1dcmMsg)
                        dcmMsg.smsMessageId = msg.id

                        dcmMessageService.save(dcmMsg)
                        smsMessageService.save(msg)
                    }catch(ex: Exception){
                        log.error("Error Sending message: $ex")
                        ex.printStackTrace()
                    }
                } else {
                    log.warn("Could not find active client")
                    // Add back to message queue when there's no active client
                    messageQueue.addFirst(id)
                    // Sleep 1 second to wait for an active connection
                    Thread.sleep(3000)
                }
            }
        }.start()
    }

    /**
     * When New Message Arrived
     */
    fun onNewMessageArrived(y1dcmMsg: Y1DcmMsg) {
        // Submit to receiver thread
        receiveMessageExecutor.submit {
            try {
                // Create DCMMsg instance
                val dcmMsg = DcmMessage().apply { updateValues(y1dcmMsg) }
                val upl = y1dcmMsg.data

                // Process handler when new message arrived
                val hdr = y1dcmMsg.t1iHdr
                // Check if error code is true
                if (hdr.errorCode == ErrorCode.NO_ERROR && hdr.messageCode == MessageCode.DATA && upl != null){

                    // Create SMS Message
                    val msg = SMSMessage().apply { updateValues(upl) }
                    msg.isClientMessage = false     // This message is arrived from server

                    smsMessageService.save(msg, false)     // save message first.

                    // Assign response message id with the same id of message (For faster search)
                    msg.responseMessageId = msg.id

                    // Match relationship between dcmMsg and msg
                    dcmMsg.smsMessageId = msg.id

                    // Save DCMMsg (Y1TliHdr part)
                    dcmMessageService.save(dcmMsg)

                    // Find out relevant request message
                    val requestSMSMessage = smsMessageService.findRequestMessage(msg.correlationId, msg.mod)
                    if (requestSMSMessage?.id != null) {
                        // Assign request_message_id and response_message_id
                        msg.requestMessageId = requestSMSMessage.id
                        requestSMSMessage.responseMessageId = msg.id

                        smsMessageService.save(msg)

                        requestManager.setSMSMessageReceived(requestSMSMessage.id, msg.correlationId)
                    }

                    // Process Received SMS Message
                    messageProcessor.processMessage(requestSMSMessage?.id, msg.id)
                }
            }catch(ex:Exception) {
                ex.printStackTrace()
            }
        }
    }

    /**
     * Send SMS Message to server, and push the Id of SMSMessage to message queue
     * Before calling this message, request_id of this message should be set
     * *Do not pass already saved instance of message.*
     * Just pass newly created message.
     * This should be called on session thread to identify which user sent it.
     * @param message: SMS Message entity to send. (request_id should be set for this)
     */
    fun sendSMSMessage(message:SMSMessage) {
        // Update upl header information
        with(message) {
            confirmationFlag = UplHeader.FLAG_APPLICATION_APPLICATION
            correlationId = correlationIDGen.next()
            DRC = RouteID.get("$verb-$mod")
            errorCode = UplErrorCode.Default
            isClientMessage = true      // Set client message flag to true
        }

        smsMessageService.save(message)

        // Add message id to queue to signal queue reading thread
        messageQueue.add(message.id)
    }
}