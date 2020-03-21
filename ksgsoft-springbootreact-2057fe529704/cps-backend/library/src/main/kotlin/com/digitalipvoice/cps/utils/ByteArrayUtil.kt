package com.digitalipvoice.cps.utils

/**
 * Extension function of ByteArray
 * @return Hexadecimal representation of this byte array
 */
fun ByteArray.hexString(): String{
    val hexArray = "0123456789ABCDEF".toCharArray()
    val hexChars = CharArray(size * 2)
    for (i in indices) {
        val v = (this[i].toInt() and 0xFF)
        hexChars[i * 2] = hexArray[v ushr 4]
        hexChars[i * 2 + 1] = hexArray[v and 0xF]
    }
    return String(hexChars)
}

/**
 * Take n bytes and if shorter than n, pad
 */
fun ByteArray.takePadding(n:Int): List<Byte> {
    val result = this.take(n).toMutableList()
    if (result.size == n)
        return result
    val padding = ByteArray(n - result.size)
    padding.fill(0)
    result.addAll(padding.toList())
    return result
}

/**
 * Merge byte array utility
 */
fun Collection<ByteArray>.mergeAll(): ByteArray {
    val total = fold(0){ sum, element -> sum + element.size }
    val result = ByteArray(total)
    var destPos = 0
    forEach{br ->
        if (br.isNotEmpty()) {
            System.arraycopy(br, 0, result, destPos, br.size)
            destPos += br.size
        }
    }
    return result
}