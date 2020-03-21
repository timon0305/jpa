package com.archil.controller

import com.archil.repository.CustomerRepository
import com.archil.util.TableQuery
import com.archil.util.TableResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/customer")
class CustomerController {
    @Autowired
    private lateinit var customerRepository: CustomerRepository

    @PostMapping("/list")
    @ResponseBody
    fun getAllProducts(@RequestBody r: TableQuery): ResponseEntity<TableResult> {
        return ResponseEntity.ok(customerRepository.searchCustomers(r))
    }

}