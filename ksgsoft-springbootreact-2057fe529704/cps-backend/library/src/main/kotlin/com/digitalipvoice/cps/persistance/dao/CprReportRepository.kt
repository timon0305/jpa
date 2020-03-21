package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.CprReport
import org.springframework.data.jpa.repository.JpaRepository

interface CprReportRepository : JpaRepository<CprReport, Long>, CprReportRepositoryCustom {
    fun findByUserIdAndName(userId: Long, name: String) : CprReport?
}