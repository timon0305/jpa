package com.archil.model

import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "products")
data class Product(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = 0,

        val name: String = "",

        val type: String = "",

        val profit: String = "",

        val number: Int = 0,

        val startdate: String = "",

        val price: Double = 0.0,

        val cost: Double = 0.0,

        val percent: Float = 0f
)