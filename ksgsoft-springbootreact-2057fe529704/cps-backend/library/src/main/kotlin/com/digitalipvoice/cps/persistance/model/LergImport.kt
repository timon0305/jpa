package com.digitalipvoice.cps.persistance.model

import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "lerg_import")
class LergImport {

    var state = ""

    var npa = ""

    var nxx = ""

    @Id
    var npaNxx = ""

    var lata = ""

    var carrier = ""

    var acna = ""

    var cic = ""

    var acnaCic = ""

}