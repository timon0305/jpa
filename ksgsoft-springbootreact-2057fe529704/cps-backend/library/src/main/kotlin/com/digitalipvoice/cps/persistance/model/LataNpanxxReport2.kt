package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableBaseId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "lata_npanxx_report_2")
class LataNpanxxReport2 @JvmOverloads constructor(@Column(length = 50) var name: String = "", var userId: Long = 0L) : AuditableBaseId() {
    @ManyToMany
    @JoinTable(
            name = "lata_npanxx_report_2_rate_deck",
            joinColumns = [JoinColumn(
                    name = "lata_npanxx_report_2_id", referencedColumnName = "id")],
            inverseJoinColumns = [JoinColumn(
                    name = "rate_deck_id", referencedColumnName = "id")])
    var rateDecks: Set<RateDeck> = hashSetOf()

    var isDeleted = false
}