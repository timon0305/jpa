package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.RateDeck
import org.springframework.data.jpa.repository.JpaRepository

interface RateDeckRepository : JpaRepository<RateDeck, Long> {

    fun findByUserIdAndIsDeletedFalse(userId: Long): List<RateDeck>

    fun findByUserIdAndNameAndIsDeletedFalse(userId: Long, name: String): RateDeck?

    fun findByUserIdAndNameAndCarrierAndIsDeletedFalse(userId: Long, name: String, carrier: String): RateDeck?
}