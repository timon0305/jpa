package com.digitalipvoice.cps.configuration

import com.digitalipvoice.cps.components.JPAJacksonTupleSerializer
import com.fasterxml.jackson.databind.module.SimpleModule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import javax.persistence.Tuple

@Configuration
class MvcConfigureAdapter: WebMvcConfigurer {
    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        with(resolvers) {
            add(userArgumentResolver())
            add(appUserArgumentResolver())
        }
    }

    @Bean
    fun userArgumentResolver() = UserArgumentResolver()

    @Bean
    fun appUserArgumentResolver() = AppUserArgumentResolver()
    /**
     * This definition add JPAJacksonTupleSerializer to the auto-configured Jackson2ObjectMapperBuilder
     * Check [https://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#howto-customize-the-jackson-objectmapper]
     * Any beans of type `com.fasterxml.jackson.databind.Module` are automatically registered with the auto-configured `Jackson2ObjectMapperBuilder` and are applied to any ObjectMapper instances that it creates. This provides a global mechanism for contributing custom modules when you add new features to your application.
     */
    @Bean
    fun jacksonJPATupleSerializationModule() = SimpleModule().apply {
        addSerializer(Tuple::class.java, JPAJacksonTupleSerializer())
    }
}
