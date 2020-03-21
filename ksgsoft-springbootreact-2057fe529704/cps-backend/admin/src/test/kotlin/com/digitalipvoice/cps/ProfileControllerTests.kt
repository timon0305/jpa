package com.digitalipvoice.cps

import com.digitalipvoice.cps.client.admin.models.LoginRequest
import com.digitalipvoice.cps.controller.AuthController
import com.digitalipvoice.cps.controller.ProfileController
import org.codehaus.jackson.map.ObjectMapper
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.context.junit4.SpringRunner
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status


@RunWith(SpringRunner::class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(
        locations = ["classpath:application-test.properties"]
)
class ProfileControllerTests {
    @Autowired
    private lateinit var mvc:MockMvc

    @Autowired
    private lateinit var authController:AuthController

    @Autowired
    private lateinit var profileController: ProfileController

    val objectMapper = ObjectMapper()

    @Test
    fun loginTest(){
        mvc.perform(
                post("/session/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(
                                LoginRequest().username("sadmin").password("sadmin")))
                        )
                .andExpect(status().isOk)
                .andExpect{r ->
                    val content = r.response.contentAsString
                    assert(content.contains("\"profile:\""))
                    System.out.println(content)
                }
    }
}