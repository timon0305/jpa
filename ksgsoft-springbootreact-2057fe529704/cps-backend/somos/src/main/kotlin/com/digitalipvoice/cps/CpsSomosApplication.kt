package com.digitalipvoice.cps

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaAuditing

@SpringBootApplication
@EnableJpaAuditing
class CpsSomosApplication

fun main(args: Array<String>) {
    runApplication<CpsSomosApplication>(*args)
}
