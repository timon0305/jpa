package com.digitalipvoice.cps.model

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.User

/**
 * Enhanced User Details from Spring framework to save user id
 */
class AppUser(
        val id: Long,
        username: String,
        password: String,
        enabled:Boolean = true,
        accountNonExpired:Boolean = true,
        credentialsNonExpired:Boolean = true,
        accountNonLocked:Boolean = true,
        authorities: Collection<GrantedAuthority>
) : User(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities) {
    /**
     * Check whether this is super admin
     */
    val isSuperAdmin:Boolean
        get() = username == com.digitalipvoice.cps.persistance.model.User.SuperAdminUsername

    /**
     * return non super-user id.
     * Return 0 if this is super user, else return id.
     */
    val nonSuperUserId: Long
        get() = if (isSuperAdmin) 0 else id

    /**
     * Check if user has authority for privilege
     */
    fun hasPrivilege(privilege:String) = authorities.find { it.authority == privilege } != null
}