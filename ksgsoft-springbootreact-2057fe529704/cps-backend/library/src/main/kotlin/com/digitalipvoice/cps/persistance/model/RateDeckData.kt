package com.digitalipvoice.cps.persistance.model

import java.io.Serializable
import javax.persistence.*

data class RateDeckDataId @JvmOverloads constructor(var npaNxx: String = "", var rateDeckId: Long = 0L) : Serializable

@Entity
@IdClass(RateDeckDataId::class)
class RateDeckData {
    @Id
    @Column(length = 20)
    var npaNxx = ""

    @Id
    var rateDeckId = 0L


    var effDate = ""


    var incrementDuration = ""

    var initDuration = ""

    var interRate = 0.0f
    var intraRate = 0.0f

    @Column(length = 20)
    var lata = ""

    @Column(length = 20)
    var npa = ""

    @Column(length = 20)
    var nxx = ""

    @Column(length = 50)
    var ocn = ""
}