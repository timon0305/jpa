package com.archil.components

import com.archil.persistance.dao.PrivilegeRepository
import com.archil.persistance.dao.RoleRepository
import com.archil.persistance.dao.UserRepository
import com.archil.persistance.model.Privilege
import com.archil.persistance.model.Role
import com.archil.persistance.model.User
import com.archil.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.context.ApplicationListener
import org.springframework.core.env.Environment
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class Bootstrap : ApplicationListener<ApplicationStartedEvent> {
    private val log = logger(javaClass)

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var roleRepository: RoleRepository

    @Autowired
    private lateinit var privilegeRepository: PrivilegeRepository

    @Autowired
    private lateinit var environment: Environment

    @Autowired
    private lateinit var passwordEncoder: BCryptPasswordEncoder

    override fun onApplicationEvent(evt: ApplicationStartedEvent) {
        log.info("Context refreshed")

        //if (environment.activeProfiles.contains("dev")){
        // seed super admin & roles
        seedData()
        //}
    }

    private fun seedData() {
        // 1. Seed Privileges
        val privDashbaord = createPrivilegeIfNotFound(Privilege.Dashboard)
        val allPrivileges = arrayOf(privDashbaord)
        // Save
        allPrivileges.forEach { privilegeRepository.save(it) }

        // 2. Roles
        val roleSuperAdmin = createRoleIfNotFound(Role.SuperAdminRoleName, "Super Admin User")
        roleSuperAdmin.privileges = hashSetOf(*allPrivileges)
        roleRepository.save(roleSuperAdmin)

        // Add super admin user (sadmin/sadmin)
        val sadmin = User.SuperAdminUsername
        val user = userRepository.findByUsername(sadmin) ?: (User(sadmin, passwordEncoder.encode(sadmin)))
        user.roles = hashSetOf(roleSuperAdmin)
        userRepository.save(user)



    }

    @Transactional
    fun createPrivilegeIfNotFound(name: String) = privilegeRepository.findByName(name) ?: Privilege(name)

    @Transactional
    fun createRoleIfNotFound(role: String, description: String) = roleRepository.findByRole(role)
            ?: Role(role, description)
}