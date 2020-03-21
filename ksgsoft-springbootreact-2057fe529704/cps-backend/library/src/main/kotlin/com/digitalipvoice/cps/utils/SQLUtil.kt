package com.digitalipvoice.cps.utils

/**
 * The Class SQLUtils.
 */
object SQLUtils {

    /** The Constant OPTION_CONTAINS.  */
    val OPTION_CONTAINS = 0

    /** The Constant OPTION_EQUALS.  */
    val OPTION_EQUALS = 1

    /** The Constant OPTION_START_WITH.  */
    val OPTION_START_WITH = 2

    /** The Constant OPTION_END_WITH.  */
    val OPTION_END_WITH = 3

    /** The Constant OPTION_GREATER_THAN.  */
    val OPTION_GREATER_THAN = 4

    /** The Constant OPTION_LESS_THAN.  */
    val OPTION_LESS_THAN = 5

    /** The Constant OPTION_BETWEEN.  */
    val OPTION_BETWEEN = 6

    /**
     * Count.
     *
     * @return the string
     */
    fun COUNT(): String {
        return " select count(*) as max_count "
    }

    /**
     * Count.
     *
     * @param table
     * the table
     * @return the string
     */
    fun COUNT(table: String): String {
        return " select count(*) as max_count from $table "
    }

    /**
     * Group.
     *
     * @param sql
     * the sql
     * @return the string
     */
    fun GROUP(sql: String): String {
        return if (sql.length > 0) " ( $sql ) " else sql
    }

    /**
     * Or.
     *
     * @param sql
     * the sql
     * @return the string
     */
    fun OR(sql: String): String {
        return if (sql.length > 0) "$sql or " else sql

    }

    /**
     * Or.
     *
     * @param sql
     * the sql
     * @param condition
     * the condition
     * @return the string
     */
    fun OR(sql: String, condition: String): String {
        if (sql.isEmpty())
            return condition

        return if (condition.isEmpty()) sql else "$sql or $condition"

    }

    /**
     * Or.
     *
     * @param conditions
     * the conditions
     * @return the string
     */
    fun OR(vararg conditions: String): String {
        var sql = ""

        if (conditions == null)
            return sql

        for (s in conditions) {
            if (s.isEmpty())
                continue

            if (sql.isEmpty())
                sql += " or "
            sql += s
        }

        return sql
    }

    /**
     * And.
     *
     * @param sql
     * the sql
     * @return the string
     */
    fun AND(sql: String): String {
        return if (sql.length > 0) "$sql and " else sql

    }

    /**
     * And.
     *
     * @param sql
     * the sql
     * @param condition
     * the condition
     * @return the string
     */
    fun AND(sql: String, condition: String): String {
        if (sql.isEmpty())
            return condition

        return if (condition.isEmpty()) sql else "$sql and $condition"

    }

    /**
     * And.
     *
     * @param conditions
     * the conditions
     * @return the string
     */
    fun AND(vararg conditions: String): String {
        var sql = ""

        if (conditions == null)
            return sql

        for (s in conditions) {
            if (s.isEmpty())
                continue

            if (sql.isEmpty())
                sql += " and "
            sql += s
        }

        return sql
    }

    /**
     * Order.
     *
     * @param field
     * the field
     * @param order
     * the order
     * @return the string
     */
    fun ORDER(field: String, order: String): String {
        return " order by $field $order "
    }

    /**
     * Order.
     *
     * @param field
     * the field
     * @param order
     * the order
     * @return the string
     */
    fun ORDER(field: Array<String>, order: Array<String>): String {
        var sql = ""
        sql += " order by "

        for (i in field.indices) {
            if (i > 0) {
                sql += ", "
            }

            sql += field[i] + " " + order[i]
        }

        return sql
    }

    /**
     * Asc.
     *
     * @param field
     * the field
     * @return the string
     */
    fun ASC(field: String): String {
        return " order by $field asc "
    }

    /**
     * Desc.
     *
     * @param field
     * the field
     * @return the string
     */
    fun DESC(field: String): String {
        return " order by $field desc "
    }

    /**
     * Limit.
     *
     * @param start
     * the start
     * @param amount
     * the amount
     * @return the string
     */
    fun LIMIT(start: Int, amount: Int): String {
        return " limit $start, $amount "
    }

    /**
     * Table.
     *
     * @param table
     * the table
     * @return the string
     */
    private fun table(table: String): String {
        var table = table
        if (table.length > 0)
            table += "."
        return table
    }

    /**
     * Field.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @return the string
     */
    private fun field(table: String, field: String): String {
        return table(table) + field
    }

    /**
     * Equal.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun EQUAL(table: String, field: String, value: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + field(table, field) + "='" + value + "' "

        return sql
    }

    /**
     * Equal group.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @param operator
     * the operator
     * @return the string
     */
    fun EQUAL_GROUP(table: String, field: String, value: String, operator: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + operator + "(" + field(table, field) + ")='" + value + "' "

        return sql
    }

    /**
     * Not equal.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun NOT_EQUAL(table: String, field: String, value: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + field(table, field) + "<>'" + value + "' "

        return sql
    }

    /**
     * Checks if is null.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @return the string
     */
    fun IS_NULL(table: String, field: String): String {
        var sql = ""

        sql += " " + field(table, field) + " is null "

        return sql
    }

    /**
     * Checks if is not null.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @return the string
     */
    fun IS_NOT_NULL(table: String, field: String): String {
        var sql = ""

        sql += " " + field(table, field) + " is not null "

        return sql
    }

    /**
     * Logical and.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LOGICAL_AND(table: String, field: String, value: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + field(table, field) + " & " + value + " "

        return sql
    }

    /**
     * Greater.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun GREATER(table: String, field: String, value: Int): String {
        var sql = ""

        sql += " " + field(table, field) + ">" + value + " "

        return sql
    }

    /**
     * Greater.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun GREATER(table: String, field: String, value: Long): String {
        var sql = ""

        sql += " " + field(table, field) + ">" + value + " "

        return sql
    }

    /**
     * Greater.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun GREATER(table: String, field: String, value: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + field(table, field) + ">'" + value + "' "

        return sql
    }

    /**
     * Greater than.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun GREATER_THAN(table: String, field: String, value: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + field(table, field) + ">='" + value + "' "

        return sql
    }

    /**
     * Greater than group.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @param operator
     * the operator
     * @return the string
     */
    fun GREATER_THAN_GROUP(table: String, field: String, value: String, operator: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + operator + "(" + field(table, field) + ")>='" + value + "' "

        return sql
    }

    /**
     * Greater than.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun GREATER_THAN(table: String, field: String, value: Int): String {
        var sql = ""

        sql += " " + field(table, field) + ">=" + value + " "

        return sql
    }

    /**
     * Greater than.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun GREATER_THAN(table: String, field: String, value: Long): String {
        var sql = ""

        sql += " " + field(table, field) + ">=" + value + " "

        return sql
    }

    /**
     * Less.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LESS(table: String, field: String, value: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + field(table, field) + "<'" + value + "' "

        return sql
    }

    /**
     * Less.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LESS(table: String, field: String, value: Int): String {
        var sql = ""

        sql += " " + field(table, field) + "<" + value + " "

        return sql
    }

    /**
     * Less than.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LESS_THAN(table: String, field: String, value: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + field(table, field) + "<='" + value + "' "

        return sql
    }

    /**
     * Less than group.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LESS_THAN_GROUP(table: String, field: String, value: String, operator: String): String {
        var sql = ""

        if (value.length > 0)
            sql += " " + operator + "(" + field(table, field) + ")<='" + value + "' "

        return sql
    }

    /**
     * Less than.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LESS_THAN(table: String, field: String, value: Int): String {
        var sql = ""

        sql += " " + field(table, field) + "<=" + value + " "

        return sql
    }

    /**
     * Less than.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LESS_THAN(table: String, field: String, value: Long): String {
        var sql = ""

        sql += " " + field(table, field) + "<=" + value + " "

        return sql
    }

    /**
     * Between.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param start
     * the start
     * @param end
     * the end
     * @return the string
     */
    fun BETWEEN(table: String, field: String, start: String, end: String): String {
        var sql = ""

        if (start.length > 0 || end.length > 0) {
            sql += " ( "
        }

        if (start.length > 0) {
            sql += " " + field(table, field) + ">='" + start + "' "
        }
        if (end.length > 0) {
            if (start.length > 0)
                sql += " and "
            sql += " " + field(table, field) + "<='" + end + "' "
        }

        if (start.length > 0 || end.length > 0) {
            sql += " ) "
        }

        return sql
    }

    /**
     * Between group.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param start
     * the start
     * @param end
     * the end
     * @param operator
     * the operator
     * @return the string
     */
    fun BETWEEN_GROUP(table: String, field: String, start: String, end: String, operator: String): String {
        var sql = ""

        if (start.length > 0 || end.length > 0) {
            sql += " ( "
        }

        if (start.length > 0) {
            sql += " " + operator + "(" + field(table, field) + ")>='" + start + "' "
        }
        if (end.length > 0) {
            if (start.length > 0)
                sql += " and "
            sql += " " + operator + "(" + field(table, field) + ")<='" + end + "' "
        }

        if (start.length > 0 || end.length > 0) {
            sql += " ) "
        }

        return sql
    }

    /**
     * Between.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param start
     * the start
     * @param end
     * the end
     * @return the string
     */
    fun BETWEEN(table: String, field: String, start: Int, end: Int): String {
        var sql = ""

        sql += " ( "

        sql += " " + field(table, field) + ">=" + start + " "
        sql += " and "
        sql += " " + field(table, field) + "<=" + end + " "

        sql += " ) "

        return sql
    }

    /**
     * Between.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param start
     * the start
     * @param end
     * the end
     * @return the string
     */
    fun BETWEEN(table: String, field: String, start: Long, end: Long): String {
        var sql = ""

        sql += " ( "

        sql += " " + field(table, field) + ">=" + start + " "
        sql += " and "
        sql += " " + field(table, field) + "<=" + end + " "

        sql += " ) "

        return sql
    }

    /**
     * Equal.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun EQUAL(table: String, field: Array<String>, value: String): String {
        var sql = ""

        for (i in field.indices) {
            if (i != 0)
                sql += " or "

            sql += " " + field(table, field[i]) + "='" + value + "' "
        }

        return sql
    }

    /**
     * Equal.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun EQUAL(table: String, field: Array<String>, value: Array<String>): String {
        var sql = ""

        for (i in field.indices) {
            if (i != 0)
                sql += " or "

            sql += " " + field(table, field[i]) + "='" + value[i] + "' "
        }

        return sql
    }

    /**
     * Like.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LIKE(table: String, field: String, value: String): String {
        var sql = ""

        sql += " " + field(table, field) + " like '%" + value + "%' "

        return sql
    }

    /**
     * Like.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LIKE(table: String, field: Array<String>, value: String): String {
        var sql = ""

        for (i in field.indices) {
            if (i != 0)
                sql += " or "

            sql += " " + field(table, field[i]) + " like '%" + value + "%' "
        }

        return sql
    }

    /**
     * Like.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun LIKE(table: String, field: Array<String>, value: Array<String>): String {
        var sql = ""

        for (i in field.indices) {
            if (i != 0)
                sql += " or "

            sql += " " + field(table, field[i]) + " like '%" + value[i] + "%' "
        }

        return sql
    }

    /**
     * Start with.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun START_WITH(table: String, field: String, value: String): String {
        var sql = ""

        sql += " " + field(table, field) + " like '" + value + "%' "

        return sql
    }

    /**
     * End with.
     *
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun END_WITH(table: String, field: String, value: String): String {
        var sql = ""

        sql += " " + field(table, field) + " like '%" + value + "' "

        return sql
    }

    /**
     * Option.
     *
     * @param option
     * the option
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @return the string
     */
    fun OPTION(option: Int, table: String, field: String, value: String): String {
        var sql = ""

        when (option) {
            OPTION_CONTAINS -> sql = LIKE(table, field, value)

            OPTION_EQUALS -> sql = EQUAL(table, field, value)

            OPTION_START_WITH -> sql = START_WITH(table, field, value)

            OPTION_END_WITH -> sql = END_WITH(table, field, value)
        }

        return sql
    }

    /**
     * Option.
     *
     * @param option
     * the option
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @param start
     * the start
     * @param end
     * the end
     * @return the string
     */
    fun OPTION(option: Int, table: String, field: String, value: String, start: String, end: String): String {
        var sql = ""

        when (option) {
            OPTION_CONTAINS -> sql = LIKE(table, field, value)

            OPTION_EQUALS -> sql = EQUAL(table, field, value)

            OPTION_START_WITH -> sql = START_WITH(table, field, value)

            OPTION_END_WITH -> sql = END_WITH(table, field, value)

            OPTION_GREATER_THAN -> sql = GREATER_THAN(table, field, value)

            OPTION_LESS_THAN -> sql = LESS_THAN(table, field, value)

            OPTION_BETWEEN -> sql = BETWEEN(table, field, start, end)
        }

        return sql
    }

    /**
     * Option.
     *
     * @param option
     * the option
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @param start
     * the start
     * @param end
     * the end
     * @return the string
     */
    fun OPTION(option: Int, table: String, field: String, value: Int, start: Int, end: Int): String {
        var sql = ""

        when (option) {
            OPTION_GREATER_THAN -> sql = GREATER_THAN(table, field, value)

            OPTION_LESS_THAN -> sql = LESS_THAN(table, field, value)

            OPTION_BETWEEN -> sql = BETWEEN(table, field, start, end)
        }

        return sql
    }

    /**
     * Option.
     *
     * @param option
     * the option
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @param start
     * the start
     * @param end
     * the end
     * @return the string
     */
    fun OPTION(option: Int, table: String, field: String, value: Long, start: Long, end: Long): String {
        var sql = ""

        when (option) {
            OPTION_GREATER_THAN -> sql = GREATER_THAN(table, field, value)

            OPTION_LESS_THAN -> sql = LESS_THAN(table, field, value)

            OPTION_BETWEEN -> sql = BETWEEN(table, field, start, end)
        }

        return sql
    }

    /**
     * Option.
     *
     * @param option
     * the option
     * @param table
     * the table
     * @param field
     * the field
     * @param value
     * the value
     * @param start
     * the start
     * @param end
     * the end
     * @return the string
     */
    fun OPTION_GROUP(option: Int, table: String, field: String, value: String, start: String, end: String, operator: String): String {
        var sql = ""

        when (option) {

            OPTION_EQUALS -> sql = EQUAL_GROUP(table, field, value, operator)

            OPTION_GREATER_THAN -> sql = GREATER_THAN_GROUP(table, field, value, operator)

            OPTION_LESS_THAN -> sql = LESS_THAN_GROUP(table, field, value, operator)

            OPTION_BETWEEN -> sql = BETWEEN_GROUP(table, field, start, end, operator)
        }

        return sql
    }
}