package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableBaseId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EntityListeners
import javax.persistence.Table

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "rate_deck")
class RateDeck @JvmOverloads constructor(
        var name: String = "",
        @Column(length = 20) var carrier: String = "",
        var userId: Long = 0L,
        var isDeleted: Boolean = false) : AuditableBaseId()