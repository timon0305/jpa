package com.digitalipvoice.cps.exceptions

class CreateUserException(message:String): RuntimeException(message)

class IdRoNotAssignedException(username:String): RuntimeException("Somos ID and RO not found for `$username`")

class ForbiddenException(message:String = "Forbidden"): RuntimeException(message)

class BadRequestException(message:String = "Bad Request"): RuntimeException(message)