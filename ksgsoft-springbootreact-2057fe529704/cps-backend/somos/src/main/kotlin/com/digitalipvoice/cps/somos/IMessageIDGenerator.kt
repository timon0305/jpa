package com.digitalipvoice.cps.somos

interface IMessageIDGenerator {
    fun next(): String
}