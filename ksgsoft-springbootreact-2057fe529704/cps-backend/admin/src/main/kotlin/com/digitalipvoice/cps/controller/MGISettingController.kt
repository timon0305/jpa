package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.*
import com.digitalipvoice.cps.model.Admin2SomosCommands
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.BaseResponse
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.persistance.model.SMSConnection
import com.digitalipvoice.cps.service.SMSConnectionService
import com.digitalipvoice.cps.service.UserIDROService
import com.digitalipvoice.cps.utils.isValidIPAddress
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress

@Controller
@RequestMapping("/mgi")
class MGISettingController{
    @Autowired
    private lateinit var smsConnectionService: SMSConnectionService

    @Autowired
    private lateinit var userIDROService: UserIDROService

    @Value("\${udp.server.port}")
    private var udpPort: Int = 0

    /**************************SMS Connections Management*********************************/
    /**
     * Get all available connections
     */
    @GetMapping("/connections")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadSmsConnections}', '${Privilege.WriteSmsConnections}')")
    fun getSomosConnections(): ResponseEntity<List<SMSConnectionDTO>> {
        return ResponseEntity.ok(smsConnectionService.getConnections().map(SMSConnection::toDTO))
    }

    /**
     * Create a sms connection
     */
    @PostMapping("/connections")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteSmsConnections}')")
    fun createSMSConnection(@RequestBody req:SMSConnectionDTO): ResponseEntity<Any> {
        with(req){
            // Validate request
            if (remoteAddr?.isValidIPAddress() != true || srcNodeName?.isEmpty() != false || destNodeName?.isEmpty() != false){
                return ResponseEntity.badRequest().body(BaseResponse("Invalid parameters"))
            }
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(smsConnectionService.createConnection(req).id)
    }

    /**
     * Update a sms connection
     */
    @PutMapping("/connections/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteSmsConnections}')")
    fun updateSMSConnection(@PathVariable id:Long,  @RequestBody req:SMSConnectionDTO): ResponseEntity<String> {
        if (id != req.id){
            return ResponseEntity.badRequest().body("Bad Request")
        }
        smsConnectionService.updateConnection(id, req)
        return ResponseEntity.ok("Updated")
    }

    /**
     * Delete a sms connection
     */
    @DeleteMapping("/connections/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteSmsConnections}')")
    fun deleteSMSConnection(@PathVariable id:Long): ResponseEntity<Long> {
        smsConnectionService.deleteConnection(id)
        return ResponseEntity.ok(id)
    }

    /**
     * Activate SMS Connection
     */
    @PutMapping("/connections/{id}/activate")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteSmsConnections}')")
    fun activateSMSConnection(@PathVariable id:Long): ResponseEntity<String> {
        smsConnectionService.setConnectionActive(id, true)
        return ResponseEntity.ok("Updated")
    }

    /**
     * Deactivate SMS Connection
     */
    @PutMapping("/connections/{id}/deactivate")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteSmsConnections}')")
    fun deactivateSMSConnection(@PathVariable id:Long): ResponseEntity<String> {
        smsConnectionService.setConnectionActive(id, false)
        return ResponseEntity.ok("Updated")
    }

    /**
     * Get MGI Connection status
     */
    @GetMapping("/connections/status")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadSmsConnections}', '${Privilege.WriteSmsConnections}')")
    fun checkMgiConnectionStatus(): ResponseEntity<Int>{
        // TODO - Call SOMOS MGI Module api.
        return ResponseEntity.ok(1) // running
    }

    /**
     * Start MGI Connections
     */
    @GetMapping("/connections/start")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteSmsConnections}')")
    fun startSomosConnections(): ResponseEntity<BaseResponse> {
        try{
            val socket = DatagramSocket();
            val bytes = Admin2SomosCommands.start.toByteArray()
            val packet = DatagramPacket(bytes, bytes.size, InetAddress.getByName("127.0.0.1"), udpPort)

            // Send command.
            socket.send(packet)
        }catch(ex:Exception){}

        return ResponseEntity.ok(BaseResponse("Start command sent."))
    }

    /**
     * Stop MGI Connections
     */
    @GetMapping("/connections/stop")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteSmsConnections}')")
    fun stopSomosConnections(): ResponseEntity<BaseResponse> {
        try{
            val socket = DatagramSocket();
            val bytes = Admin2SomosCommands.stop.toByteArray()
            val packet = DatagramPacket(bytes, bytes.size, InetAddress.getByName("127.0.0.1"), udpPort)

            // Send command.
            socket.send(packet)
        }catch(ex:Exception){}

        return ResponseEntity.ok(BaseResponse("Sto25dgfdp command sent."))
    }

    /**************************ID & Ro Matching*********************************/
    @PostMapping("/users/idro")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadIdRos}', '${Privilege.WriteIdRos}')")
    fun getAllIdRo(@RequestBody query:TableQuery, user: AppUser): ResponseEntity<TableResult> {
        if (query.sorts?.isEmpty() != false) {
            query.addSortsItem(SortOption().column("username"))
        }
        return ResponseEntity.ok(userIDROService.findUserIDROs(user, query))
    }

    @GetMapping("/users/{id}/idro")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadIdRos}', '${Privilege.WriteIdRos}')")
    fun getIdRo(@PathVariable id:Long): ResponseEntity<SmsIDInfoDTO> {
        val idRO = userIDROService.findIDROByUserId(id).toDTO()
        return ResponseEntity.ok(idRO)
    }

    @PostMapping("/users/{id}/idro")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteIdRos}')")
    fun updateUserIdRo(@PathVariable id:Long, @RequestBody dto:SmsIDInfoDTO): ResponseEntity<String> {
        userIDROService.setIDROForUserId(id, dto)
        return ResponseEntity.ok("Updated")
    }

    @DeleteMapping("/users/{id}/idro")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteIdRos}')")
    fun deleteIdRo(@PathVariable id:Long): ResponseEntity<String> {
        userIDROService.deleteIDROByUserId(id)
        return ResponseEntity.ok("Deleted")
    }
}