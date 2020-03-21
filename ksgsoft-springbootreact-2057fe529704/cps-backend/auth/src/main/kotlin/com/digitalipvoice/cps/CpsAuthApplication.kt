package com.digitalipvoice.cps

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CpsAuthApplication

fun main(args: Array<String>) {
    runApplication<CpsAuthApplication>(*args)
}
