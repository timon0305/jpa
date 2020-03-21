package com.digitalipvoice.cps

import com.digitalipvoice.cps.configuration.FileStorageProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableConfigurationProperties(FileStorageProperties::class)
@EnableScheduling
class CpsAdminApplication

fun main(args: Array<String>) {
    runApplication<CpsAdminApplication>(*args)
}


