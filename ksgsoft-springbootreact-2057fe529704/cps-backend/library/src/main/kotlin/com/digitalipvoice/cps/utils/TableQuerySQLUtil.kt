package com.digitalipvoice.cps.utils

import com.digitalipvoice.cps.client.admin.models.TableQuery

/**
 * Get Where Condition string of TableQuery
 * @param isAllowedColumn - Lambda to check if column in query is allowed
 * @param prefix - Should be " WHERE " or " AND "
 * @return where condition clauses : This doesn't contain WHERE clause
 */
fun TableQuery.whereConditions(prefix:String, nameMap:Map<String, String>, isAllowedColumn:((String) -> Boolean)? = null) : String {
    val conds = mutableListOf<String>()

    // Check Filter Options
    filters?.forEach {option ->
        if (option.column != null && isAllowedColumn?.invoke(option.column) != false) {

            // Real column, which should be `u.id` in `u.id as user_id`
            // nameMap['user_id'] is `u.id`
            val realColumn = nameMap[option.column]
            if (realColumn != null){
                if (option.exact != null)
                    conds.add("($realColumn = '${option.exact}')")
                else if (option.contains != null) {
                    conds.add("($realColumn LIKE '%${option.contains}%')")
                }
                else if (option.from != null && option.to != null) {
                    conds.add("($realColumn BETWEEN '${option.from}' AND '${option.to}')")
                } else if(option.from != null) {
                    conds.add("($realColumn >= '${option.from}')")
                } else if(option.to != null) {
                    conds.add("($realColumn <= '${option.to}')")
                }
            }
        }
    }

    // check overall search
    if (search?.isNotEmpty() == true){
        searchColumns?.forEach {
            // Real column, which should be `u.id` in `u.id as user_id`
            // nameMap['user_id'] is `u.id`
            val realColumn = nameMap[it]

            if (realColumn != null) {
                conds.add("($realColumn LIKE '%$search%')")
            }
        }
    }

    // Join conditions
    val joined =  conds.joinToString(" AND ")

    // Return clause
    return if (joined.isEmpty()) "" else "$prefix $joined"
}

/*
Get Order By Clause from sort option
 */
fun TableQuery.orderBySQL(nameMap: Map<String, String>, isAllowedColumn:((String) -> Boolean)? = null): String {
    val conds = mutableListOf<String>()
    sorts?.forEach{option ->
        if (isAllowedColumn?.invoke(option.column) != false) {
            // Real column, which should be `u.id` in `u.id as user_id`
            // nameMap['user_id'] is `u.id`
            val realColumn = nameMap[option.column]

            if (realColumn != null) {
                val direction = option.direction?.value ?: "ASC"
                conds.add("$realColumn $direction")
            }
        }
    }
    val joined = conds.joinToString(", ")

    return if (joined.isEmpty()) "" else " ORDER BY $joined"
}

/**
 * Get LIMIT SQL
 */
fun TableQuery.limitSQL():String {
    val size = pageSize ?: 10  //Default page size is 10
    val page = page ?: 0
    return " LIMIT ${page * size}, $size"
}