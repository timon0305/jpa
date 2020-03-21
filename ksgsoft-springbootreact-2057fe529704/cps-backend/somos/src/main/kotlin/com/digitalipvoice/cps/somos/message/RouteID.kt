package com.digitalipvoice.cps.somos.message

/**
 * Route ID in Application MgiMessage Specification
 * It is DRC (3 bytes) in UPL Header
 */
object RouteID {
    /**
     * Get Route ID for Application MGI message from Verb-Mod combination
     */
    fun get(verbMod:String) = map[verbMod] ?: "XXX"

    const val NumSrchResQueryReq = "CSR"    // Number Search, Reservation or Query

    const val NumSrchResQueryResp = "RSR"   // Response to Number Search, Reservation,

    const val NumStatChangeReq = "CSC"      // Number Status Change

    const val NumStatChangeResp = "RSC"     // Number Status Change Response

    const val MultiDialNumberQueryReq = "CNQ"   // Multi-Dial Number Query

    const val UpdateCusRecReq = "CRU"       // Update Customer Record

    const val UpdateComplexRecReq = "CXU"   // Update Complex Record

    const val UpdateComplexRecResp = "RXU"  // Update Complex Record Response

    const val TempRecLstReq = "CTL"         // Request Template record List

    const val UpdateTempRecReq = "CTP"      // Update Template Record Req

    const val ReqStatQueryReq = "CRQ"  // Update Complex Record Response

    const val ReqStatQueryResp = "RRQ"  // Update Complex Record Response

    const val RecQueryReq = "CRV"  // Update Complex Record Response

    const val RecQueryResp = "RRV"  // Update Complex Record Response

    const val ReportApproval = "CPT"    // Report Approval

    const val DetailApprovalStatReq = "CDA"     // Request Detail Approval Status

    const val TroubleRefNumQueryReq = "CTR"     // Trouble Referral Number Query

    const val MultiDialNumROChangeReq = "CRO"      // Request Multiple Dial Number Resp Org Change

    const val SCPStatusQueryResendAuditReq = "CRR"  // Request SCP Status Query/Resend/Audit Request

    const val ROChangeReq = "CCH"           // Request Resp Org Change

    const val ROChangeReqDenialReport = "COC"       // Report Resp Org Change Request Denial

    const val SysAutoLimitReq = "CAL"           // Request System Automation Limits

    const val GlobalSysLimitReq = "CGL"         // Request Global System Limits

    private val map = mapOf(
            VerbMod.NumSrchResQueryReq to NumSrchResQueryReq,
            VerbMod.NumSrchResQueryResp to NumSrchResQueryResp,

            VerbMod.NumStatChangeReq to NumStatChangeReq,
            VerbMod.NumStatChangeResp to NumStatChangeResp,

            VerbMod.MultiDialNumberQueryReq to MultiDialNumberQueryReq,

            VerbMod.UpdateCusRecReq to UpdateCusRecReq,

            VerbMod.UpdateComplexRecReq to UpdateComplexRecReq,
            VerbMod.UpdateComplexRecResp to UpdateComplexRecResp,

            VerbMod.TempRecLstReq to TempRecLstReq,

            VerbMod.UpdateTempRecReq to UpdateTempRecReq,

            VerbMod.RecStatQueryReq to ReqStatQueryReq,
            VerbMod.RecStatQueryResp to ReqStatQueryResp,

            VerbMod.RecQueryReq to RecQueryReq,
            VerbMod.RecQueryResp to RecQueryResp,

            VerbMod.ReportApproval to ReportApproval,

            VerbMod.DetailApprovalStatReq to DetailApprovalStatReq,

            VerbMod.TroubleRefNumQueryReq to TroubleRefNumQueryReq,

            VerbMod.MultiDialNumROChangeReq to MultiDialNumROChangeReq,

            VerbMod.SCPStatusQueryResendAuditReq to SCPStatusQueryResendAuditReq,

            VerbMod.ROChangeReq to ROChangeReq,

            VerbMod.ROChangeReqDenialReport to ROChangeReqDenialReport,

            VerbMod.SysAutoLimitReq to SysAutoLimitReq,

            VerbMod.GlobalSysLimitReq to GlobalSysLimitReq,

            VerbMod.DetailApprovalStatReq to DetailApprovalStatReq,

            VerbMod.DetailApprovalStatReq to DetailApprovalStatReq

    )
}