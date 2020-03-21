package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.ReservedNumber
import org.springframework.data.jpa.repository.JpaRepository

interface ReservedNumberRepository: JpaRepository<ReservedNumber, String>, ReservedNumberRepositoryCustom