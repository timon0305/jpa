package com.archil.repository

import com.archil.util.TableQuery
import com.archil.util.TableResult

interface HistoryRepositoryCustom {
    fun searchHistories(query: TableQuery) : TableResult
}