package com.archil.model.api

class LoginResponse  {
    var oauthToken = ""
    var refreshToken = ""
    var expiresIn = 0L
    var scope = ""
    var privileges = arrayListOf<String>()
    var profile = LoginProfile()
}

class LoginProfile {
    var firstName = ""
    var lastName = ""
    var id = 0L
    var username = ""
}