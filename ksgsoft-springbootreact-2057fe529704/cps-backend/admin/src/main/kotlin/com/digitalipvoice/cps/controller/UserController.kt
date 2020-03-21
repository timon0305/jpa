package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.*
import com.digitalipvoice.cps.exceptions.BadRequestException
import com.digitalipvoice.cps.exceptions.ForbiddenException
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.model.BaseResponse
import com.digitalipvoice.cps.persistance.dao.RoleRepository
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.service.UserService
import com.digitalipvoice.cps.utils.findByIdKt
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.*

/**
 * User Controller
 */
@Controller
@RequestMapping("/users")
class UserController{
    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var roleRepository: RoleRepository

    /**
     * Search users.
     * @param query : TableQuery request body
     * @param user : User
     */
    @PostMapping("/search")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadUser}', '${Privilege.WriteUser}')")
    fun getUsers(@RequestBody query:TableQuery, user: AppUser): ResponseEntity<TableResult> {
        // Search Users
        return ResponseEntity.ok(userService.searchUsers(user, query))
    }

    /**
     * Create a new user
     * @param req: CreateUserDTO Object
     */
    @PostMapping("")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun createUser(@RequestBody req:CreateUserDTO): ResponseEntity<Any> {
        if (req.username?.isEmpty() != false || req.password?.isEmpty() != false) {
            throw BadRequestException("Bad request to create user")
        }
        // Do some validation here
        val id = userService.createUser(req).id
        // return created id
        return ResponseEntity.status(HttpStatus.CREATED).body(id)
    }

    // Get user by id
    @GetMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('${Privilege.ReadUser}', '${Privilege.WriteUser}')")
    fun getUserDetailById(@PathVariable id:Long): ResponseEntity<ProfileDTO> {
        return ResponseEntity.ok(userService.getUserById(id))
    }

    /**
     * Delete user by id
     */
    @DeleteMapping("/{id}")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun deleteUser(@PathVariable id:Long): ResponseEntity<String> {
        userService.deleteUserById(id)
        return ResponseEntity.ok("User was removed successfully")
    }

    /**
     * Activate User
     */
    @PutMapping("/{id}/activate")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun activateUser(@PathVariable id:Long): ResponseEntity<String> {
        val user = userService.findUser(id) ?: throw BadRequestException("User with id=$id not found")
        userService.setUserActivateStatus(user, true)
        return ResponseEntity.ok("Updated")
    }

    /**
     * Deactivate User
     */
    @PutMapping("/{id}/deactivate")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun deactivateUser(@PathVariable id:Long, thisUser:AppUser): ResponseEntity<String> {
        val user = userService.findUser(id) ?: throw BadRequestException("User with id=$id not found")
        if (user.isSuperAdmin){
            throw ForbiddenException()
        }
        if (!thisUser.isSuperAdmin && user.createdBy != thisUser.id) {
            throw ForbiddenException()
        }
        userService.setUserActivateStatus(user, false)
        return ResponseEntity.ok("Updated")
    }

    /**
     * Update user main information
     */
    @PutMapping("/{id}/main")
    @ResponseBody
    @Transactional
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun updateUserMainInfo(@PathVariable id:Long, @RequestBody req:ProfileMainDTO, thisUser:AppUser): ResponseEntity<Any> {
        val user = userService.findUser(id) ?: throw BadRequestException("User with id=$id not found")

        if (!thisUser.isSuperAdmin && user.createdBy != thisUser.id) {
            throw ForbiddenException()
        }

        // Update user role here first. UserService function doesn't update the role.
        val newRole = roleRepository.findByIdKt(req.roleId) ?: throw BadRequestException("Role ${req.roleId} not found")

        if (newRole.isSuperAdminRole()) {
            throw ForbiddenException("Can't assign super admin role to non super admin user")
        } else if (user.isSuperAdmin && !newRole.isSuperAdminRole()) {
            throw ForbiddenException("Can't assign super admin role to non super admin user")
        }

        user.roles = hashSetOf(newRole)

        // Update user with request
        userService.updateUser(user, req)
        return ResponseEntity.ok(BaseResponse("Updated"))
    }

    /**
     * Update user ip information
     */
    @PutMapping("/{id}/ips")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun updateUserIPInfo(@PathVariable id:Long, @RequestBody ips:List<String>, thisUser: AppUser): ResponseEntity<BaseResponse> {
        val user = userService.findUser(id) ?: throw BadRequestException("User with id=$id not found")
        if (!thisUser.isSuperAdmin && user.createdBy != thisUser.id) {
            throw ForbiddenException()
        }
        userService.updateUserIps(user, ips)
        return ResponseEntity.ok(BaseResponse("Updated"))
    }

    /**
     * Update user additional information
     */
    @PutMapping("/{id}/additional")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun updateUserAdditionalInfo(@PathVariable id: Long, @RequestBody req:ProfileAdditionalDTO, thisUser:AppUser): ResponseEntity<BaseResponse> {
        val user = userService.findUser(id) ?: throw BadRequestException("User with id=$id not found")
        if (!thisUser.isSuperAdmin && user.createdBy != thisUser.id) {
            throw ForbiddenException()
        }
        userService.updateUser(user, req)
        return ResponseEntity.ok(BaseResponse("Updated"))
    }

    /**
     * Update user password
     */
    @PutMapping("/{id}/password")
    @ResponseBody
    @PreAuthorize("hasAuthority('${Privilege.WriteUser}')")
    fun updateUserPassword(@PathVariable id: Long, @RequestBody req: ChangePasswordRequest, thisUser:AppUser): ResponseEntity<Any> {
        if (req.newPassword?.isEmpty() != false) {
            throw BadRequestException()
        }
        val user = userService.findUser(id) ?: throw BadRequestException("User with id=$id not found")
        if (!thisUser.isSuperAdmin && user.createdBy != thisUser.id) {
            throw ForbiddenException()
        }
        userService.updateUser(user, req)
        return ResponseEntity.ok(BaseResponse("Updated"))
    }
}