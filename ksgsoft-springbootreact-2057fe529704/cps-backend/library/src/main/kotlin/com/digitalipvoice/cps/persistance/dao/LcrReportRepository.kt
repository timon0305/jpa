package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.LcrReport
import org.springframework.data.jpa.repository.JpaRepository

interface LcrReportRepository : JpaRepository<LcrReport, Long>, LcrReportRepositoryCustom {
    fun findByUserIdAndNameAndIsDeletedFalse(userId: Long, name: String): LcrReport?

    fun findAllByUserIdAndIsDeletedFalse(userId: Long): List<LcrReport>
}