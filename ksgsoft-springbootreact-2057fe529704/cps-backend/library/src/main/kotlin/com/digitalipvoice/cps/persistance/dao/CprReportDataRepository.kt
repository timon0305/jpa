package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.CprReportData
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository


interface CprReportDataRepository : JpaRepository<CprReportData, Long>, CprReportDataRepositoryCustom {
    fun findAllByCprReportId(cprReportId: Long, pageable: Pageable): Page<CprReportData>
}