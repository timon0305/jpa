package com.digitalipvoice.cps.persistance.dao

import com.digitalipvoice.cps.persistance.model.UserProfile
import org.springframework.data.jpa.repository.JpaRepository

interface UserProfileRepository:JpaRepository<UserProfile, Long>