package com.digitalipvoice.cps.persistance.model

import java.io.Serializable
import javax.persistence.*

data class LataNpanxxReport2DataId @JvmOverloads constructor(var npaNxx: String = "", var lataNpanxxReport2Id: Long = 0L) : Serializable

@Entity
@IdClass(LataNpanxxReport2DataId::class)
@Table(name = "lata_npanxx_report_2_data")
class LataNpanxxReport2Data {
    @Id
    var npaNxx = ""

    @Id
    @Column(name = "lata_npanxx_report_2_id")
    var lataNpanxxReport2Id = 0L

    @Column(nullable = true)
    var lata = ""
    @Column(nullable = true)
    var state = ""

    @Column(nullable = true)
    var calls = 0
    @Column(nullable = true)
    var totalDuration = 0f

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