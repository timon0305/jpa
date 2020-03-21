package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.persistance.dao.NotificationRepository
import com.digitalipvoice.cps.persistance.model.Notification
import com.digitalipvoice.cps.utils.findByIdKt
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import reactor.core.publisher.DirectProcessor
import reactor.core.publisher.Flux

@Service
class NotificationService {
    @Autowired
    private lateinit var notificationRepository: NotificationRepository

    /**
     * Non-backpressure supported.
     */
    private val processor = DirectProcessor.create<Notification>()

    /**
     * Find Latest N Notifications
     */
    fun findLatestNotifications(userId:Long, count: Int) =
            notificationRepository.findByUserId(userId, PageRequest.of(0, count, Sort.by(Sort.Order.desc("createdDate")))).toList()

    /**
     * Save notification.
     */
    fun save(notification: Notification) {
        // Save to repository
        notificationRepository.saveAndFlush(notification)
        processor.onNext(notification)
    }

    /**
     * This is to push already saved notification. Single push
     */
    fun push(id:Long) {
        notificationRepository.findByIdKt(id)?.let { processor.onNext(it) }
    }

    /**
     * Subscribe for user id
     */
    fun notificationFlux(userId:Long): Flux<Notification> {
        return processor.filter{
            it.userId == userId
        }
    }
}