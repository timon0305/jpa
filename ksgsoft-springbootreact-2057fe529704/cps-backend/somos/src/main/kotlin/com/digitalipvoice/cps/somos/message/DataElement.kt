package com.digitalipvoice.cps.somos.message

/**
 * Defines Data Element Type
 */
class DataElement (var type:String = IDENTIFIER, var value:Any = "") {
    companion object {
        const val IDENTIFIER = "IDENTIFIER"
        const val TEXT = "TEXT"
        const val DECIMAL = "DECIMAL"
        const val BINARY = "BINARY"
    }

    override fun equals(other: Any?): Boolean {
        return (other as? DataElement)?.let {
            it.value == value && type == it.type
        } ?: false
    }

    override fun hashCode(): Int {
        var result = type.hashCode()
        result = 31 * result + value.hashCode()
        return result
    }
}