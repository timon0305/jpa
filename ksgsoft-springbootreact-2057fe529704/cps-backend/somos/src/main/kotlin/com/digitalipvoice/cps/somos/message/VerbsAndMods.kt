package com.digitalipvoice.cps.somos.message

/**
 * Define `verb` part in MgiMessage `verb-mode` of MGI MgiMessage
 */
object Verbs{
    // Commands
    const val REQUEST = "REQ"
    const val RETRIEVE = "RTRV"

    // Response
    const val RESPONSE = "RSP"

    // UNSOLICITED
    const val UNSOLICITED = "UNS"
    const val REPORT = "REPT"

    // Check whether verb is COMMAND
    fun isCommand(verb:String) = (verb.startsWith(REQUEST) || verb.startsWith(RETRIEVE))

    // Check whether verb is RESPONSE
    fun isResponse(verb:String) = verb.startsWith(RESPONSE)

    // Check whether verb is UNSOLICITED
    fun isUnsolicited(verb:String) = verb.startsWith(UNSOLICITED) || verb.startsWith(REPORT)
}

/**
 * Define `mod` part in MgiMessage `verb-mod` of MGI MgiMessage
 */
object Mods{
    /**
     * Number Search, Reservation or Query Command & Response
     */
    const val NumSearchReserve = "NSR"

    /**
     * Unsolicited Number Status Notification
     */
    const val UnsNumStatus = "NSR"

    /**
     * Number Status Change Command & Response
     */
    const val NumStatusChange = "NSC"

    /**
     * Unsolicited Reservation Notification
     */
    const val UnsReservation = "RSV"

    /**
     * Multi-Dial Number Query Command & Response
     */
    const val MutiDialNumQuery = "MNQ"

    /**
     * Update Customer Record Command & Response
     */
    const val UpdateCusRec = "CRA"

    /**
     * Update Complex Record Command & Response
     */
    const val UpdateComplexRec = "CRC"

    /**
     * Template Record List Command & Response
     */
    const val TemplateRecLst = "TRL"

    /**
     * Update Template Record Command & Response
     */
    const val UpdateTemplateRec = "TRC"

    /**
     * Customer Record Status Query
     */
    const val RecStatQuery = "CRQ"

    /**
     * Customer Record Retrieval
     */
    const val RecQuery = "CRV"

    /**
     * SMS Carrier Notification/Approval
     */
    const val SMSCarrierNotification = "SNA"

    /**
     * Approval REPT-APR
     */
    const val ReportApproval = "APR"

    /**
     * Approval Status e.g. UNS-APP
     */
    const val ApprovalStatus = "APP"

    /**
     * ApprovalControl e.g. UNS-ACT
     */
    const val ApprovalControl = "ACT"

    /**
     * Detail Approval Status
     */
    const val DetailApprovalStatus = "DAP"

    /**
     * Trouble Referral Number Query
     */
    const val TroubleRefNumQuery = "TRN"

    /**
     * Multiple Dial Number Resp Org Change
     */
    const val MultiDialNumROChange = "MRO"

    /**
     * SCP Status Query/Resend/Audit
     */
    const val SCPStatus = "SCP"

    /**
     * Bulletin Board Message
     */
    const val BulletinBoardMsg = "BBM"

    /**
     * Request RESP ORG Change
     */
    const val ROChange = "RCH"

    /**
     * Resp Org Change Request Notification UNS-CRO
     */
    const val ROChangeRequestNotification = "CRO"

    /**
     * Resp Org Change Request Denial REQ-ROC / RSP-ROC
     */
    const val ROChangeReqDenial = "ROC"

    /**
     * Resp Org Change Denial UNS-RRO
     */
    const val ROChangeReqDenialUNS = "RRO"

    /**
     * System Automation Limits
     */
    const val SysAutoLimit = "ASL"

    /**
     * Request Global System Limits
     */
    const val GlobalSysLimit = "GSL"

    /**
     * Test Capabilities
     */
    const val TestCapabilities = "TEST"

    /**
     * Application Status Information
     */
    const val AppStatusInfo = "ASI"
}

/**
 * Define Verb-Mod pair for typo
 */
object VerbMod {
    /**
     * Number Search, Reservation or Query Request
     */
    const val NumSrchResQueryReq = "${Verbs.REQUEST}-${Mods.NumSearchReserve}"

    /**
     * Number Search, Reservation or Query Response
     */
    const val NumSrchResQueryResp = "${Verbs.RESPONSE}-${Mods.NumSearchReserve}"

    /**
     * Number Status Change Request
     */
    const val NumStatChangeReq = "${Verbs.REQUEST}-${Mods.NumStatusChange}"

    /**
     * Number Status Change Response
     */
    const val NumStatChangeResp = "${Verbs.RESPONSE}-${Mods.NumStatusChange}"

    /**
     * Request for Multi Dial Number Query
     */
    const val MultiDialNumberQueryReq = "${Verbs.REQUEST}-${Mods.MutiDialNumQuery}"

    /**
     * Request for Update Customer Record
     */
    const val UpdateCusRecReq = "${Verbs.REQUEST}-${Mods.UpdateCusRec}"

    /**
     * Update Complex Record
     */
    const val UpdateComplexRecReq = "${Verbs.REQUEST}-${Mods.UpdateComplexRec}"
    const val UpdateComplexRecResp = "${Verbs.RESPONSE}-${Mods.UpdateComplexRec}"

    /**
     * Request Template Record List
     */
    const val TempRecLstReq = "${Verbs.REQUEST}-${Mods.TemplateRecLst}"

    /**
     * Update Template Record
     */
    const val UpdateTempRecReq = "${Verbs.REQUEST}-${Mods.UpdateTemplateRec}"

    /**
     * Record Status Query
     */
    const val RecStatQueryReq = "${Verbs.REQUEST}-${Mods.RecStatQuery}"
    const val RecStatQueryResp = "${Verbs.RESPONSE}-${Mods.RecStatQuery}"

    /**
     * Record Retrieval (Customer Record Query)
     */
    const val RecQueryReq = "${Verbs.REQUEST}-${Mods.RecQuery}"
    const val RecQueryResp = "${Verbs.RESPONSE}-${Mods.RecQuery}"

    /**
     * Report Approval
     */
    const val ReportApproval = "${Verbs.REPORT}-${Mods.ReportApproval}"

    /**
     * Request Detail Approval Status
     */
    const val DetailApprovalStatReq = "${Verbs.REQUEST}-${Mods.DetailApprovalStatus}"

    /**
     * Request Trouble Referral Number Query
     */
    const val TroubleRefNumQueryReq = "${Verbs.REQUEST}-${Mods.TroubleRefNumQuery}"

    /**
     * Request Multiple Dial Number Resp Org Change
     */
    const val MultiDialNumROChangeReq = "${Verbs.REQUEST}-${Mods.MultiDialNumROChange}"

    /**
     * SCP Status Query/Resend/Audit
     */
    const val SCPStatusQueryResendAuditReq = "${Verbs.REQUEST}-${Mods.SCPStatus}"

    /**
     * Request Resp Org Change
     */
    const val ROChangeReq = "${Verbs.REQUEST}-${Mods.ROChange}"

    /**
     * Report Resp Org Change Request Denial
     */
    const val ROChangeReqDenialReport = "${Verbs.REPORT}-${Mods.ROChangeReqDenial}"

    /**
     * System Auto Limits Request
     */
    const val SysAutoLimitReq = "${Verbs.REQUEST}-${Mods.SysAutoLimit}"

    /**
     * Global System Automation Limits
     */
    const val GlobalSysLimitReq = "${Verbs.REQUEST}-${Mods.GlobalSysLimit}"

    // Request Test Capabilities
    const val TestCapReq = "${Verbs.REQUEST}-${Mods.TestCapabilities}"

    // Response Test Capabilities
    const val TestCapResp = "${Verbs.RESPONSE}-${Mods.TestCapabilities}"

    // Retrieve Application Status information
    const val AppStatusInfoRetrieve = "${Verbs.RETRIEVE}-${Mods.AppStatusInfo}"

    const val AppStatusInfoResp = "${Verbs.RESPONSE}-${Mods.AppStatusInfo}"
}

// term_rept in Status
object StatusTermRept
{
    const val COMPLETED = "COMPLD"    // COMPLETED RESPONSE
    const val DENIED = "DENIED"       // DENIED RESPONSE
}

// error_cd in Status
object StatusErrorCode
{
    const val SUCCESS = "00"          // SUCCEED
    const val SYNTAX = "01"           // SYNTAX ERROR
}