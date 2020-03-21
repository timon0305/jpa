package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.RoleDTO
import com.digitalipvoice.cps.model.toDTO
import com.digitalipvoice.cps.persistance.dao.PrivilegeRepository
import com.digitalipvoice.cps.persistance.dao.RoleRepository
import com.digitalipvoice.cps.persistance.model.Role
import com.digitalipvoice.cps.utils.findByIdKt
import com.digitalipvoice.cps.utils.logger
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class RoleService {
    val log = logger(javaClass)

    @Autowired
    private lateinit var roleRepository: RoleRepository

    @Autowired
    private lateinit var privilegeRepository: PrivilegeRepository

    /**
     * Find All Roles
     */
    fun findAllRoles() = roleRepository.findAll(Sort(Sort.Direction.DESC, "role")).map(Role::toDTO)

    // find role by id
    fun findRole(id: Long) = roleRepository.findByIdKt(id)

    /**
     * Add New Role
     */
    fun addNewRole(dto: RoleDTO): Boolean {
        if (dto.name?.isEmpty() == true) return false
        var role = roleRepository.findByRole(dto.name)
        if (role != null)
            return false

        role = Role()
        return updateRole(role, dto)
    }

    fun updateRole(role: Role, dto: RoleDTO): Boolean {
        role.role = dto.name
        role.roleDescription = dto.description
        val privileges = dto.privileges.map {
            privilegeRepository.findByName(it) ?: return false
        }

        role.privileges = HashSet(privileges)
        roleRepository.save(role)
        return true
    }

    /**
     * Delete Role
     */
    fun deleteRole(role: Role): Boolean {
        if (role.users.isNotEmpty()) return false
        roleRepository.delete(role)
        return true
    }

    /**
     * Find roles created by user of user id
     */
    fun findRolesCreatedBy(userId: Long) = roleRepository.findByCreatedBy(userId)
}