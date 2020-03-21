package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.client.admin.models.SMSConnectionDTO
import com.digitalipvoice.cps.configuration.AuditableId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.Entity
import javax.persistence.EntityListeners
import javax.persistence.Table

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name="sms_connection")
data class SMSConnection @JvmOverloads constructor(
        var serverAddress:String = "",
        var port:Int = 0,
        var srcNodeName:String = "",
        var destNodeName:String = "",
        var isActive:Boolean = true
): AuditableId() {
    /**
     * DTO Conversion
     */
    fun fromDTO(dto: SMSConnectionDTO){
        serverAddress = dto.remoteAddr
        port = dto.port
        srcNodeName = dto.srcNodeName
        destNodeName = dto.destNodeName
        isActive = dto.isActive
    }

    /**
     * Convert into dto
     */
    fun toDTO() =
            SMSConnectionDTO()
                    .remoteAddr(serverAddress)
                    .port(port)
                    .srcNodeName(srcNodeName)
                    .destNodeName(destNodeName)
                    .active(isActive)
                    .id(id)!!
}