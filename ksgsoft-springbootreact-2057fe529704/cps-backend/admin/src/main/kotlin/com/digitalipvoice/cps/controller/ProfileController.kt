package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.admin.models.ChangePasswordRequest
import com.digitalipvoice.cps.client.admin.models.ProfileAdditionalDTO
import com.digitalipvoice.cps.client.admin.models.ProfileDTO
import com.digitalipvoice.cps.client.admin.models.ProfileMainDTO
import com.digitalipvoice.cps.model.BaseResponse
import com.digitalipvoice.cps.persistance.model.User
import com.digitalipvoice.cps.service.UserService
import com.digitalipvoice.cps.utils.isValidEmail
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

/**
 * Supported routes
 * GET /profile
 * PUT /profile/main
 * PUT /profile/additional
 * PUT /profile/ips
 */
@Controller
@RequestMapping("/profile")
class ProfileController{
    @Autowired
    private lateinit var userService: UserService

    @GetMapping("")
    @ResponseBody
    fun profile(user: User): ResponseEntity<ProfileDTO>{
        val mainDTO = ProfileMainDTO().apply {
            email = user.email
            firstName = user.firstName
            lastName = user.lastName
            val roles = user.roles;

            // At this time, only one role is allowed per user.
            if (roles.isNotEmpty()) {
                role = roles.first().role
                roleId = roles.first().id
            }

            username = user.username
        }

        val additionalDTO = ProfileAdditionalDTO().apply {
            val profile = user.profile
            country = profile?.country ?: ""
            address = profile?.address ?: ""
            province = profile?.province ?: ""
            city = profile?.city ?: ""
            zipcode = profile?.zipcode ?: ""
            tel1 = profile?.tel1 ?: ""
            tel2 = profile?.tel2 ?: ""
            mobile = profile?.mobile ?: ""
            fax = profile?.fax ?: ""
        }

        val result = ProfileDTO()
        result.additional = additionalDTO
        result.main = mainDTO
        result.ips = user.ips.map { it.ip }

        return ResponseEntity.ok(result)
    }

    @PutMapping("/main")
    @ResponseBody
    fun putProfileMainInformation(@RequestBody dto:ProfileMainDTO, user:User): ResponseEntity<Any> {
        with(dto) {
            if (email?.isNotEmpty() == true && email?.isValidEmail() != true)
                return ResponseEntity.badRequest().body(BaseResponse("Invalid email address"))
        }
        // Update user
        userService.updateUser(user, dto)
        return ResponseEntity.ok(BaseResponse("Update succeed."))
    }

    @PutMapping("/additional")
    @ResponseBody
    fun putProfileAdditionalInformation(@RequestBody dto:ProfileAdditionalDTO, user: User): ResponseEntity<Any> {
        return try {
            userService.updateUser(user, dto)
            ResponseEntity.ok(BaseResponse("Updated additional Information!"))
        }catch(ex:Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/ips")
    @ResponseBody
    fun putProfileIps(@RequestBody ips:List<String>, user: User): ResponseEntity<Any> {
        return try {
            userService.updateUserIps(user, ips)
            ResponseEntity.ok(BaseResponse("Updated IP addresses"))
        }catch(ex:Exception) {
            ResponseEntity.badRequest().build()
        }
    }

    @PutMapping("/password")
    @ResponseBody
    fun changePassword(@RequestBody req:ChangePasswordRequest, user: User): ResponseEntity<Any> {
        if (req.oldPassword?.isNotEmpty() != true || req.newPassword?.isNotEmpty() != true) {
            return ResponseEntity.badRequest().body(BaseResponse("Bad Request"))
        }
        return try {
            if (userService.updatePassword(user, req.oldPassword, req.newPassword))
                ResponseEntity.ok(BaseResponse("Password was changed"))
            else ResponseEntity.badRequest().body(BaseResponse("Old password doesn't match."))
        }catch(ex:Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse("Internal Server Error"))
        }
    }
}