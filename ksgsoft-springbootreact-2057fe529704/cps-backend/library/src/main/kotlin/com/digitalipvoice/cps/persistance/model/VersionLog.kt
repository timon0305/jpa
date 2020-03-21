package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EntityListeners
import javax.validation.constraints.NotEmpty

@Entity
@EntityListeners(AuditingEntityListener::class)
class VersionLog @JvmOverloads constructor (
        @NotEmpty
        @Column(unique = true)
        var version:String = "" ,
        var description:String = "") : AuditableId()