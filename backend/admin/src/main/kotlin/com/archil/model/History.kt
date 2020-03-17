package com.archil.model

import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "histories")
data class History(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = 0,

        val name: String = "",

        val type: String = "",

        val createdate: String = "",

        val saledate: String = "",

        val number: Int = 0
)