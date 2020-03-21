package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.CprNpanxxReportData
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface CprNpanxxReportDataRepository:JpaRepository<CprNpanxxReportData, Long> {
    fun findAllByCprReportId(cprReportId: Long, pageable: Pageable): Page<CprNpanxxReportData>
}