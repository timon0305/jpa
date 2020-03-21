package com.archil.repository

import com.archil.util.TableQuery
import com.archil.util.TableResult

interface CustomerRepositoryCustom {
    fun searchCustomers(query: TableQuery): TableResult
}