package com.digitalipvoice.cps.configuration

import com.digitalipvoice.cps.model.AppUser
import org.springframework.core.MethodParameter
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer

class AppUserArgumentResolver : HandlerMethodArgumentResolver {
    override fun supportsParameter(param: MethodParameter): Boolean {
        return param.parameterType == AppUser::class.java
    }

    override fun resolveArgument(
            methodParameter: MethodParameter,
            modelAndViewContainer: ModelAndViewContainer?,
            request: NativeWebRequest,
            webDataBinderFactory: WebDataBinderFactory?): Any {
        return SecurityContextHolder.getContext().authentication.principal as? AppUser
                ?: AppUser(-1, "Anonymous", "Anonymous", false, authorities = listOf())
    }
}