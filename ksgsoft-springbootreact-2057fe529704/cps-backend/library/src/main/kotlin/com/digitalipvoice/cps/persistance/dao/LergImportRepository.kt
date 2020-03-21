package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.LergImport
import org.springframework.data.jpa.repository.JpaRepository

interface LergImportRepository : JpaRepository<LergImport, String>, LergImportRepositoryCustom