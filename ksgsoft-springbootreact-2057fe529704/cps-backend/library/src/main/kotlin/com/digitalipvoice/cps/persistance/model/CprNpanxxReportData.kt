package com.digitalipvoice.cps.persistance.model

import java.io.Serializable
import javax.persistence.*

@Entity
@Table(name="cpr_npanxx_report_data")
class CprNpanxxReportData {
    @Id
    @Column(columnDefinition = "BIGINT(20) NOT NULL AUTO_INCREMENT")
    var id = 0L

    var cprReportId: Long = 0L

    var npaNxx = ""

    // Total duration of current npa nxx
    var sumDuration = 0L

    // Rate
    var rate = 0f

    // Carrier
    @Column(length=10)
    var carrier = ""

    // LATA
    @Column(length=10)
    var lata = ""
}