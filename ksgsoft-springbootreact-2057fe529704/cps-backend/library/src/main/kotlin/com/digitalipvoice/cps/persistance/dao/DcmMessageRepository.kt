package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.DcmMessage
import org.springframework.data.jpa.repository.JpaRepository

interface DcmMessageRepository: JpaRepository<DcmMessage, Long>, DcmMessageRepositoryCustom