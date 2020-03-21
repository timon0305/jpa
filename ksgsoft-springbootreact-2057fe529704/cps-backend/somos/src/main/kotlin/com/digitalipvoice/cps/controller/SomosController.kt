package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.somos.models.TimeoutResponse
import com.digitalipvoice.cps.components.DcmMessageManager
import com.digitalipvoice.cps.components.SMSRequestManager
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.BaseResponse
import com.digitalipvoice.cps.model.SomosIdRo
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.persistance.model.SMSMessage
import com.digitalipvoice.cps.service.ReservedNumberService
import com.digitalipvoice.cps.service.SMSMessageService
import com.digitalipvoice.cps.somos.*
import com.digitalipvoice.cps.somos.message.MgiMessage
import com.digitalipvoice.cps.somos.message.Mods
import com.digitalipvoice.cps.somos.message.blockValue
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*
import org.springframework.web.context.request.async.DeferredResult

@Suppress("MoveLambdaOutsideParentheses")
@Controller
@RequestMapping("/somos/")
class SomosController {
    private val log = logger(javaClass)

    @Autowired
    private lateinit var requestManager: SMSRequestManager


    @Autowired
    private lateinit var smsMessageService: SMSMessageService

    @Autowired
    private lateinit var dcmMessageManager: DcmMessageManager

    @Autowired
    private lateinit var reservedNumberService: ReservedNumberService

    @Value("\${smsrequest.timeout}")
    private var defaultRequestTimeout: Long = 20

    //---------------------------Send Section-------------------------------------------//
    /**
     * Traditional Send Method
     */
    @PostMapping("send")
    @ResponseBody
    @Transactional
    fun send(@RequestParam(value = "verb", defaultValue = "REQ") verb:String,
             @RequestParam(value="mod", required = true)mod:String,
             @RequestParam(value="message", required = true)message:String,
             @RequestParam(value="timeout", required=false)timeout:Long?,

            // Injected parameters
             user: AppUser, idRo:SomosIdRo

    ): DeferredResult<ResponseEntity<*>> {
        return sendInternal(user, idRo, verb, mod, message, timeout, { requestId ->
            smsMessageService.getSomosResponse(requestId) ?: TimeoutResponse().requestId(requestId)
        })
    }

    /**
     * New send method
     */
    @PostMapping("send_new")
    @ResponseBody
    @Transactional
    fun send_new(@RequestParam(value = "verb", defaultValue = "REQ") verb:String,
                 @RequestParam(value="mod", required = true)mod:String,
                 @RequestParam(value="message", required = true)message:String,
                 @RequestParam(value="timeout", required=false)timeout:Long?,

                    // Injected parameters
                 user: AppUser, idRo:SomosIdRo
    ): DeferredResult<ResponseEntity<*>> {
        return sendInternal(user, idRo, verb, mod, message, timeout, { requestId ->
            smsMessageService.getSomosResponseNew(requestId) ?: TimeoutResponse().requestId(requestId)
        })
    }

    /**
     * Send Message Utility function
     * @param verb
     * @param mod
     * @param message
     * @param timeout
     * @param resultFactory
     */
    private fun sendInternal(user:AppUser, idRo:SomosIdRo, verb:String, mod:String, message:String, timeout:Long?
                             , resultFactory:(Long) -> Any,
                             timeOutResultFactory:(Long) -> Any = { TimeoutResponse().requestId(it) }
    ) : DeferredResult<ResponseEntity<*>> {
        // Create result object.
        val tmout = timeout ?: defaultRequestTimeout
        // Create deferred result
        val result = DeferredResult<ResponseEntity<*>>(tmout * 1000)    // This is milliseconds


        // Construct SMSMessage
        val m = SMSMessage()
        m.verb = verb
        m.mod = mod
        // Fill date & time
        m.fillDateTime()
        m.data = message

        // Before saving message, do some validation & security check
        val validation = validateRequest(m, user, idRo)
        if (validation != null) {
            result.setResult(validation)
            return result
        }

        // Validation Succeed
        m.isClientMessage = true

        // Assign user id
        m.userId = user.id

        // Save message
        smsMessageService.save(m, false)

        // request message id is the same is its id for request message
        m.requestMessageId = m.id

        // Send message
        dcmMessageManager.sendSMSMessage(m)

        log.debug("Message was added to Queue:")
        log.debug("---------------------------")
        log.debug(m.toString())
        log.debug("---------------------------")

        val requestId = m.id

        // set timeout handler
        result.onTimeout {
            // Remove request done handler first
            requestManager.removeRequestDoneHandler(requestId)
            result.setErrorResult(ResponseEntity.status(HttpStatus.ACCEPTED).body(timeOutResultFactory(requestId)))
        }

        // Register request to check response message
        requestManager.registerSMSRequests(requestId, listOf(m.correlationId), tmout)

        // Add request done handler
        requestManager.addRequestDoneHandler(requestId){
            // When response for request is arrived.
            result.setResult(ResponseEntity.ok(resultFactory(requestId)))
        }
        return result
    }

    //---------------------------Retrieve Section-------------------------------------------//

    /**
     * Retrieve response with request id
     */
    @GetMapping("retrieve/{id}")
    @ResponseBody
    fun retrieve(@PathVariable(name = "id") requestId: Long): ResponseEntity<*> {
        val resp = smsMessageService.getSomosResponse(requestId) ?: return ResponseEntity.notFound().build<String>()
        return ResponseEntity.ok(resp)
    }

    /**
     * Retrieve response
     */
    @GetMapping("retrieve_new/{id}")
    @ResponseBody
    fun retrieve_new(@PathVariable(name = "id") requestId: Long): ResponseEntity<*> {
        val resp = smsMessageService.getSomosResponseNew(requestId) ?: return ResponseEntity.notFound().build<String>()
        return ResponseEntity.ok(resp)
    }

    //----------------------------apis for stand alone apps----------------------------------------//
    @PostMapping("send_standalone")
    @ResponseBody
    @Transactional
    @PreAuthorize("hasAuthority('${Privilege.TestBench}')")
    fun send_standalone(@RequestParam(value = "verb", required = true) verb:String,
                        @RequestParam(value="mod", required = true)mod:String,
                        @RequestParam(value="message", required = true)message:String,
                        @RequestParam(value="timeout", required=false)timeout:Long?,
                        user: AppUser

    ): DeferredResult<ResponseEntity<*>> {
        val handler: (Long) -> Any = h@{
            return@h smsMessageService.getSomosResponseStandalone(it)
        }
        return sendInternal(user, SomosIdRo(0, "", "", ""), verb, mod, message, timeout,
                handler, handler)
    }

    @GetMapping("retrieve_standalone/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.TestBench}')")
    fun retrieve_standalone(@PathVariable(name = "id") requestId: Long): ResponseEntity<*> {
        return ResponseEntity.ok(smsMessageService.getSomosResponseStandalone(requestId))
    }

    /**
     * Reserved Number List
     */
    @PostMapping("reserved_numbers")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.ReservedNumberList}')")
    fun reservedNumbers(user:AppUser, somosIdRo: SomosIdRo, @RequestBody query:TableQuery): ResponseEntity<Any> {
        return ResponseEntity.ok(reservedNumberService.find(
                if (user.isSuperAdmin) null else somosIdRo,
                query
        ))
    }



    /**
     * Validate & Pre-Authorize request from client.
     */
    private fun validateRequest(message:SMSMessage, user:AppUser, smsIdRo: SomosIdRo): ResponseEntity<Any>?{

        // Check if this user is able to send test bench message
        if (user.hasPrivilege(Privilege.TestBench)) {
            // No validation required.
            return null
        }

        // Build mgi message
        val mgi = MgiMessage(message.toUplDataString())

        // 1. ID / RO Validation
        val id = mgi.blockValue("ID").firstOrNull() ?: ""
        val ro = mgi.blockValue("RO").firstOrNull() ?: ""

        val builder = ResponseEntity.status(HttpStatus.FORBIDDEN)
        if (smsIdRo.id != id || smsIdRo.ro != ro) {
            return builder.body(BaseResponse("ID/RO doesn't match with your account"))
        }

        val forbiddenEntity = ResponseEntity.status(HttpStatus.FORBIDDEN)

        // Mod Check and privileges
        val mod = message.mod
        if (mod == Mods.NumSearchReserve) {     // Number Search Reserve Request.
            // Check Action Code
            val action = mgi.blockValue("AC").firstOrNull() ?: ""
            if (action == "S") {    // Search Number
                if (!user.hasPrivilege(Privilege.NumberSearch)){
                    return forbiddenEntity.body(forbiddenMessage("Number Search & Reserve"))
                }
            } else if (action == "R") { // Reserve Number
                if (!user.hasPrivilege(Privilege.NumberSearch)){
                    return forbiddenEntity.body(forbiddenMessage("Number Reservation"))
                }
            } else if (action == "Q"){  // Query Number
                if (!user.hasPrivilege(Privilege.NumberQueryUpdate)){
                    return forbiddenEntity.body(forbiddenMessage("Number Query"))
                }
            } else {
                return ResponseEntity.badRequest().build()
            }
        } else if (mod == Mods.NumStatusChange) {    // Number Status Change.
            val action = mgi.blockValue("AC").firstOrNull() ?: ""
            if (action == "C" || action == "S" || action == "R") {
                if (!user.hasPrivilege(Privilege.NumberStatusChange) && !user.hasPrivilege(Privilege.NumberQueryUpdate)) {
                    return forbiddenEntity.body(forbiddenMessage("Number Status Change"))
                }
            } else {
                return ResponseEntity.badRequest().build()
            }
        } else if (mod == Mods.MutiDialNumQuery) {    // Multi Dial Number Query.
            if (!user.hasPrivilege(Privilege.MultiNumberQuery)) {
                return forbiddenEntity.body(forbiddenMessage("Request Multi Dial Number Query"))
            }
        } else if (mod == Mods.UpdateComplexRec) {    // Update Complex Record
            // Check if this request is related to template or not.
            val isPointer = mgi.blockValue("TMPLTPTR").firstOrNull() != null
            if (isPointer){
                if (!user.hasPrivilege(Privilege.MultiConversionToPointerRecords) && !user.hasPrivilege(Privilege.PointerRecord)) {
                    return forbiddenEntity.body(forbiddenMessage("PAD"))
                }
            } else {
                if (!user.hasPrivilege(Privilege.CustomerRecord)){
                    return forbiddenEntity.body(forbiddenMessage("CAD"))
                }
            }
        } else if (mod == Mods.TemplateRecLst) {    // TRL
            // Should have TAD or TRL privilege
            if (!user.hasPrivilege(Privilege.TemplateAdminData) && !user.hasPrivilege(Privilege.TemplateRecordList)) {
                return forbiddenEntity.body(BaseResponse("TRL"))
            }
        } else if (mod == Mods.UpdateTemplateRec)  { // TRC
            // Should have TAD or TRL privilege
            if (!user.hasPrivilege(Privilege.TemplateAdminData) && !user.hasPrivilege(Privilege.TemplateRecordList)) {
                return forbiddenEntity.body(BaseResponse("TRC"))
            }
        }
        else if (mod == Mods.RecStatQuery || mod == Mods.RecQuery) {      // CRQ or CRV (Record Status Query, Record Query)
            val isTemplate = mgi.blockValue("TMPLTNM").firstOrNull() != null
            if (isTemplate){
                if (!user.hasPrivilege(Privilege.TemplateAdmin)){
                    return forbiddenEntity.body(forbiddenMessage("Template Record Query"))
                }
            } else {
                if (!user.hasPrivilege(Privilege.CustomerRecord) && !user.hasPrivilege(Privilege.PointerRecord)){
                    return forbiddenEntity.body(forbiddenMessage("Customer Record Query"))
                }
            }
        } else if (mod == Mods.TroubleRefNumQuery) {    // TRN
            if (!user.hasPrivilege(Privilege.TroubleReferralNumberQuery)) {
                return forbiddenEntity.body(forbiddenMessage("Trouble Referral Number Query"))
            }
        } else if (mod == Mods.MultiDialNumROChange){   // MRO
            if (!user.hasPrivilege(Privilege.MultiNumberChangeRespOrg)) {
                return forbiddenEntity.body(forbiddenMessage("Mulitple Number Change RO"))
            }
            val newRO = mgi.blockValue("NEWRO").firstOrNull() ?: ""
            if (newRO.isEmpty()) {
                return ResponseEntity.badRequest().body(BaseResponse("NEWRO parameter required"))
            }
        }
        else {
            return ResponseEntity.badRequest().body(BaseResponse("Operation not supported by system yet."))
        }
        return null
    }

    fun forbiddenMessage(priv:String) = BaseResponse("You are not granted access to ${priv}.")
}