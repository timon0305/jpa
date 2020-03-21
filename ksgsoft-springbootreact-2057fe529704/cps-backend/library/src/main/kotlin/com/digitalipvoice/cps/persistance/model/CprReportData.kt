package com.digitalipvoice.cps.persistance.model

import javax.persistence.*

@Entity
@Table(name="cpr_report_data")
class CprReportData: BaseCdrData() {

    // Assoicated
    var cprReportId = 0L

    var reRate: Float? = null

    var costSavings: Float? = null

    // Minimum price carrier
    var carrier = ""
}