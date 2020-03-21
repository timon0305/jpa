package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.SMSConnection
import org.springframework.data.jpa.repository.JpaRepository

interface SMSConnectionRepository: JpaRepository<SMSConnection, Long>