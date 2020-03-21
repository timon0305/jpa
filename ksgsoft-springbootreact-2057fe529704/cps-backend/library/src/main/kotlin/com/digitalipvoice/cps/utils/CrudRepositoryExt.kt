package com.digitalipvoice.cps.utils

import org.springframework.data.repository.CrudRepository

fun <E, K> CrudRepository<E, K>.findByIdKt(id: K): E? {
    val o = findById(id)
    return if (o.isPresent) o.get() else null
}