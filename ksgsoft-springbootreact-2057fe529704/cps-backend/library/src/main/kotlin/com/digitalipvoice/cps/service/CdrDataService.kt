package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.client.admin.models.TableResult
import com.digitalipvoice.cps.utils.logger
import com.digitalipvoice.cps.utils.nativeTableQuery
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import java.lang.reflect.Executable
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@Service
class CdrDataService {
    private val dataTablePrefix = "cdr_data"
    private val lnReport1Prefix = "lata_npanxx_report_1"
    @PersistenceContext
    private lateinit var em: EntityManager

    val log = logger(javaClass)

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    fun createTable(userId: Long) {
        val sql1 = "CREATE TABLE IF NOT EXISTS `${dataTablePrefix}_$userId` (row_ani VARCHAR(50), cost FLOAT, duration FLOAT, lrn VARCHAR(50), rate FLOAT, INDEX(row_ani));"
        try {
            jdbcTemplate.execute(sql1)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while CDR table create")
        }
        val sql2 = "CREATE TABLE IF NOT EXISTS `${lnReport1Prefix}_$userId` (lata VARCHAR(255), state VARCHAR(255), npa_nxx VARCHAR(20), calls INT(11), total_duration FLOAT(11), average_cost FLOAT, total_cost FLOAT, INDEX(npa_nxx));"
        try {
            jdbcTemplate.execute(sql2)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occured while LataNpanxxReport table create")
        }
        val sql3 = "CREATE TABLE IF NOT EXISTS `${dataTablePrefix}_${userId}_groupby_ani` (row_ani VARCHAR(50), lrn VARCHAR(50), calls INT(11), total_duration FLOAT, total_cost FLOAT, average_cost FLOAT, INDEX(row_ani))"
        try {
            jdbcTemplate.execute(sql3)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while lata_npanxx_report_1_${userId}_buff1 table create")
        }
        val sql4 = "CREATE TABLE IF NOT EXISTS `${dataTablePrefix}_${userId}_npanxx` (npa_nxx VARCHAR(20), calls INT(11), total_duration FLOAT, total_cost FLOAT, average_cost FLOAT, INDEX(npa_nxx))"
        try {
            jdbcTemplate.execute(sql4)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while lata_npanxx_report_1_${userId}_buff2 table create")
        }
    }

    // For Lata Npanxx Report

    fun generateLataNpanxxReport1(userId: Long): Int {
        val sql = """
            INSERT INTO ${lnReport1Prefix}_$userId (lata, state, npa_nxx, calls, total_duration, total_cost, average_cost)
            SELECT
                lerg.lata,
                lerg.state,
                temp.*
            FROM (SELECT DISTINCT npa_nxx, SUM(cdr.calls) as calls, SUM(cdr.total_duration) as total_duration, SUM(cdr.total_cost) as total_cost, SUM(cdr.total_cost)/SUM(cdr.calls) as average_cost
                FROM ${dataTablePrefix}_${userId}_npanxx cdr
                GROUP BY cdr.npa_nxx) temp
            INNER JOIN lerg_import lerg ON lerg.npa_nxx = temp.npa_nxx
        """.trimIndent()

        try {
            return jdbcTemplate.update(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while LataNpanxxReport1 generate")
        }
        return 0
    }

    fun emptyLataNpanxxReport1(userId: Long = 0L) {
        jdbcTemplate.execute("DELETE FROM `${lnReport1Prefix}_$userId`")
    }

    fun searchLataNpanxxReport1(query: TableQuery, userId: Long): TableResult {
        if (query.sorts?.isEmpty() != false) {
            // Add sort by npa_nxx by default if not exist
            query.addSortsItem(SortOption().column("npa_nxx"))
        }

        val cols = arrayOf("u.lata", "u.state", "u.npa_nxx", "u.calls", "u.total_duration", "u.average_cost", "u.total_cost")
        val table = " ${lnReport1Prefix}_$userId u "
        return em.nativeTableQuery(query, table, * cols)
    }

    // For CDR data

    fun deleteAllByUserId(userId: Long = 0L) {
        jdbcTemplate.execute("DELETE FROM `${dataTablePrefix}_$userId`")
    }

    fun insertBatch(values: Iterable<String>, userId: Long): Int {
        val sql = "INSERT INTO `${dataTablePrefix}_$userId` (row_ani, cost, duration, lrn, rate, npa_nxx) VALUES ${values.joinToString(",")}"
        try {
            return jdbcTemplate.update(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while CDR batch insert")
        }
        return 0
    }

    fun insertBatchImproved(values: Iterable<String>, userId: Long): Int {
        val sql = "INSERT INTO `${dataTablePrefix}_$userId` (row_ani, cost, duration, lrn, rate) VALUES ${values.joinToString(",")}"
        try {
            return jdbcTemplate.update(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while CDR batch insert")
        }
        return 0
    }

    fun combineWithLrn(userId: Long) {
        var sql = "TRUNCATE `${dataTablePrefix}_${userId}_groupby_ani`;"
        try {
            jdbcTemplate.execute(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while truncate ${dataTablePrefix}_${userId}_groupby_ani table")
        }
        sql = """
            INSERT INTO `${dataTablePrefix}_${userId}_groupby_ani` (row_ani, lrn, calls, total_duration, total_cost, average_cost)
            SELECT DISTINCT
                row_ani,
                lrn,
                IF(SUM(duration)>0,COUNT(duration),0),
                SUM(duration),
                SUM(cost),
                AVG(cost)
            FROM `${dataTablePrefix}_$userId`
            GROUP BY row_ani
        """.trimIndent()
        try {
            jdbcTemplate.execute(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while Group by row_ani")
        }
        sql = "TRUNCATE `${dataTablePrefix}_${userId}_npanxx`;"
        try {
            jdbcTemplate.execute(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while truncate ${dataTablePrefix}_${userId}_npanxx table")
        }
        sql = """
            INSERT INTO `${dataTablePrefix}_${userId}_npanxx` (npa_nxx, calls, total_duration, total_cost, average_cost)
            SELECT
                IF(LENGTH(buff1.lrn)>5,SUBSTRING(buff1.lrn,1,6),SUBSTRING(lrn.lrn,1,6)),
                buff1.calls,
                buff1.total_duration,
                buff1.total_cost,
                buff1.average_cost
            FROM `${dataTablePrefix}_${userId}_groupby_ani` buff1
            LEFT JOIN lrn_data lrn ON buff1.row_ani = lrn.did
        """.trimIndent()
        try {
            jdbcTemplate.execute(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while fill NPANXX from lrn data")
        }
    }

    fun searchCDR(query: TableQuery, userId: Long): TableResult {
        // columns to select
        val cols = arrayOf("u.row_ani", "u.rate", "u.cost", "u.duration", "u.lrn")
        val table = " `${dataTablePrefix}_$userId` u "

        return em.nativeTableQuery(query, table, * cols)
    }
}