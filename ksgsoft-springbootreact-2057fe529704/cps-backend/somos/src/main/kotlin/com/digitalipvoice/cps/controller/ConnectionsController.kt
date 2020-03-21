package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.components.SMSConnectionManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ResponseBody

/**
 * Controller class that has local control method.
 * Method in this controller will be called by admin module and requires no authentication.
 * Require host ip to be 127.0.0.1
 */
@Controller
class ConnectionsController{
    @Autowired
    private lateinit var smsConnectionManager: SMSConnectionManager

    /**
     * This is called from admin module.
     */
    @GetMapping("/connections/start")
    @ResponseBody
    fun startConnections(): ResponseEntity<String>{
        smsConnectionManager.restartConnections()
        return ResponseEntity.ok("")
    }

    /**
     * This is called from admin module.
     */
    @GetMapping("/connections/restart")
    @ResponseBody
    fun restartConnections(): ResponseEntity<String>{
        smsConnectionManager.restartConnections()
        return ResponseEntity.ok("")
    }

    /**
     * This is called from admin module.
     */
    @GetMapping("/connections/stop")
    @ResponseBody
    fun stopConnections(): ResponseEntity<String>{
        smsConnectionManager.stopConnections()
        return ResponseEntity.ok("")
    }
}