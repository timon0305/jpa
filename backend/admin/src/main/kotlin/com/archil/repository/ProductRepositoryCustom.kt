package com.archil.repository

import com.archil.util.TableQuery
import com.archil.util.TableResult

interface ProductRepositoryCustom {
    fun searchProducts(query: TableQuery): TableResult
}