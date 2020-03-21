package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableBaseId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "lcr_report")
class LcrReport @JvmOverloads constructor(@Column(length = 50) var name: String = "", var userId: Long = 0L) : AuditableBaseId() {
    @ManyToMany
    @JoinTable(
            name = "lcr_report_rate_deck",
            joinColumns = [JoinColumn(
                    name = "lcr_report_id", referencedColumnName = "id")],
            inverseJoinColumns = [JoinColumn(
                    name = "rate_deck_id", referencedColumnName = "id")])
    var rateDecks: Set<RateDeck> = hashSetOf()

    var isDeleted = false
}