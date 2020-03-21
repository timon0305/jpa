package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.exceptions.IdRoNotAssignedException
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.SomosIdRo
import com.digitalipvoice.cps.persistance.dao.UserIDRORepository
import com.digitalipvoice.cps.utils.findByIdKt
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.MethodParameter
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer

@Component
class IDROArgumentResolver : HandlerMethodArgumentResolver {
    @Autowired
    private lateinit var repository: UserIDRORepository

    override fun supportsParameter(param: MethodParameter):Boolean {
        return param.parameterType == SomosIdRo::class.java
    }

    override fun resolveArgument(
            methodParameter: MethodParameter,
            modelAndViewContainer: ModelAndViewContainer?,
            request: NativeWebRequest,
            webDataBinderFactory: WebDataBinderFactory?): Any {
        val user= SecurityContextHolder.getContext().authentication.principal as? AppUser ?: throw UsernameNotFoundException("No user found")
        val idRo = repository.findByIdKt(user.id) ?: throw IdRoNotAssignedException(user.username)

        val somosIdRo = SomosIdRo(user.id, user.username, idRo.somosId, idRo.ro)

        return if (somosIdRo.isValid) somosIdRo else throw IdRoNotAssignedException(user.username)
    }
}

/// Do not delete code below, for further reference!!!
/*
@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.VALUE_PARAMETER)
annotation class SmsId

@Retention(AnnotationRetention.RUNTIME)
@Target(AnnotationTarget.VALUE_PARAMETER)
annotation class RO

@Component
class SmsIdArgumentResolver : HandlerMethodArgumentResolver{
    override fun supportsParameter(param: MethodParameter): Boolean {
        return param.getParameterAnnotation(SmsId::class.java) != null
    }

    override fun resolveArgument(
            methodParameter: MethodParameter,
            modelAndViewContainer: ModelAndViewContainer?,
            request: NativeWebRequest,
            webDataBinderFactory: WebDataBinderFactory?): Any {
        return "XQG01000"
    }
}

@Component
class ROArgumentResolver: HandlerMethodArgumentResolver {
    override fun supportsParameter(param: MethodParameter): Boolean {
        return param.getParameterAnnotation(RO::class.java) != null
    }

    override fun resolveArgument(
            methodParameter: MethodParameter,
            modelAndViewContainer: ModelAndViewContainer?,
            request: NativeWebRequest,
            webDataBinderFactory: WebDataBinderFactory?): Any {
        return "XQG01"
    }
}*/
