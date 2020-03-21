package com.digitalipvoice.cps.persistance.model

import javax.persistence.Column
import javax.persistence.Id
import javax.persistence.MappedSuperclass

@MappedSuperclass
abstract class BaseCdrData {
    @Id
    @Column(columnDefinition = "BIGINT(20) NOT NULL AUTO_INCREMENT")
    var id = 0L

    var rowAni = ""

    var userId = 0L

    var cost: Float? = null

    var rate: Float? = null

    var duration = 0

    var lrn = ""

    // For fast searching
    @Column(length=20)
    var npaNxx = ""
}