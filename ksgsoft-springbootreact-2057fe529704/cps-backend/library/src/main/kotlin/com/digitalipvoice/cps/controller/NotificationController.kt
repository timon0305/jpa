package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.exceptions.ForbiddenException
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.BaseResponse
import com.digitalipvoice.cps.persistance.model.Notification
import com.digitalipvoice.cps.service.NotificationService
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.Environment
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import reactor.core.publisher.Flux
import java.util.*

/**
 * Common controller used by admin and somos module
 */
@Controller
@RequestMapping("/notification")
class NotificationController {
    @Autowired
    private lateinit var notificationService: NotificationService

    @Autowired
    private lateinit var environment: Environment

    private val log = logger(javaClass)
    /**
     * Flux subscriber
     */
    @GetMapping("/subscribe", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun subscribe(user:AppUser): Flux<Notification> {
        return notificationService.notificationFlux(user.id).doOnNext {
            log.error("Sending Notification : ${it.message}")
        }
    }

    @GetMapping("/test_subscribe")
    fun testSubscribe(user:AppUser): ResponseEntity<BaseResponse> {
        if (!environment.activeProfiles.contains("dev") && !environment.activeProfiles.contains("ide")) {
            throw ForbiddenException("Forbidden API")
        }
        val notification = Notification().apply {
            userId = user.id
            message = "Notification Test on ${Date().time}"
            type = Notification.TYPE_INFO
            section = Notification.SECTION_ADMIN
        }
        notificationService.save(notification)
        return ResponseEntity.ok(BaseResponse("Pushed Notification"))
    }
    //TODO -  Unread notifications count fetch handler

    //TODO -  Notifications list fetch handler
}