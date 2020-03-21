package com.digitalipvoice.cps.configuration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

// Spring Web Security Configuration
@Configuration
class WebSecurityConfig: WebSecurityConfigurerAdapter() {
    @Autowired
    private lateinit var passwordEncoder: BCryptPasswordEncoder

    @Autowired
    @Qualifier("CustomUserDetailsService")
    private lateinit var userDetailsService:UserDetailsService

    override fun configure(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder)
    }

    /**
     * Define bean named "authenticationManagerBean"
     */
    @Throws(Exception::class)
    @Bean
    override fun authenticationManagerBean(): AuthenticationManager = super.authenticationManagerBean()

    /**
     * Define url security rules for this oauth server
     */
    @Throws(Exception::class)
    override fun configure(http:HttpSecurity) {
        http.authorizeRequests()
                .antMatchers("/login").permitAll()
                .antMatchers("/oauth/token/revokeById/**").permitAll()
                .antMatchers("/tokens/**").permitAll()
                .anyRequest().authenticated()
                .and().formLogin().permitAll()
                .and().csrf().disable()
    }
}