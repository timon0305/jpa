package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.RateDeckData
import com.digitalipvoice.cps.persistance.model.RateDeckDataId
import org.springframework.data.jpa.repository.JpaRepository

interface RateDeckDataRepository : JpaRepository<RateDeckData, RateDeckDataId> , RateDeckDataRepositoryCustom