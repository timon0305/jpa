package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "user_ip")
class UserIP(var ip:String = ""): AuditableId() {
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    var user:User? = null
}