package com.archil.util

class SortOption {
    var column: String = ""
    var direction: String? = null

    fun column(column: String): SortOption {
        this.column = column
        return this
    }

    fun direction(direction: String?): SortOption {
        this.direction = direction
        return this
    }
}