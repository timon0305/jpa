package com.archil.controller

import com.archil.model.BaseResponse
import com.archil.model.api.*
import com.archil.service.UserService
import jdk.management.resource.internal.ResourceNatives
import org.apache.commons.codec.binary.Base64
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.configurationprocessor.json.JSONArray
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.*
import org.springframework.http.client.ClientHttpResponse
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Controller
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.client.ResponseErrorHandler
import org.springframework.web.client.RestTemplate
import java.net.URI

/**
 * Authentication Controller
 * Implemented routes:
 * - api/v1/session/login
 * - api/v1/session/refresh
 */
@Controller
@RequestMapping("/session/")
class AuthController{

    @Autowired
    @Qualifier("CustomUserDetailsService")
    private lateinit var userDetailsService: UserDetailsService

    @Value("\${oauth2.clientid}")
    private lateinit var clientId: String

    @Value("\${oauth2.clientsecret}")
    private lateinit var clientSecret: String

    @Value("\${oauth2.server}")
    private lateinit var oauth2Endpoint: String

    @Autowired
    private lateinit var userService: UserService

    /**
     * Bridge for OAuth2 Login
     */
    @PostMapping("login")
    @ResponseBody
    fun login(@RequestBody r: LoginRequest): ResponseEntity<Any> {
        if (r.username.isEmpty() || r.password.isEmpty()){
            return ResponseEntity.badRequest().body(BaseResponse("Bad Credentials"))
        }
        val entity = oauth2AccessToken(mapOf("grant_type" to "password", "username" to r.username, "password" to r.password))
        if (entity.statusCode == HttpStatus.OK && entity.hasBody()) {
            val map = entity.body!!
            val authorities = try { userDetailsService.loadUserByUsername(r.username) } catch(ex: Exception) { null } ?.authorities?.map { it.authority }
            val response = LoginResponse().apply {
                oauthToken = map["access_token"]?.toString() ?: ""
                refreshToken = map["refresh_token"]?.toString() ?: ""
                expiresIn = map["expires_in"]?.toString()?.toLongOrNull() ?: 0L
                scope = map["scope"]?.toString() ?: ""
            }

            // Generate Profile information
            val user = userService.findUserByName(r.username)!!
            val profile = LoginProfile().apply {
                firstName = user.firstName
                lastName = user.lastName
                id = user.id
                username = user.username
            }
            return ResponseEntity.ok(response)
        }
        return ResponseEntity(entity.body, entity.statusCode)
    }

    @PostMapping("refresh")
    @ResponseBody
    fun refresh(@RequestBody r: TokenRefreshRequest): ResponseEntity<Any> {
        if (r.refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body(BaseResponse("Refresh token is required"))
        }
        val entity = oauth2AccessToken(mapOf("grant_type" to "refresh_token", "refresh_token" to r.refreshToken))
        if (entity.statusCode == HttpStatus.OK && entity.hasBody()) {
            val map = entity.body!!
            val response = TokenRefreshResponse().apply {
                oauthToken = map["access_token"]?.toString() ?: ""
                refreshToken = map["refresh_token"]?.toString() ?: ""
                expiresIn = map["expires_in"]?.toString()?.toLongOrNull() ?: 0L
                scope = map["scope"]?.toString() ?: ""
            }
            return ResponseEntity.ok(response)
        }
        return ResponseEntity(entity.body, entity.statusCode);
    }

    /**
     *  Connect to oauth2 server with data (username & password or refresh token)
     */
    private fun oauth2AccessToken(map:Map<String, String>): ResponseEntity<Map<String, Any>>{
        val restTemplate = RestTemplate()
        // Assign error handler
        restTemplate.errorHandler = object: ResponseErrorHandler {
            override fun hasError(resp: ClientHttpResponse): Boolean {
                return resp.statusCode.series() == HttpStatus.Series.CLIENT_ERROR || resp.statusCode.series() == HttpStatus.Series.SERVER_ERROR
            }
            override fun handleError(resp: ClientHttpResponse) {}
        }
        val credentials = "$clientId:$clientSecret"
        val encodedCredentials = Base64.encodeBase64String(credentials.toByteArray())

        val headers = HttpHeaders()
        headers.accept = mutableListOf(MediaType.APPLICATION_JSON)
        headers.contentType = MediaType.APPLICATION_FORM_URLENCODED
        headers.add("Authorization", "Basic $encodedCredentials")

        val url = "$oauth2Endpoint/oauth/token"
        val multivalueMap = LinkedMultiValueMap<String, String>(map.mapValues { entry ->  listOf(entry.value) })
        val requestEntity = RequestEntity(multivalueMap, headers, HttpMethod.POST, URI.create(url))

        return restTemplate.exchange(requestEntity, object: ParameterizedTypeReference<Map<String, Any>>() {})
    }
}