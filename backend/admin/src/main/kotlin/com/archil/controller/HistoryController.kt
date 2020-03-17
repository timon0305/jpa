package com.archil.controller

import com.archil.repository.HistoryRepository
import com.archil.restapi.HistoryResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/history")
class HistoryController {
    @Autowired
    private lateinit var historyRepository: HistoryRepository

    @GetMapping("")
    @ResponseBody
    fun getAllHistories(): ResponseEntity<HistoryResponse> {
        val ret = historyRepository.findAll()
        println(ret)
        val response = HistoryResponse()
        ret.map {
            it?:return@map
            val history = com.archil.restapi.History()
            history.name = it.name
            history.type  = it.type
            history.saledate = it.saledate
            history.createdate = it.createdate
            history.number = it.number
            response.histories.add(history)
        }
        return ResponseEntity.ok(response)
    }

    @GetMapping("/search")
    @ResponseBody
    fun searchByStartdateAndEnddate(@RequestParam("start") start: String?, @RequestParam("end") end: String?): ResponseEntity<Any> {
        val startDate = if (start.isNullOrEmpty()) "0000-00-00" else start?:"0000-00-00"
        val endDate = if (end.isNullOrEmpty()) "9999-12-31" else end?:"9999-12-31"
        val ret = historyRepository.findAllByCreatedateBetween(startDate, endDate)
        val response = HistoryResponse()
        ret.map {
            val history = com.archil.restapi.History()
            history.name = it.name
            history.type  = it.type
            history.saledate = it.saledate
            history.createdate = it.createdate
            history.number = it.number
            response.histories.add(history)
        }
        return ResponseEntity.ok(response)
    }
}