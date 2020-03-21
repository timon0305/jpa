package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.LcrReportData
import com.digitalipvoice.cps.persistance.model.LcrReportDataId
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface LcrReportDataRepository : JpaRepository<LcrReportData, LcrReportDataId>, LcrReportDataRepositoryCustom {
    fun findAllByLcrReportId(cprReportId: Long, pageable: Pageable): Page<LcrReportData>
}