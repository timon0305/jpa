package com.archil.controller

import com.archil.repository.HistoryRepository
import com.archil.util.TableQuery
import com.archil.util.TableResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/history")
class HistoryController {
    @Autowired
    private lateinit var historyRepository: HistoryRepository

    @PostMapping("/list")
    @ResponseBody
    fun getAllProducts(@RequestBody r: TableQuery): ResponseEntity<TableResult> {
        return ResponseEntity.ok(historyRepository.searchHistories(r))
    }

}