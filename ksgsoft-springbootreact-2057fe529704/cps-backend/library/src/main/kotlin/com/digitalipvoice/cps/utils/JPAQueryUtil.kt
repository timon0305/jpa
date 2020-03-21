package com.digitalipvoice.cps.utils

import javax.persistence.Query

/**
 * Get single result as integer
 * Useful when count of records
 */
fun Query.singleResultAsNumber()  = (try {singleResult} catch(ex:Exception){null}) as? Number ?: 0