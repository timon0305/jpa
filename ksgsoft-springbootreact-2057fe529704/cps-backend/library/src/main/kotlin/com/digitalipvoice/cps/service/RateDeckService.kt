package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.persistance.dao.RateDeckDataRepository
import com.digitalipvoice.cps.persistance.dao.RateDeckRepository
import com.digitalipvoice.cps.persistance.model.RateDeck
import com.digitalipvoice.cps.utils.findByIdKt
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service


@Service
class RateDeckService {
    private val dataTable = "rate_deck_data"
    private val listTable = "rate_deck"

    private val log = logger(javaClass)

    @Autowired
    private lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    private lateinit var rateDeckRepository: RateDeckRepository

    @Autowired
    private lateinit var rateDeckDataRepository: RateDeckDataRepository

    fun deleteRateDeck(rateDeckItem: RateDeck): Boolean {
        // delete data
        val ret = deleteRateDeckDataById(rateDeckItem.id)
        rateDeckItem.isDeleted = true
        // delete list
        rateDeckRepository.save(rateDeckItem)
        return ret > 0
    }

    // for RateDeck List
    fun getRateDeckByUserId(userId: Long): List<RateDeck> {
        return rateDeckRepository.findByUserIdAndIsDeletedFalse(userId)
    }


    fun searchRateDeckData(query: TableQuery) = rateDeckDataRepository.searchRateDeckData(query)


    // For RateDeck data
    fun deleteRateDeckDataById(rateDeckId: Long): Int {
        val sql = "DELETE FROM ${dataTable} WHERE rate_deck_id = ${rateDeckId};"
        try {
            return jdbcTemplate.update(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while delete Rate Decks By Id")
        }
        return 0
    }

    fun renameRateDeckItemById(rateDeckId: Long, newName: String): Int {
        // rename only list item
        val sql = "UPDATE $listTable l SET l.name = '$newName' WHERE l.id = $rateDeckId;"
        try {
            return jdbcTemplate.update(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while rename rate deck")
        }
        return 0
    }

    fun insertBatch(values: Iterable<String>): Int {
        val sql = "INSERT INTO $dataTable (npa_nxx, rate_deck_id, eff_date, increment_duration, init_duration, inter_rate, intra_rate, lata, npa, nxx, ocn) VALUES ${values.joinToString(",")} ON DUPLICATE KEY UPDATE eff_date = VALUES(eff_date), increment_duration = VALUES(increment_duration), init_duration = VALUES(init_duration), inter_rate = VALUES(inter_rate), intra_rate = VALUES(intra_rate), lata = VALUES(lata), npa = VALUES(npa), nxx = VALUES(nxx), ocn = VALUES(ocn);"
        try {
            return jdbcTemplate.update(sql)
        } catch (ex: Exception) {
            ex.printStackTrace()
            log.error("Exception occurred while Rate Deck batch insert")
        }
        return 0
    }


    fun createRateDeckItemIfNotFound(name: String, carrierName: String, userId: Long) = rateDeckRepository.findByUserIdAndNameAndCarrierAndIsDeletedFalse(userId, name, carrierName)
            ?: RateDeck(name, carrierName, userId)

    fun saveRateDeckItem(rateDeck: RateDeck) = rateDeckRepository.save(rateDeck)

    fun findRateDeckItemByUserIdAndRateName(userId: Long, rateName: String) = rateDeckRepository.findByUserIdAndNameAndIsDeletedFalse(userId, rateName)

    fun findRateDeckItemById(id: Long) = rateDeckRepository.findByIdKt(id)
}