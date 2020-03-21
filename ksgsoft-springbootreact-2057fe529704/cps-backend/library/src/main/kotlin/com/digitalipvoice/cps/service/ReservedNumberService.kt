package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.model.SomosIdRo
import com.digitalipvoice.cps.persistance.dao.ReservedNumberRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ReservedNumberService {
    @Autowired
    private lateinit var reservedNumberRepository: ReservedNumberRepository

    /**
     * Search by Somos Id
     */
    fun find(idRo:SomosIdRo?, query: TableQuery) = reservedNumberRepository.search(idRo, query)
}