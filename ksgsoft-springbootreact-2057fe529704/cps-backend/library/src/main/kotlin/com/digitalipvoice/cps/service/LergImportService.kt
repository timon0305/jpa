package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.persistance.dao.LergImportRepository
import com.digitalipvoice.cps.persistance.model.LergImport
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class LergImportService {
    @Autowired
    private lateinit var repository: LergImportRepository

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    private var dataTable = "lerg_import"
    private val log = logger(javaClass)

    fun deleteAll() {
        repository.deleteAllInBatch()
        repository.flush()
    }

    fun saveLergs(arr: Iterable<LergImport>) {
        repository.saveAll(arr)
        repository.flush()
    }

    fun searchLerg(r: TableQuery) = repository.searchLerg(r)

    fun insertBatch(values: Iterable<String>): Int {
        val sql = "INSERT INTO $dataTable (npa_nxx, npa, nxx, state, lata, carrier, acna, cic, acna_cic) VALUES ${values.joinToString(",")} ON DUPLICATE KEY UPDATE npa = VALUES(npa), nxx = VALUES(nxx), state = VALUES(state), lata = VALUES(lata), carrier = VALUES(carrier), acna = VALUES(acna), cic = VALUES(cic), acna_cic = VALUES(acna_cic);"

        try {
            return jdbcTemplate.update(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while Rate Deck batch insert")
        }
        return 0
    }

}