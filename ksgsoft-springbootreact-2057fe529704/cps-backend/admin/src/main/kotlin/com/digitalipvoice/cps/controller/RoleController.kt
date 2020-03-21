package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.RoleDTO
import com.digitalipvoice.cps.exceptions.BadRequestException
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.BaseResponse
import com.digitalipvoice.cps.model.toDTO
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.persistance.model.Role
import com.digitalipvoice.cps.service.RoleService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/roles")
class RoleController{
    @Autowired
    private lateinit var roleService: RoleService

    @GetMapping("")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadRoles}', '${Privilege.WriteRoles}')")
    fun getAllRoles(user: AppUser):ResponseEntity<Any>  {
        return if (user.isSuperAdmin) {
            // Return all roles in case of super admin
            ResponseEntity.ok(roleService.findAllRoles())
        } else {
            // Return certain roles that is created by this user
            ResponseEntity.ok(roleService.findRolesCreatedBy(user.nonSuperUserId))
        }
    }


    @PostMapping("")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteRoles}')")
    fun addNewRole(@RequestBody dto: RoleDTO) : ResponseEntity<Any>{
        if (dto.name?.trim()?.isEmpty() != false || dto.privileges?.isEmpty() != false) {
            throw BadRequestException("Invalid parameters")
        }

        // Upper case and prepend ROLE_
        dto.name = dto.name.toUpperCase().trim()
        if (!dto.name.startsWith("ROLE_")){
            dto.name = "ROLE_" + dto.name
        }

        if (dto.name == Role.SuperAdminRoleName) {
            throw BadRequestException("Can't edit super admin role")
        }

        //TODO - Prevent privileges exceeding current user's privileges
        return if (roleService.addNewRole(dto)) ResponseEntity.ok(BaseResponse("Successfully create new Role")) else ResponseEntity.badRequest().build()
    }

    @GetMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadRoles}', '${Privilege.WriteRoles}')")
    fun roleDetail(@PathVariable("id") id: Long): ResponseEntity<RoleDTO> {
        val dto = roleService.findRole(id)?.toDTO() ?: return ResponseEntity.badRequest().build()
        return ResponseEntity.ok(dto)
    }

    @PutMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteRoles}')")
    fun updateRole(@PathVariable("id") id: Long, @RequestBody dto: RoleDTO): ResponseEntity<Any> {
        val role = roleService.findRole(id) ?: return ResponseEntity.badRequest().build()
        if (dto.name?.isEmpty() != false || dto.privileges?.isEmpty() != false) {
            throw BadRequestException("Invalid parameters")
        }
        if (role.role == Role.SuperAdminRoleName){
            throw BadRequestException("Can't edit super admin role")
        }

        //TODO - Prevent privileges exceeding current user's privileges
        roleService.updateRole(role, dto)
        return ResponseEntity.ok(BaseResponse("Successfully updated role"))
    }

    @DeleteMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteRoles}')")
    fun deleteRole(@PathVariable("id") id: Long): ResponseEntity<Any> {
        // Check if role is deletable
        val role = roleService.findRole(id) ?: return ResponseEntity.badRequest().build()
        return if (roleService.deleteRole(role)) ResponseEntity.ok("") else throw BadRequestException("This role has associated users.")
    }
}
