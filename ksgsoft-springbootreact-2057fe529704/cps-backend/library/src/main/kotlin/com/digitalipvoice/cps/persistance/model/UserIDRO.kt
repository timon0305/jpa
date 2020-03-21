package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.client.admin.models.SmsIDInfoDTO
import com.digitalipvoice.cps.configuration.Auditable
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name="user_idro")
class UserIDRO(var somosId:String = "",var  ro:String = ""): Auditable() {
    @Id
    @Column(name="user_id")
    var id:Long = 0

    @OneToOne(fetch= FetchType.LAZY)
    @MapsId
    var user:User? = null

    fun toDTO() = SmsIDInfoDTO().id(somosId).ro(ro)

    fun fromDTO(dto:SmsIDInfoDTO) {
        somosId = dto.id
        ro = dto.ro
    }
}