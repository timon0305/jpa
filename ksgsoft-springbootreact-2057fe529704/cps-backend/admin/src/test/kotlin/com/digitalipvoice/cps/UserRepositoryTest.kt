package com.digitalipvoice.cps

import com.digitalipvoice.cps.client.admin.models.FilterOption
import com.digitalipvoice.cps.client.admin.models.SortOption
import com.digitalipvoice.cps.client.admin.models.TableQuery
import com.digitalipvoice.cps.components.JPAJacksonTupleSerializer
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.dao.UserRepository
import com.digitalipvoice.cps.persistance.model.User
import com.digitalipvoice.cps.utils.logger
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.module.SimpleModule
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.junit4.SpringRunner
import javax.persistence.Tuple

@RunWith(SpringRunner::class)
@SpringBootTest
@TestPropertySource(
        locations = ["classpath:application-test.properties"]
)
class UserRepositoryTest {
    private val log = logger(javaClass)
    @Autowired
    private lateinit var userRepository:UserRepository

    @Test
    fun testFindUsersTable(){
        val query = TableQuery().apply {
            page = 0
            pageSize = 10
            filters = listOf(FilterOption().column("username").contains("admin"))
            sorts = listOf(SortOption().column("username").direction(SortOption.DirectionEnum.ASC),
                    SortOption().column("role"))
        }
        val user = userRepository.findByUsername(User.SuperAdminUsername)
        val appUser = AppUser(user!!.id, user!!.username, user!!.password, authorities = listOf())
        val result = userRepository.findUsers(appUser, query)

        val mapper  = ObjectMapper()
        val module = SimpleModule().apply {
            addSerializer(Tuple::class.java, JPAJacksonTupleSerializer())
        }
        mapper.registerModule(module)
        val json = mapper.writeValueAsString(result)
        log.debug("Result:", json)
    }
}