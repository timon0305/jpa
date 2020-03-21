package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.NotificationDTO
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.toDTO
import com.digitalipvoice.cps.persistance.model.Notification
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.service.NotificationService
import com.digitalipvoice.cps.service.VersionLogService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody


/**
 * Rest API Controller for Dashboard UI
 * Implemented Routes
 *
 */
@Controller
class DashboardController{
    @Autowired
    private lateinit var versionLogService: VersionLogService

    @Autowired
    private lateinit var notificationService: NotificationService

    @GetMapping("/versions")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.Dashboard}')")
    fun getAllVersions() = ResponseEntity.ok(versionLogService.findAllDTO())

    @GetMapping("/notifications")
    @ResponseBody
    fun getNotifications(@RequestParam("count") count:Int, user: AppUser): ResponseEntity<List<NotificationDTO>> {
        if (count <= 0) return ResponseEntity.badRequest().build()
        val result = notificationService.findLatestNotifications(user.id, count).map(Notification::toDTO)
        return ResponseEntity.ok(result)
    }
}

