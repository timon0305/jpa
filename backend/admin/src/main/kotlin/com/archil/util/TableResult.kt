package com.archil.util

class TableResult {
    var rows: ArrayList<Any?> = arrayListOf()
    var query: TableQuery = TableQuery()
    var totalPages: Long = 0L
    var totalCount: Long = 0L

    var totalFilteredCount: Long = 0L
}