package com.archil.repository

import com.archil.model.Product
import org.springframework.data.jpa.repository.JpaRepository

interface ProductRepository : JpaRepository<Product, Long>, ProductRepositoryCustom {
    fun findAllByStartdateBetween(value1: String, value2: String): List<Product>
}