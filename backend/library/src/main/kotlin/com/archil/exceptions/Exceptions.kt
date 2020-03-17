package com.archil.exceptions

class ForbiddenException(message:String = "Forbidden"): RuntimeException(message)

class BadRequestException(message:String = "Bad Request"): RuntimeException(message)