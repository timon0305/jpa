package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.LataNpanxxReport2
import com.digitalipvoice.cps.persistance.model.LcrReport
import org.springframework.data.jpa.repository.JpaRepository

interface LataNpanxxReport2Repository : JpaRepository<LataNpanxxReport2, Long>, LataNpanxxReport2RepositoryCustom {
    fun findByUserIdAndNameAndIsDeletedFalse(userId: Long, name: String): LcrReport?

    fun findAllByUserIdAndIsDeletedFalse(userId: Long): List<LcrReport>
}