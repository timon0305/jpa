package com.digitalipvoice.cps.utils

fun String.isValidEmail(): Boolean {
    return matches("[a-zA-Z0-9_!#\$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+".toRegex())
}

/**
 * Check whether Valid IP Address
 */
fun String.isValidIPAddress(): Boolean {
    val regEx = "(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])"
    return matches(regEx.toRegex())
}

/**
 * Check whether Numeric (Only integer)
 */
fun String.isNumeric(): Boolean {
    return matches("\\d+".toRegex())
}

fun String.escapeStringForMySQL() =
        replace("\\", "\\\\")
                .replace("\b", "\\b")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t")
                .replace("\\x1A", "\\Z")
                .replace("\\x00", "\\0")
                .replace("'", "\\'")


fun String.escapeWildcardWildcardsForMySQL() = replace("%", "\\%")
        .replace("_", "\\_")

