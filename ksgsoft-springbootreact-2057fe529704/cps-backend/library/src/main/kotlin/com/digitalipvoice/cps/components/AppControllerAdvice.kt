package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.exceptions.BadRequestException
import com.digitalipvoice.cps.exceptions.CreateUserException
import com.digitalipvoice.cps.exceptions.ForbiddenException
import com.digitalipvoice.cps.exceptions.IdRoNotAssignedException
import com.digitalipvoice.cps.model.BaseResponse
import org.hibernate.ObjectNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody

/**
 * Controller Advice that sends
 */
@ControllerAdvice
class AppControllerAdvice {
    @ExceptionHandler(UsernameNotFoundException::class, CreateUserException::class, ObjectNotFoundException::class, IdRoNotAssignedException::class, BadRequestException::class)
    @ResponseBody
    fun handleUsernameNotFoundException(ex: Throwable)  = ResponseEntity.badRequest().body(BaseResponse(ex.message ?: "Bad Request"))

    @ExceptionHandler(ForbiddenException::class)
    @ResponseBody
    fun handleForbiddenException(ex:Throwable) = ResponseEntity.status(HttpStatus.FORBIDDEN).body(BaseResponse(ex.message ?: "Forbidden"))
}