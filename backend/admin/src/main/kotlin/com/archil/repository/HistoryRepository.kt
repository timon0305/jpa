package com.archil.repository

import com.archil.model.History
import org.springframework.data.jpa.repository.JpaRepository

interface HistoryRepository : JpaRepository<History, Long> {
    fun findByName(name: String): List<History>?
    fun findByCreatedate(createdate: String): List<History>?

    fun findAllByCreatedateBetween(value1: String, value2: String): List<History>
}