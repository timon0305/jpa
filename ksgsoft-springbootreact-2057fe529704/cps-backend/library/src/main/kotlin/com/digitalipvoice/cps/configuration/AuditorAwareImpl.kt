package com.digitalipvoice.cps.configuration

import com.digitalipvoice.cps.model.AppUser
import org.springframework.data.domain.AuditorAware
import org.springframework.security.core.context.SecurityContextHolder
import java.util.*

class AuditorAwareImpl:AuditorAware<Long> {
    override fun getCurrentAuditor() = Optional.ofNullable((SecurityContextHolder.getContext()?.authentication?.principal as? AppUser)?.id)
}