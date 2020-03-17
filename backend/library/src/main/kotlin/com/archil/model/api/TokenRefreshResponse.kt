package com.archil.model.api

class TokenRefreshResponse{
    var oauthToken = ""
    var refreshToken = ""
    var expiresIn = 0L
    var scope = ""
    var privileges = arrayListOf<String>()
}