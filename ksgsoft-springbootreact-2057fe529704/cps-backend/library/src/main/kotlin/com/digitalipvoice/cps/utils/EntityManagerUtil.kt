package com.digitalipvoice.cps.utils

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import javax.persistence.EntityManager
import javax.persistence.Tuple
import kotlin.math.ceil


fun EntityManager.nativeTableQuery(query:TableQuery, from: String, vararg columns: String) =
        nativeTableQueryGroupBy(query, from, "", * columns)
/**
 * @param query TableQuery
 * @param from SQL Clause for table selection. Contains tables and join clauses or basic where clauses
 * e.g.
 *  `user u, role r, user_role ur WHERE u.id = ur.user_id AND r.id = ur.role_id`
 * @param columns Columns to read.  Fetched field names will be obtained form these parameters.
 * For example, `u.id` will be `id`, `r.id as role_id` will be `role_id`. Check the code
 *
 * e.g.
 * "u.id",
 * "u.username",
 * ...
 * "r.id as role_id",
 * "r.role", "u.created_at", "u.updated_at"
 * @return TableResult
 */
fun EntityManager.nativeTableQueryGroupBy(query: TableQuery, from:String, groupBy: String = "", vararg columns: String): TableResult {
    // Get field names from columns
    val nameMap = mutableMapOf<String, String>()
    val fieldNames = mutableListOf<String>()
    columns.forEach {
        val (value, key) = toFieldNames(it)
        nameMap[key] = value
        fieldNames.add(key)
    }

    // Get prefix for table query where condition clause
    val wherePrefix = if (from.contains("WHERE ")) " AND " else " WHERE "

    // Generate partial sqls
    val whereSQL = query.whereConditions(wherePrefix, nameMap){fieldNames.contains(it)}
    val orderBySQL = query.orderBySQL(nameMap){fieldNames.contains(it)}
    val limitSQL = query.limitSQL()

    val result = TableResult()
    result.query = query

    // Calculate total count
    result.totalCount = createNativeQuery(SQLUtils.COUNT(from)).singleResultAsNumber().toLong()

    val filteredFrom = "$from $whereSQL $groupBy"

    // Calculate total filtered count
    result.totalFilteredCount = createNativeQuery(SQLUtils.COUNT(filteredFrom)).singleResultAsNumber().toLong()

    // Fetch result
    val fetchSQL = "SELECT ${columns.joinToString()} FROM $filteredFrom $orderBySQL $limitSQL"

    result.query = query
    result.rows = createNativeQuery(fetchSQL, Tuple::class.java).resultList
    result.totalPages = ceil(result.totalFilteredCount.toFloat() / query.pageSize.toFloat()).toLong()

    return result
}


/**
 * @param colName : SQL Col selection string
 * @return field name
 * Example
 * field name of `u.id` will be `id`
 * field name of `r.id as role_id` will be `role_id`
 */
private fun toFieldName(colName:String): String {
    val indexOfAs = colName.toLowerCase().indexOf(" as ")
    return when {
        indexOfAs == -1 -> {
            val indexOfDot = colName.indexOf(".")
            if (indexOfDot == -1 || indexOfDot >= colName.length - 1)
                throw Exception("Not correct column name : $colName")
            colName.substring(indexOfDot + 1)
        }
        indexOfAs >= colName.length - 4 -> throw Exception("Not correct column name : $colName")
        else -> colName.substring(indexOfAs + 4)
    }
}

/**
 * @param colName : SQL Col selection string
 * @return field name, field name
 * e.g. `u.id` will return pair of `u.id` , `id`
 * `r.id as role_id` will return pair of `r.id`, `role_id`
 */
private fun toFieldNames(colName: String): Pair<String, String> {
    val indexOfAs = colName.toLowerCase().indexOf(" as ")
    return when {
        indexOfAs == -1 -> {
            val indexOfDot = colName.indexOf(".")
            if (indexOfDot == -1 || indexOfDot >= colName.length - 1)
                throw Exception("Not correct column name : $colName")
            //
            Pair(colName, colName.substring(indexOfDot + 1))
        }
        indexOfAs >= colName.length - 4 -> throw Exception("Not correct column name : $colName")
        else -> Pair(colName.slice(0 until indexOfAs), colName.substring(indexOfAs + 4))
    }
}