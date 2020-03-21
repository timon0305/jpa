package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.Auditable
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name="sys_config")
class SysConfig(
                @Id
                var type:String,
                @Column(columnDefinition="TEXT")
                var value:String = "",
                @Lob
                var binaryValue:ByteArray? = null
                ): Auditable()