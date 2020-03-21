package com.digitalipvoice.cps.configuration

import org.apache.commons.lang3.RandomStringUtils.randomAlphabetic
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken
import org.springframework.security.oauth2.common.OAuth2AccessToken
import org.springframework.security.oauth2.provider.OAuth2Authentication
import org.springframework.security.oauth2.provider.token.TokenEnhancer

class CustomTokenEnhancer: TokenEnhancer {
    // Add extra field "organization" to our access token
    override fun enhance(accessToken: OAuth2AccessToken, authentication: OAuth2Authentication): OAuth2AccessToken {
        (accessToken as DefaultOAuth2AccessToken).additionalInformation = mutableMapOf<String, Any>("organization" to authentication.name + randomAlphabetic(4))
        return accessToken
    }
}