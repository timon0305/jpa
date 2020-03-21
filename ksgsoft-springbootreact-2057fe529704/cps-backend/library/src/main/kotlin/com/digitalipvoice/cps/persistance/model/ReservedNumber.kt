package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableBase
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

/**
 * Tollfree Number Status
 */
@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name="reserved_number")
class ReservedNumber @JvmOverloads constructor(@Id
                     @Column(unique = true, length=20)
                     var number:String = "") : AuditableBase() {

    @Column(length = 20)
    var smsId = ""

    @Column(length = 20)
    var ro = ""

    @Column(length = 50)
    var reservedUntil = ""

    @Column(length = 50)
    var lastActivated = ""

    var contactPerson = ""

    @Column(length=20)
    var contactNumber = ""
}