package com.digitalipvoice.cps

import com.digitalipvoice.cps.service.LcrReportService
import com.digitalipvoice.cps.utils.logger
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest
@TestPropertySource(
        locations = ["classpath:application-ide.properties"]
)
class LcrReportServiceTest {
    private val log = logger(javaClass)
    @Autowired
    private lateinit var lcrReportService: LcrReportService

    @Test
    fun testLcrReportTableQuery(){
        val sqlArray = lcrReportService.createRateDeckMergeTable(1, listOf(2307132, 2307134, 2307136), listOf("LV3", "ITQ", "VRZ"))
        System.out.println(sqlArray)
    }
}