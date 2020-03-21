package com.digitalipvoice.cps.somos.message

import com.chaosinmotion.asn1.BerNode

interface IBerNodeConvertible {
    fun toBerNode(): BerNode
}