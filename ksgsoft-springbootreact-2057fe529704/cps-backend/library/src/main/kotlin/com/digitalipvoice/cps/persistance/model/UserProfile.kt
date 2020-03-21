package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.Auditable
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
class UserProfile(
        var country:String = "",
        var address:String = "",
        var province:String = "",
        var city:String = "",
        var zipcode:String = "",
        var tel1:String = "",
        var tel2:String = "",
        var mobile:String = "",
        var fax:String = ""
        ): Auditable() {
    @Id
    var id:Long = 0

    @OneToOne(fetch= FetchType.LAZY)
    @MapsId
    var user:User? = null
}