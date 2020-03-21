package com.digitalipvoice.cps.somos.message

import com.turkcelltech.jac.Sequence

interface ISequenceConvertible {
    fun toSequence(): Sequence
}
