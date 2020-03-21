package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.LataNpanxxReport2Data
import com.digitalipvoice.cps.persistance.model.LataNpanxxReport2DataId
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface LataNpanxxReport2DataRepository : JpaRepository<LataNpanxxReport2Data, LataNpanxxReport2DataId>, LataNpanxxReport2DataRepositoryCustom {
    fun findAllByLataNpanxxReport2Id(lataNpanxxReport2Id: Long, pageable: Pageable): Page<LataNpanxxReport2Data>
}