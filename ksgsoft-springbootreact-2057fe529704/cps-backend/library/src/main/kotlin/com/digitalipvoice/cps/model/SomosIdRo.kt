package com.digitalipvoice.cps.model

data class SomosIdRo(val userId:Long, val username:String, val id:String, val ro:String) {

    /**
     * Check whether this information is valid
     */
    val isValid:Boolean
        get() = id.isNotEmpty() && ro.isNotEmpty()
}