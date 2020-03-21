package com.digitalipvoice.cps.service

import com.digitalipvoice.cps.client.admin.models.*
import com.digitalipvoice.cps.exceptions.CreateUserException
import com.digitalipvoice.cps.model.AppUser
import com.digitalipvoice.cps.persistance.dao.RoleRepository
import com.digitalipvoice.cps.persistance.dao.UserIPRepository
import com.digitalipvoice.cps.persistance.dao.UserProfileRepository
import com.digitalipvoice.cps.persistance.dao.UserRepository
import com.digitalipvoice.cps.persistance.model.User
import com.digitalipvoice.cps.persistance.model.UserIP
import com.digitalipvoice.cps.persistance.model.UserProfile
import com.digitalipvoice.cps.utils.findByIdKt
import com.digitalipvoice.cps.utils.logger
import org.hibernate.ObjectNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class UserService {
    private val log = logger(javaClass)

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var roleRepository:RoleRepository

    @Autowired
    private lateinit var userProfileRepository: UserProfileRepository

    @Autowired
    private lateinit var userIPRepository: UserIPRepository

    @Autowired
    private lateinit var passwordEncoder: BCryptPasswordEncoder

    /**
     * Find User by user name
     */
    fun findUserByName(username:String) = userRepository.findByUsername(username)

    /**
     * Update User
     */
    fun updateUser(user: User, dto: ProfileMainDTO) {
        user.firstName = dto.firstName
        user.lastName = dto.lastName
        user.email = dto.email
        userRepository.save(user)
    }

    /**
     * Update User
     */
    fun updateUser(user: User, dto: ProfileAdditionalDTO){
        val profile = user.profile ?: UserProfile()
        user.profile = profile

        profile.country = dto.country ?: ""
        profile.address = dto.address ?: ""
        profile.province = dto.province ?: ""
        profile.city = dto.city ?: ""
        profile.zipcode = dto.zipcode ?: ""
        profile.mobile = dto.mobile ?: ""
        profile.fax = dto.fax ?: ""
        profile.tel1 = dto.tel1 ?: ""
        profile.tel2 = dto.tel2 ?: ""
        userProfileRepository.save(profile)
        userRepository.save(user)
    }

    /**
     * Update user ips
     */
    fun updateUserIps(user:User, ips:List<String>) {
        user.ips.forEach {
            it.user = null
            userIPRepository.delete(it)
        }
        ips.forEach {
            val ip = UserIP(it)
            ip.user = user
            userIPRepository.save(ip)
        }
    }

    /**
     * Update user password
     */
    fun updatePassword(user:User, oldPassword:String, newPassword:String) : Boolean{
        if (!passwordEncoder.matches(oldPassword, user.password))
            return false
        user.password = passwordEncoder.encode(newPassword)
        userRepository.save(user)
        return true
    }

    /**
     * Get User by Id
     */
    fun findUser(id: Long) = userRepository.findByIdKt(id)

    fun getUserById(id: Long): ProfileDTO{
        val user = userRepository.findByIdKt(id) ?: throw ObjectNotFoundException(id, "User")
        val result = ProfileDTO()

        // Main information
        result.main = ProfileMainDTO().email(user.email)
                .firstName(user.firstName)
                .lastName(user.lastName)
                .username(user.username)
                .role(user.roles.first()?.role)
                .roleId(user.roles.first()?.id)

        // ips
        result.ips = user.ips.map { it.ip }

        // Additional Information
        val profile = user.profile
        result.additional = ProfileAdditionalDTO().address(profile?.address ?: "")
                .city(profile?.city ?: "")
                .country(profile?.country ?: "")
                .fax(profile?.fax ?: "")
                .mobile(profile?.mobile ?: "")
                .province(profile?.province ?: "")
                .tel1(profile?.tel1 ?: "")
                .tel2(profile?.tel2 ?: "")
                .zipcode(profile?.zipcode ?: "")

        return result
    }

    /**
     * search Users by Table Query
     */
    fun searchUsers(user: AppUser, query:TableQuery): TableResult {
        if (query.sorts?.isEmpty() != false) {
            // Add sort by user name by default if not exist
            query.addSortsItem(SortOption().column("username"))
        }
        return userRepository.findUsers(user, query)
    }

    /**
     * Create User
     * @param req CreateUserDTO object
     */
    fun createUser(req:CreateUserDTO): User {

        // Check role first
        val role = roleRepository.findByIdKt(req.role) ?: throw CreateUserException("Creating user failed because specified role doesn't exist")

        if (role.isSuperAdminRole()) {
            throw CreateUserException("Can't create user with super admin role. Please select another role or create a new role")
        }

        val user = User()

        // Update
        user.username = req.username
        user.password = passwordEncoder.encode(req.password)
        user.firstName = req.firstName ?: ""
        user.lastName = req.lastName ?: ""
        user.email = req.email ?: ""
        user.isActive = true

        userRepository.save(user)

        user.roles = hashSetOf(role)

        // update additional information
        val profile = UserProfile()
        profile.country = req.country ?: ""
        profile.address = req.address ?: ""
        profile.province = req.province ?: ""
        profile.city = req.city ?: ""
        profile.zipcode = req.zipcode ?: ""
        profile.tel1 = req.tel1 ?: ""
        profile.tel2 = req.tel2 ?: ""
        profile.mobile = req.mobile ?: ""
        profile.fax = req.fax ?: ""
        profile.user = user

        userProfileRepository.save(profile)

        // update user ips
        req.ips?.forEach{ip ->
            val userIP = UserIP()
            userIP.ip = ip
            userIP.user = user
            userIPRepository.save(userIP)
        }

        return user
    }

    /**
     * Delete user by Id
     */
    fun deleteUserById(id: Long) {
        val user = userRepository.findByIdKt(id) ?: throw UsernameNotFoundException("No user id=$id found")

        // Delete profile information first
        user.profile?.let { userProfileRepository.delete(it)  }

        // Delete user ips
        user.ips.forEach { userIPRepository.delete(it) }

        // Delete user
        userRepository.delete(user)
    }

    /**
     * Activate user
     * @param id Long
     * @param status New status
     */
    fun setUserActivateStatus(user:User, status:Boolean) {
        // update user status
        user.isActive = status
        userRepository.save(user)
    }

    /**
     * Update user password
     */
    fun updateUser(user:User, req:ChangePasswordRequest){
        user.password = passwordEncoder.encode(req.newPassword)
        userRepository.save(user)
    }
}