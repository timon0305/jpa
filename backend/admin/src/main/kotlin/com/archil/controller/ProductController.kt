package com.archil.controller

import com.archil.model.Product
import com.archil.repository.ProductRepository
import com.archil.restapi.ProductResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/product")
class ProductController {
    @Autowired
    private lateinit var productRepository: ProductRepository

    // Get All Products Information

    @GetMapping("")
    @ResponseBody
    fun getAllProducts(): ResponseEntity<ProductResponse> {
        val ret = productRepository.findAll()
        println(ret)
        val response = ProductResponse()
        ret.map {
            it?:return@map
            val product = com.archil.restapi.Product()
            product.cost = it.cost.toFloat()
            product.name = it.name
            product.number = it.number
            product.percent = it.percent.toFloat()
            product.price = it.price.toFloat()
            product.profit = it.profit
            product.startdate = it.startdate
            product.type = it.type
            response.products.add(product)
        }
        return ResponseEntity.ok(response)
    }

    // Get Products Information with start date and end date
    @GetMapping("/search")
    @ResponseBody
    fun searchByStartdateAndEnddate(@RequestParam("start") start: String?, @RequestParam("end") end: String?): ResponseEntity<Any> {
        val startDate = if (start.isNullOrEmpty()) "0000-00-00" else start?:"0000-00-00"
        val endDate = if (end.isNullOrEmpty()) "9999-12-31" else end?:"9999-12-31"
        val ret = productRepository.findAllByStartdateBetween(startDate, endDate)
        val response = ProductResponse()
        ret.map {
            val product = com.archil.restapi.Product()
            product.cost = it.cost.toFloat()
            product.name = it.name
            product.number = it.number
            product.percent = it.percent
            product.price = it.price.toFloat()
            product.profit = it.profit
            product.startdate = it.startdate
            product.type = it.type
            response.products.add(product)
        }
        return ResponseEntity.ok(response)
    }
}