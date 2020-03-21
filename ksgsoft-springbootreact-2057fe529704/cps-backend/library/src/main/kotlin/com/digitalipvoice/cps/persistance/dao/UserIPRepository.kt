package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.UserIP
import org.springframework.data.jpa.repository.JpaRepository

interface UserIPRepository: JpaRepository<UserIP, Long>