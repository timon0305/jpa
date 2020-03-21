package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.SysConfig
import org.springframework.data.jpa.repository.JpaRepository

interface SysConfigRepository: JpaRepository<SysConfig, String>