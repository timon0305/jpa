package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.utils.logger
import com.opencsv.CSVParserBuilder
import com.opencsv.CSVReaderBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.io.FileReader


@Component
class CronJobs {
    @Autowired
    private lateinit var appState: AppState

    @Value("\${lrn.path}")
    private lateinit var lrnFilePath: String


    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    private val log = logger(javaClass)

    // Every day 00:00 AM
    @Scheduled(cron = "0 0 0 * * *")
    fun refreshLRN(){
        if (appState.isLrnRefreshInProgress)
        {
            log.info("LRN Refresh in progress. please wait")
            return
        }
        appState.isLrnRefreshInProgress = true

        log.info("Starting lrn refresh...")

        var wholeCount = 0
        val batchSize = 3000
        var rows = mutableListOf<String>()
        try {
            // READ as CSV file and start uploading
            val reader = CSVReaderBuilder(FileReader(lrnFilePath))
                    .withCSVParser(
                            CSVParserBuilder()
                                    .withSeparator(',')
                                    .build())
                    .build()

            for (row in reader) {
                if (row.size < 4) continue

                val did = row[0]
                val lrn = row[1]
                val ocn = row[2]
                val grtype = row[3]

                rows.add("('${did}', '${lrn}', '${ocn}', '${grtype}')")

                if (rows.size >= batchSize) {
                    wholeCount += insertBatch(rows)
                    rows.clear()
                }
            }

            if (rows.size > 0) {
                wholeCount += insertBatch(rows)
            }

        }catch(ex: Exception) {
            ex.printStackTrace()
        }finally {
            appState.isLrnRefreshInProgress = false
            log.info("Total ${wholeCount} records inserted/updated.")
        }
    }

    private fun insertBatch(rows:Iterable<String>) : Int {
        val sql = "INSERT INTO lrn_data (did, lrn, ocn, grtype) VALUES ${rows.joinToString(",")} ON DUPLICATE KEY UPDATE lrn = VALUES(did), ocn = VALUES(ocn), grtype = VALUES(grtype) "
        try {
            return jdbcTemplate.update(sql)
        }catch(ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occured while batch insert")
        }
        return 0
    }

    fun lrnCounts(): Long{
        try {
            return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM lrn_data", Long::class.java) ?: 0
        }catch(ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while fetching lrn counts")
        }
        return 0
    }
}