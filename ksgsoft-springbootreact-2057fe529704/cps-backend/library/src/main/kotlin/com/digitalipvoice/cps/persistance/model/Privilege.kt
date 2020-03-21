package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableId
import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.Entity
import javax.persistence.EntityListeners
import javax.persistence.ManyToMany
import javax.persistence.Table

/**
 * Privilege - Defines User Privilege. Roles can have privileges
 */
@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "privilege")
class Privilege(var name: String = "") : AuditableId() {
    @ManyToMany(mappedBy = "privileges")
    @JsonIgnore
    var roles: Set<Role> = hashSetOf()

    override fun equals(other: Any?): Boolean {
        return (other as? Privilege)?.name == name
    }

    override fun hashCode(): Int {
        return super.hashCode() * 31 + name.hashCode() * 31
    }

    // Constants defining privileges
    companion object {
        // Back-end
        const val Dashboard = "MENU_DASHBOARD"               // DASHBOARD MENU
        const val SystemSettings = "MENU_SYSTEM_SETTINGS"    // SYSTEM SETTINGS MENU
        const val ReadLogo = "READ_LOGO"
        const val WriteLogo = "WRITE_LOGO"
        const val ReadTimezone = "READ_TIMEZONE"
        const val WriteTimezone = "WRITE_TIMEZONE"
        const val Roles = "MENU_ROLES"                       // ROLES MENU
        const val ReadRoles = "READ_ROLES"
        const val WriteRoles = "WRITE_ROLES"
        const val Users = "MENU_USERS"   // USERS MENU
        const val ReadUser = "READ_USER"
        const val WriteUser = "WRITE_USER"
        const val NMSManagement = "MENU_NMS"
        const val ReadNMS = "READ_NMS"
        const val WriteNMS = "WRITE_NMS"
        const val Mgi = "MENU_MGI"
        const val ReadSmsConnections = "READ_SOMOS_CONNECTIONS"
        const val WriteSmsConnections = "WRITE_SOMOS_CONNECTIONS"
        const val ReadIdRos = "READ_IDROS"
        const val WriteIdRos = "WRITE_IDROS"
        const val GeographicInformation = "READ_GEOGRAPHIC"

        const val LergImport = "IMPORT_LERG"
        const val ViewLerg = "VIEW_LERG"
        const val RateImport = "IMPORT_RATE"
        const val ViewRate = "VIEW_RATE"
        const val CDRImport = "IMPORT_CDR"
        const val ViewCDR = "VIEW_CDR"
        const val LCRReport = "LCR_REPORT"
        const val CPRReport = "CPR_REPORT"

        const val ViewActivityLog = "VIEW_ACTIVITY_LOG"

        // NMS (or SOMOS Privileges)

        const val RecordAdmin = "ADMIN_RECORD"           // Customer Record Administration
        const val CustomerRecord = "CAD"        // Customer Record Admin Data
        const val PointerRecord = "PAD"         // Pointer Record Admin Data

        const val TemplateAdmin = "ADMIN_TEMPLATE"
        const val TemplateAdminData = "TAD"
        const val TemplateRecordList = "TRL"

        const val NumberAdmin = "ADMIN_NUMBER"
        const val NumberSearch = "SEARCH_NUM"
        const val ReservationLimit = "RESERVATION_LIMIT"
        const val ReservedNumberList = "RESERVED_NUMBER_LIST"
        const val NumberQueryUpdate = "NUMBER_QUERY_UPDATE"
        const val NumberStatusChange = "NUMBER_STATUS_CHANGE"
        const val TroubleReferralNumberQuery = "TROUBLE_REFFERAL_NUMBER_QUERY"
        const val OneClickActivate = "ONE_CLICK_ACTIVATE"

        const val SystemAutomationAdministration = "SYSTEM_AUTOMATION"
        const val MultiNumberChangeRespOrg = "MULTI_NUMBER_CH_RO"
        const val MultiNumberQuery = "MNQ"
        const val MultiConversionToPointerRecords = "MULTI_CONVERSION_PR"

        const val TestBench = "TEST_BENCH"          // TEST BENCH PRIVILEGE that can send any request to somos.
    }
}