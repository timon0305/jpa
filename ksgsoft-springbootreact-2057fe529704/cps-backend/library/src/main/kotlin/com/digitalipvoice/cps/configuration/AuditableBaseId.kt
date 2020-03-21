package com.digitalipvoice.cps.configuration

import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.EntityListeners
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.MappedSuperclass

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class AuditableBaseId: AuditableBase() {
    @Id
    @GeneratedValue
    var id: Long = 0
}