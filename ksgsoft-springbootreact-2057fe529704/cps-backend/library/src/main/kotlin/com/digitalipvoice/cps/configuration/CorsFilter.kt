package com.digitalipvoice.cps.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import java.io.IOException
import javax.servlet.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
class CorsFilter: Filter {
    @Value("\${cors.allowed.origins}")
    private lateinit var allowedOrigins:String

    @Throws(IOException::class, ServletException::class)
    override fun doFilter(req: ServletRequest, res: ServletResponse, chain: FilterChain){
        val response = res as HttpServletResponse
        with(response) {
            setHeader("Access-Control-Allow-Origin", allowedOrigins)
            setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE")
            setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type")
            setHeader("Access-Control-Max-Age", "3600")
            if (org.springframework.http.HttpMethod.OPTIONS.name.equals((req as HttpServletRequest).method, true)) {
                response.status = HttpServletResponse.SC_OK
            } else {
                chain.doFilter(req, res)
            }
        }
    }

    override fun destroy() {}

    @Throws(ServletException::class)
    override fun init(p0: FilterConfig) {}
}