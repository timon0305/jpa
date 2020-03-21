package com.archil.repository

import com.archil.model.Customer
import org.springframework.data.jpa.repository.JpaRepository

interface CustomerRepository : JpaRepository<Customer, Long>, CustomerRepositoryCustom {
    fun findAllByCreatedateBetween(value1: String, value2: String): List<Customer>
}