package com.digitalipvoice.cps.configuration

import org.springframework.security.oauth2.provider.endpoint.FrameworkEndpoint
import org.springframework.security.oauth2.provider.token.ConsumerTokenServices
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.ResponseBody
import javax.annotation.Resource
import javax.servlet.http.HttpServletRequest

@FrameworkEndpoint
class RevokeTokenEndpoint {
    @Resource(name= "tokenServices")
    private lateinit var tokenServices: ConsumerTokenServices

    @RequestMapping(method = [RequestMethod.DELETE], value="/oauth/token")
    @ResponseBody
    fun revokeToken(request: HttpServletRequest) {
        val authorization = request.getHeader("Authorization")
        if (authorization != null && authorization.contains("Bearer")) {
            val tokenId = authorization.substring("Bearer".length + 1)
            tokenServices.revokeToken(tokenId)
        }
    }
}