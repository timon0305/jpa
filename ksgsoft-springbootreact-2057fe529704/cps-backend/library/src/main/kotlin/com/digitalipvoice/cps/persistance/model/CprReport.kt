package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableBaseId
import javax.persistence.*

@Entity
@Table(name="cpr_report")
class CprReport @JvmOverloads constructor(var name: String = "", var userId: Long = 0L) : AuditableBaseId() {

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="lcr_report_id")
    var lcrReport:LcrReport? = null

    // var isDeleted = false
    var totalCost:Double = 0.0

    var averageRate:Float = 0.0f

    // The carrier that has the maximum sum of duration. per npanxx
    @Column(length = 10)
    var defaultCarrier = ""

    // The most frequent npa nxx
    @Column(length = 10)
    var defaultCarrierNpaNxx = ""
}