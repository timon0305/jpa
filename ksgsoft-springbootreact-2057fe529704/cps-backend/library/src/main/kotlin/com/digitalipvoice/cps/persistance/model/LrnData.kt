package com.digitalipvoice.cps.persistance.model

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "lrn_data")
class LrnData {
    @Id
    @Column(length = 20)
    var did = ""                // Match with ani in CDR Table

    @Column(length = 20)
    var lrn = ""

    @Column(length = 20)
    var ocn = ""

    @Column(length = 20)
    var grtype = ""
}