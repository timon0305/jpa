package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.client.somos.models.DcmMessageDTO
import com.digitalipvoice.cps.client.somos.models.SMSTransportHeaderDTO
import com.digitalipvoice.cps.client.somos.models.UPLHeaderDTO
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.service.DcmMessageService
import com.digitalipvoice.cps.service.SMSMessageService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/tools")
class ToolsController {
    @Autowired
    private lateinit var dcmMessageService: DcmMessageService

    @Autowired
    private lateinit var smsMessageService: SMSMessageService

    /**
     * Mainly finds dcm message and join related tables and returns to user.
     */
    @PostMapping("/activity_log")
    @PreAuthorize("hasAuthority('${Privilege.ViewActivityLog}')")
    @ResponseBody
    fun searchActivityLog(@RequestBody query: TableQuery, user: AppUser): ResponseEntity<TableResult> {
        if (query.sorts?.isEmpty() != false) {
            query.addSortsItem(SortOption().column("sms_created_at").direction(SortOption.DirectionEnum.DESC))
        }
        return ResponseEntity.ok(dcmMessageService.search(user, query))
    }

    @GetMapping("/activity_log/{id}")
    @PreAuthorize("hasAuthority('${Privilege.ViewActivityLog}')")
    @ResponseBody
    fun getSomosMessageById(@PathVariable("id") id:Long): ResponseEntity<Any> {
        val message = smsMessageService.findById(id) ?: return ResponseEntity.notFound().build()
        val dto = DcmMessageDTO()
                    .transportHeader(
                            message.dcmMessage?.let {
                                return@let SMSTransportHeaderDTO().version(it.version)
                                        .priority(it.priority)
                                        .messageId(it.messageTag)
                                        .messageCode(it.messageCode)
                                        .srcNodeName(it.sourceNodeName)
                                        .destNodeName(it.destinationNodeName)
                                        .errorCode(it.errorCode.toInt())
                            }
                    )
                    .uplHeader(
                            UPLHeaderDTO()
                                    .confirmationFlag(message.confirmationFlag.toInt())
                                    .correlationID(message.correlationId)
                                    .srcNodeName(message.sourceNodeName)
                                    .DRC(message.DRC)
                                    .errorCode(message.errorCode.toInt())
                    )

        val upldatastring = with(message) {
            val verbMod = "$verb-$mod"

            val dateTimePart = if  (verbMod != "RTRV-ASI") ",$year-${"%02d".format(month)}-${"%02d".format(day)},${"%02d".format(hour)}-${"%02d".format(minute)}-${"%02d".format(second)}-$timezone" else ""
            val statusPart = if (verb == "RSP") "$statusTermRept,$statusErrorCode" else ""
            val testMessageSequencePart = if (mod == "TEST") sequence else ""
            val testMessageMsgPart = if (mod == "TEST") ":\"$testMessage\"" else ""

            // First part before message data block
            val first = "$verbMod:$dateTimePart::$testMessageSequencePart:$statusPart:"

            // Test message or data
            val second = if (testMessageMsgPart.isNotEmpty()) testMessageMsgPart else data

            return@with "$first$second;"
        }

        // Update upl
        dto.upl(upldatastring)

        return ResponseEntity.ok(dto)
    }
}