package com.archil.controller

import com.archil.repository.ProductRepository
import com.archil.util.TableQuery
import com.archil.util.TableResult
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/product")
class ProductController {
    @Autowired
    private lateinit var productRepository: ProductRepository

    @PostMapping("/list")
    @ResponseBody
    fun getAllProducts(@RequestBody r: TableQuery): ResponseEntity<TableResult> {
        return ResponseEntity.ok(productRepository.searchProducts(r))
    }
}