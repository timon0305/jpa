package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.VersionLog
import org.springframework.data.jpa.repository.JpaRepository

interface VersionLogRepository: JpaRepository<VersionLog, Long> {
    /**
     * Find By Version
     * @param version
     */
    fun findByVersion(version:String): VersionLog?
}