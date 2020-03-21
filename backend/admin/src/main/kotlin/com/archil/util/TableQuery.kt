package com.archil.util

class TableQuery {
    var page: Long = 0
    var pageSize: Long = 0
    var sorts: ArrayList<SortOption>? = arrayListOf()
    var filters: ArrayList<FilterOption>? = arrayListOf()
    var search: String = ""
    var searchColumns: List<String> = arrayListOf()

    var dateRange: DateRange? = null

    fun addSortsItem(sortOption: SortOption) {
        this.sorts?.add(sortOption)
    }
}