package com.digitalipvoice.cps.persistance.model

import java.io.Serializable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.IdClass

data class LcrReportDataId @JvmOverloads constructor(var npaNxx: String = "", var lcrReportId: Long = 0L) : Serializable

@Entity
@IdClass(LcrReportDataId::class)
class LcrReportData {
    @Id
    var npaNxx = ""

    @Id
    var lcrReportId = 0L

    var minCarrier = ""

    var minRate = 0.0f

    @Column(length=10)
    var carrier_1 = ""

    @Column(length=10)
    var carrier_2 = ""

    @Column(length=10)
    var carrier_3 = ""

    @Column(length=10)
    var carrier_4 = ""

    @Column(length=10)
    var carrier_5 = ""

}