package com.archil.components

import com.archil.exceptions.BadRequestException
import com.archil.exceptions.ForbiddenException
import com.archil.model.BaseResponse
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
    @ExceptionHandler(UsernameNotFoundException::class,  ObjectNotFoundException::class, BadRequestException::class)
    @ResponseBody
    fun handleUsernameNotFoundException(ex: Throwable)  = ResponseEntity.badRequest().body(BaseResponse(ex.message
            ?: "Bad Request"))

    @ExceptionHandler(ForbiddenException::class)
    @ResponseBody
    fun handleForbiddenException(ex:Throwable) = ResponseEntity.status(HttpStatus.FORBIDDEN).body(BaseResponse(ex.message
            ?: "Forbidden"))
}