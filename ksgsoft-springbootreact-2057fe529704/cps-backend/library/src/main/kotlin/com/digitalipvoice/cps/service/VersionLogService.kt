package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.model.toDTO
import com.digitalipvoice.cps.persistance.dao.VersionLogRepository
import com.digitalipvoice.cps.persistance.model.VersionLog
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Service class for version log
 */
@Service
@Transactional
class VersionLogService {
    @Autowired
    private lateinit var versionLogRepository: VersionLogRepository

    /**
     * Find By Version
     */
    fun findByVersion(version:String) = versionLogRepository.findByVersion(version)

    /**
     * All version logs DTO
     */
    fun findAllDTO() = versionLogRepository
            .findAll(Sort.by("version"))
            .map(VersionLog::toDTO)
    /**
     * Creates or update version
     */
    fun createVersionLog(version:String, description: String) {
        val version = versionLogRepository.findByVersion(version) ?: VersionLog(version, description)
        versionLogRepository.save(version)
    }
}

