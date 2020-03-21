package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.persistance.dao.PrivilegeRepository
import com.digitalipvoice.cps.persistance.dao.RoleRepository
import com.digitalipvoice.cps.persistance.dao.UserRepository
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.persistance.model.Role
import com.digitalipvoice.cps.persistance.model.User
import com.digitalipvoice.cps.service.VersionLogService
import com.digitalipvoice.cps.utils.logger
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
    private lateinit var versionLogService: VersionLogService

    @Autowired
    private lateinit var passwordEncoder: BCryptPasswordEncoder

    @Autowired
    private lateinit var cronJobs: CronJobs

    override fun onApplicationEvent(evt: ApplicationStartedEvent) {
        log.info("Context refreshed")

        //if (environment.activeProfiles.contains("dev")){
        // seed super admin & roles
        seedData()
        //}

        seedNewVersion()
    }

    private fun seedData() {
        // 1. Seed Privileges
        val privDashbaord = createPrivilegeIfNotFound(Privilege.Dashboard)
        val privSystem = createPrivilegeIfNotFound(Privilege.SystemSettings)
        val privReadLogo = createPrivilegeIfNotFound(Privilege.ReadLogo)
        val privWriteLogo = createPrivilegeIfNotFound(Privilege.WriteLogo)
        val privReadTimezone = createPrivilegeIfNotFound(Privilege.ReadTimezone)
        val privWriteTimezone = createPrivilegeIfNotFound(Privilege.WriteTimezone)
        val privRoles = createPrivilegeIfNotFound(Privilege.Roles)
        val privReadRoles = createPrivilegeIfNotFound(Privilege.ReadRoles)
        val privWriteRoles = createPrivilegeIfNotFound(Privilege.WriteRoles)
        val privUsers = createPrivilegeIfNotFound(Privilege.Users)
        val privReadUser = createPrivilegeIfNotFound(Privilege.ReadUser)
        val privWriteUser = createPrivilegeIfNotFound(Privilege.WriteUser)
        val privNMSManagement = createPrivilegeIfNotFound(Privilege.NMSManagement)
        val privReadNMS = createPrivilegeIfNotFound(Privilege.ReadNMS)
        val privWriteNMS = createPrivilegeIfNotFound(Privilege.WriteNMS)
        val privMgi = createPrivilegeIfNotFound(Privilege.Mgi)
        val privReadSomosConnections = createPrivilegeIfNotFound(Privilege.ReadSmsConnections)
        val privWriteSomosConnections = createPrivilegeIfNotFound(Privilege.WriteSmsConnections)
        val privReadIdRos = createPrivilegeIfNotFound(Privilege.ReadIdRos)
        val privWriteIdRos = createPrivilegeIfNotFound(Privilege.WriteIdRos)
        val privGeographicInfo = createPrivilegeIfNotFound(Privilege.GeographicInformation)
        val privLergImport = createPrivilegeIfNotFound(Privilege.LergImport)
        val privViewLerg = createPrivilegeIfNotFound(Privilege.ViewLerg)
        val privViewActivityLog = createPrivilegeIfNotFound(Privilege.ViewActivityLog)
        val privRateImport = createPrivilegeIfNotFound(Privilege.RateImport)
        val privViewRate = createPrivilegeIfNotFound(Privilege.ViewRate)
        val privCDRImport = createPrivilegeIfNotFound(Privilege.CDRImport)
        val privViewCDR = createPrivilegeIfNotFound(Privilege.ViewCDR)
        val privLCRReport = createPrivilegeIfNotFound(Privilege.LCRReport)
        val privCPRReport = createPrivilegeIfNotFound(Privilege.CPRReport)


        // Seed somos privileges
        val privRecordAdmin = createPrivilegeIfNotFound(Privilege.RecordAdmin)
        val privCustomerRecord = createPrivilegeIfNotFound(Privilege.CustomerRecord)
        val privPointerRecord = createPrivilegeIfNotFound(Privilege.PointerRecord)

        val privTemplateAdmin = createPrivilegeIfNotFound(Privilege.TemplateAdmin)
        val privTemplateAdminData = createPrivilegeIfNotFound(Privilege.TemplateAdminData)
        val privTemplateRecordList = createPrivilegeIfNotFound(Privilege.TemplateRecordList)

        val privNumberAdmin = createPrivilegeIfNotFound(Privilege.NumberAdmin)
        val privNumberSearch = createPrivilegeIfNotFound(Privilege.NumberSearch)
        val privReservationLimit = createPrivilegeIfNotFound(Privilege.ReservationLimit)
        val privReservedNumberList = createPrivilegeIfNotFound(Privilege.ReservedNumberList)
        val privNumberQueryUpdate = createPrivilegeIfNotFound(Privilege.NumberQueryUpdate)
        val privNumberStatusChange = createPrivilegeIfNotFound(Privilege.NumberStatusChange)
        val privTroubleReferralNumberQuery = createPrivilegeIfNotFound(Privilege.TroubleReferralNumberQuery)
        val privOneClickActivate = createPrivilegeIfNotFound(Privilege.OneClickActivate)

        val privSystemAutomationAdministration = createPrivilegeIfNotFound(Privilege.SystemAutomationAdministration)
        val privMultiNumberChangeRespOrg = createPrivilegeIfNotFound(Privilege.MultiNumberChangeRespOrg)
        val privMultiNumberQuery = createPrivilegeIfNotFound(Privilege.MultiNumberQuery)
        val privMultiConversionToPointerRecords = createPrivilegeIfNotFound(Privilege.MultiConversionToPointerRecords)

        val privTestBench = createPrivilegeIfNotFound(Privilege.TestBench)

        val allPrivileges = arrayOf(privDashbaord, privSystem, privReadLogo, privWriteLogo, privReadTimezone, privWriteTimezone, privRoles, privReadRoles, privWriteRoles, privUsers, privReadUser, privWriteUser, privNMSManagement, privReadNMS, privWriteNMS
                , privMgi, privReadSomosConnections, privWriteSomosConnections, privReadIdRos, privWriteIdRos, privGeographicInfo, privLergImport, privViewLerg, privViewActivityLog, privCDRImport, privViewCDR, privRateImport, privViewRate, privLCRReport, privCPRReport,

                privRecordAdmin, privCustomerRecord, privPointerRecord, privTemplateAdmin, privTemplateAdminData, privTemplateRecordList,
                privNumberAdmin, privNumberSearch, privReservationLimit, privReservedNumberList, privNumberQueryUpdate, privNumberStatusChange, privTroubleReferralNumberQuery, privOneClickActivate,
                privSystemAutomationAdministration, privMultiNumberChangeRespOrg, privMultiNumberQuery, privMultiConversionToPointerRecords,
                privTestBench
        )

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


        // Check LRN was imported, and if not, initiate task
        //if (cronJobs.lrnCounts() == 0L) {
            // Initiate new thread that refresh LRN
            Thread {
                cronJobs.refreshLRN()
            }.start()
        //}
    }

    @Transactional
    fun createPrivilegeIfNotFound(name: String) = privilegeRepository.findByName(name) ?: Privilege(name)

    @Transactional
    fun createRoleIfNotFound(role: String, description: String) = roleRepository.findByRole(role)
            ?: Role(role, description)

    /**
     * Seed Latest version
     */
    private fun seedNewVersion() {
        versionLogService.createVersionLog("0.0.1", "Initial Admin Dashboard")
    }
}