package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.Notification
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface NotificationRepository:JpaRepository<Notification, Long> {
    /**
     * Find latest notifications
     */
    fun findByUserId(userId:Long, pageable: Pageable): List<Notification>
}