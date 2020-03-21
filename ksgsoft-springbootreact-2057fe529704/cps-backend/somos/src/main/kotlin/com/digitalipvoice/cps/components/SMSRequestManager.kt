package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.client.somos.models.TimeoutResponse
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.context.request.async.DeferredResult
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

@Component
class SMSRequestManager {
    /**
     * Request processing map
     * Key: ID of CPSRequest object
     * Value : Request Status (Contains processed request and responses correlation IDs)
     */
    private val requestProcessingMap = mutableMapOf<Long, SMSRequestManager.RequestStatus>()

    /**
     * Scheduled executor service for request processing
     */
    private var rpExecutorService = Executors.newScheduledThreadPool(1)

    /**
     * Request done handlers
     */
    private var requestDoneHandlers = mutableMapOf<Long, () -> Unit>()

    /**
     * Called when sms message with correlation Id called
     * Register sms requests message correlation Ids for specific cps request
     * @param requestId: Id of 8ms style request
     * @param correlationIds : Generated sent sms messages correlation ids
     * @param timeOut : Timeout for tracking this request id. So entry of this request id will be removed after certain period of time
     */
    @Throws(IllegalArgumentException::class)
    fun registerSMSRequests(requestId:Long, correlationIds:Collection<String>, timeOut:Long) {
        if (timeOut < 0) {
            throw IllegalArgumentException("Timeout should be greater than zero")
        }
        rpExecutorService.run {
            requestProcessingMap[requestId] = RequestStatus().apply { requests = correlationIds.toTypedArray() }
        }

        // Set time out and stop tracking request id
        rpExecutorService.schedule({
            requestProcessingMap.remove(requestId)
        }, timeOut, TimeUnit.SECONDS)
    }

    /**
     * Called when sms message with correlation Id received
     * @param requestId : Request Id
     * @param correlationId: Correlation Id
     */
    fun setSMSMessageReceived(requestId: Long, correlationId: String){
        rpExecutorService.run {
            val stat = requestProcessingMap[requestId] ?: return@run
            stat.responses.add(correlationId)

            // Check if all response arrived
            stat.requests.forEach{
                if (!stat.responses.contains(it)) {
                    return@run
                }
            }

            // All messages arrived. call request done handler
            (requestDoneHandlers[requestId] ?: return@run)()

            // Remove handler
            requestDoneHandlers.remove(requestId)
        }
    }

    /**
     * Add Request Done Handler with cps request id
     * @param requestId : Request Id
     * @param handler: Handler to be called when all response arrived considered
     * @param timeOut: TimeOut Handler to be called when
     * @param timeOutHandler: Lambda to be called when time out occurred. (Don't add code for removing done handler, this is automatically done here)
     */
    fun addRequestDoneHandler(requestId: Long, handler:() -> Unit) {
        // Save handler to the map
        rpExecutorService.run {
            requestDoneHandlers[requestId] = handler
        }
    }

    /**
     * Remove
     */
    fun removeRequestDoneHandler(requestId: Long) {
        rpExecutorService.run {
            requestDoneHandlers.remove(requestId)
        }
    }

    /**
     * Indicates Request Status
     */
    class RequestStatus{
        var requests = arrayOf<String>()
        var responses = arrayListOf<String>()
    }
}