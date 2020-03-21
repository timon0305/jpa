package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EntityListeners

@Entity
@EntityListeners(AuditingEntityListener::class)
class Notification : AuditableId() {
    // For user, this should not be zero.
    var userId: Long = 0

    var type: Int = TYPE_INFO

    // Section
    var section: Int = SECTION_SYSTEM

    @Column(columnDefinition = "TEXT")
    var message: String = ""

    @Column(columnDefinition = "TEXT")
    var description = ""

    // isRead
    var isRead = false

    companion object {
        /**
         * Notification Types
         */
        const val TYPE_INFO = 0
        const val TYPE_ERROR = 100

        /**
         * Notification sections
         */
        const val SECTION_SYSTEM = 0    // All Notification
        const val SECTION_ADMIN = 1     // Admin System Notification
        const val SECTION_CUSTOMER = 2  // Customer Notification
    }
}