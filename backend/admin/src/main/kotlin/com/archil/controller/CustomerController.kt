package com.archil.controller

import com.archil.repository.CustomerRepository
import com.archil.restapi.CustomerResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/customer")
class CustomerController {
    @Autowired
    private lateinit var customerRepository: CustomerRepository

    @GetMapping("")
    @ResponseBody
    fun getAllCustomers(): ResponseEntity<CustomerResponse> {
        val ret = customerRepository.findAll()
        println(ret)
        val response = CustomerResponse()
        ret.map {
            it?:return@map
            val customer = com.archil.restapi.Customer()
            customer.name = it.name
            customer.address = it.address
            customer.email = it.email
            customer.createdate = it.createdate
            customer.phone_number = it.phone_number
            response.customers.add(customer)
        }
        return ResponseEntity.ok(response)
    }

    @GetMapping("/search")
    @ResponseBody
    fun searchByStartdateAndEnddate(@RequestParam("start") start: String?, @RequestParam("end") end: String?): ResponseEntity<Any> {
        val startDate = if (start.isNullOrEmpty()) "0000-00-00" else start?:"0000-00-00"
        val endDate = if (end.isNullOrEmpty()) "9999-12-31" else end?:"9999-12-31"
        val ret = customerRepository.findAllByCreatedateBetween(startDate, endDate)
        val response = CustomerResponse()
        ret.map {
            val customer = com.archil.restapi.Customer()
            customer.name = it.name
            customer.address = it.address
            customer.email = it.email
            customer.createdate = it.createdate
            customer.phone_number = it.phone_number
            response.customers.add(customer)
        }
        return ResponseEntity.ok(response)
    }
}