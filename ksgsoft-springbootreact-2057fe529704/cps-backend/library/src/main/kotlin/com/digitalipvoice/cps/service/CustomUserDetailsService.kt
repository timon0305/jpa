package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.dao.UserRepository
import com.digitalipvoice.cps.persistance.model.Role
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Qualifier("CustomUserDetailsService")
@Transactional
class CustomUserDetailsService: UserDetailsService {
    @Autowired
    private lateinit var userRepository: UserRepository

    /**
     * Find user by user name and build user details
     */
    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(username: String): UserDetails {
        val user = userRepository.findByUsername(username) ?: throw UsernameNotFoundException("No user found with name: $username")
        return AppUser(user.id, user.username, user.password, user.isActive, true, true, true, getAuthorities(user.roles))
    }

    fun getAuthorities(roles:Set<Role>): Collection<GrantedAuthority>  {
        val authorities = mutableListOf<GrantedAuthority>()
        for (role in roles) {
            authorities.add(SimpleGrantedAuthority(role.role))
            authorities.addAll(role.privileges.map{SimpleGrantedAuthority(it.name)})
        }
        return authorities
    }

    @Bean
    fun passwordEncoder(): BCryptPasswordEncoder {
        return BCryptPasswordEncoder()
    }
}