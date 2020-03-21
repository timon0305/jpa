package com.digitalipvoice.cps.configuration

import com.digitalipvoice.cps.persistance.model.User
import com.digitalipvoice.cps.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.MethodParameter
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer

class UserArgumentResolver: HandlerMethodArgumentResolver {

    @Autowired
    private lateinit var userService:UserService

    override fun supportsParameter(param: MethodParameter):Boolean {
        return param.parameterType == User::class.java
    }

    override fun resolveArgument(
            methodParameter: MethodParameter,
            modelAndViewContainer: ModelAndViewContainer?,
            request: NativeWebRequest,
            webDataBinderFactory: WebDataBinderFactory?): Any {
        val principal = SecurityContextHolder.getContext().authentication.principal as? UserDetails ?: throw UsernameNotFoundException("No user found")
        return userService.findUserByName(principal.username) ?: throw UsernameNotFoundException("No user found")
    }
}