package com.archil.utils

import java.text.NumberFormat
import java.util.*

fun Number.alexFormat(maxDecimalPlaces: Int = 2, minDecimalPlaces: Int = 0, isGrouped: Boolean = true) = NumberFormat.getInstance(Locale.US).apply {
    maximumFractionDigits = maxDecimalPlaces
    minimumFractionDigits = minDecimalPlaces
    isGroupingUsed = isGrouped
}.format(this)