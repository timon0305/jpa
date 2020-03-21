package com.digitalipvoice.cps.components

import com.digitalipvoice.cps.client.somos.models.NumberStatus
import com.digitalipvoice.cps.persistance.dao.ReservedNumberRepository
import com.digitalipvoice.cps.persistance.dao.SMSMessageRepository
import com.digitalipvoice.cps.persistance.model.ReservedNumber
import com.digitalipvoice.cps.persistance.model.SMSMessage
import com.digitalipvoice.cps.somos.message.MgiMessage
import com.digitalipvoice.cps.somos.message.Mods
import com.digitalipvoice.cps.somos.message.Verbs
import com.digitalipvoice.cps.somos.message.blockValue
import com.digitalipvoice.cps.somos.toUplDataString
import com.digitalipvoice.cps.utils.findByIdKt
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.util.concurrent.Executors

/**
 *
 */
@Component
class SMSResponseProcessor {
    @Autowired
    private lateinit var messageRepository:  SMSMessageRepository

    @Autowired
    private lateinit var reservedNumberRepository: ReservedNumberRepository


    private val executor by lazy {
        Executors.newFixedThreadPool(1).apply {
            submit{
                // Initialize transaction synchronization on this thread
                // Do not uncomment this in spring boot based application!
                /*
                try {
                    TransactionSynchronizationManager.initSynchronization()
                }catch(ex:Exception){
                    ex.printStackTrace()
                }
                */
            }
        }
    }

    /**
     * Process received somos message from server.
     * Mainly to update Reserved Numbers List for now
     */
    fun processMessage(requestMsgId:Long?, responseMsgId: Long) {
        executor.submit{
            val reqMessage = requestMsgId?.let { messageRepository.findByIdKt(it) }
            val message = messageRepository.findByIdKt(responseMsgId) ?: return@submit

            try {
                // Check message and update reserved number list.
                val mod = message.mod
                when (mod) {
                    Mods.NumSearchReserve -> // RSP-NSR, UNS-NSR
                        if (message.statusTermRept == "COMPLD" || message.verb == "UNS") {
                            processNSRResponse(reqMessage, message)
                        }
                    Mods.NumStatusChange -> // RSP-NSC
                        if (message.statusTermRept == "COMPLD") {
                            processNSCResponse(reqMessage, message)
                        }
                    Mods.UnsReservation -> // UNS-RSV
                        processRSVResponse(reqMessage, message)
                    Mods.MutiDialNumQuery ->    // RSP-MNQ
                        if (message.statusTermRept == "COMPLD") {
                            processMNQResponse(reqMessage, message)
                        }
                    Mods.UpdateCusRec ->        // RSP-CRA, UNS-CRA
                        processCRAResponse(reqMessage, message)
                    Mods.UpdateComplexRec ->    // RSP-CRC
                        processCRCResponse(reqMessage, message)
                    Mods.RecStatQuery ->        // RSP-CRQ
                        processCRQResponse(reqMessage, message)
                    Mods.RecQuery ->
                        processCRVResponse(reqMessage, message)
                }

                // Flush changes
                reservedNumberRepository.flush()
            }catch(ex:Exception) {
                ex.printStackTrace()
            }
        }
    }

    /**
     * Process RSP-NSR, UNS-NSR response
     */
    private fun processNSRResponse(req:SMSMessage?, resp: SMSMessage) {
        // Create Mgi Messages
        val mgiReq = req?.let{MgiMessage(it.toUplDataString())}
        val mgiResp = MgiMessage(resp.toUplDataString())

        // Get fields from response message
        val id = mgiResp.blockValue("ID").firstOrNull() ?: ""
        val reqId = mgiResp.blockValue("ID").firstOrNull() ?: ""
        val ro = mgiResp.blockValue("CRO").firstOrNull() ?: mgiResp.blockValue("RO").firstOrNull() ?: ""
        val ru = mgiResp.blockValue("RU").firstOrNull()
        val la = mgiResp.blockValue("LACT").firstOrNull()?.replace("\"", "")?.trim()
        val conPerson = (mgiResp.blockValue("NCON").firstOrNull() ?: mgiReq?.blockValue("NCON")?.firstOrNull())?.replace("\"", "")?.trim()
        val contactTel = (mgiResp.blockValue("CTEL").firstOrNull() ?: mgiReq?.blockValue("CTEL")?.firstOrNull())?.replace("\"", "")?.trim()
        val stat = mgiResp.blockValue("STAT").firstOrNull()?.trim()
        val numbers = mgiResp.blockValue("NUM").map { it.replace("\"", "").trim() }

        // Get fields from request message
        val action = mgiReq?.blockValue("AC")?.firstOrNull() ?: ""

        /**
         * Add reserved numbers to list
         */
        fun addReservedNumbers(numbers:Iterable<String>) {
            val nums = numbers.map{number ->
                val num = reservedNumberRepository.findByIdKt(number) ?: ReservedNumber(number)
                with(num) {
                    if (action == "R"){
                        smsId = reqId
                    }
                    contactNumber = contactTel ?: ""
                    contactPerson = conPerson ?: ""
                    lastActivated = la ?: ""
                    reservedUntil = ru ?: ""
                    this.ro = ro
                }
                return@map num
            }
            reservedNumberRepository.saveAll(nums)
        }

        // When stat is present, no need to check request message
        if (stat != null && stat.isNotEmpty()) {
            /*
            In case of Successful Query, OR UNSOLICITED MESSAGE
            RSP-NSR:,date,time:::COMPLD,00::ID=id,RO=ro,NUM=num, LACT=lact, RU=ru, DU=du,SE=se,STAT=stat,CRO=cro,NCON=ncon,CTEL=ctel,NOTES=notes;
            UNS-NSR:,date,time:::::MID=mid,RO=ro: CNT=cnt:NUM=num,LACT=lact,STAT=stat, ERR=err;
             */
            if (stat == NumberStatus.RESERVE.value) {
                // update numbers
                addReservedNumbers(numbers)
            } else {
                //remove all numbers if present
                deleteAllNumbers(numbers)
            }
        } else if (action == "R") { // Another case, if RESERVE is requested and succeed.
            addReservedNumbers(numbers)
        }
    }

    /**
     * Process RSP-NSC response
     */
    private fun processNSCResponse(req:SMSMessage?, resp: SMSMessage) {
        // Create Mgi Messages
        val mgiReq = req?.let{MgiMessage(it.toUplDataString())}
        val mgiResp = MgiMessage(resp.toUplDataString())

        // Get fields from response message
        val id = mgiReq?.blockValue("ID")?.firstOrNull() ?: ""
        val newRo = mgiResp.blockValue("NEWRO").firstOrNull() /*?: mgiReq?.blockValue("NEWRO")?.firstOrNull()*/
        val ro = mgiResp.blockValue("RO").firstOrNull() ?: mgiResp.blockValue("RO").firstOrNull() ?: ""
        val ru = mgiResp.blockValue("RU").firstOrNull() ?: mgiReq?.blockValue("RU")?.firstOrNull()
        val la = mgiResp.blockValue("LACT").firstOrNull()?.replace("\"", "")?.trim()
        val conPerson = (mgiResp.blockValue("NCON").firstOrNull() ?: mgiReq?.blockValue("NCON")?.firstOrNull())
        val contactTel = (mgiResp.blockValue("CTEL").firstOrNull() ?: mgiReq?.blockValue("CTEL")?.firstOrNull())
        val stat = mgiResp.blockValue("STAT").firstOrNull()
        val numbers = mgiResp.blockValue("NUML")
        val number = mgiResp.blockValue("NUM").firstOrNull()

        val action = mgiReq?.blockValue("AC")?.firstOrNull() ?: ""

        // In case of single number change status success
        if (number != null && number.isNotEmpty() && stat != null && stat.isNotEmpty()) {
            // This also contains action = "C" and action = "R"
            if (stat == NumberStatus.RESERVE.value) {
                val rn = (reservedNumberRepository.findByIdKt(number) ?: ReservedNumber(number)).apply {
                    if (action == "R" || action == "C") {
                        smsId = id
                    }
                    contactNumber = contactTel ?: ""
                    contactPerson = conPerson ?: ""
                    lastActivated = la ?: ""
                    reservedUntil = ru ?: ""
                    this.ro = newRo ?: ro
                }
                reservedNumberRepository.save(rn)
            } else {
                deleteNumber(number)
            }
        } else if (action == "S"){
            // Remove from reserved numbers list if number is spared successfully
            deleteAllNumbers(numbers)
            number?.let {deleteNumber(it)}
        }
    }

    /**
     * Process UNS-RSV response
     */
    private fun processRSVResponse(req:SMSMessage?, resp: SMSMessage) {
        // Create Mgi Messages
        val mgiReq = req?.let{MgiMessage(it.toUplDataString())}
        val mgiResp = MgiMessage(resp.toUplDataString())

        // Create Mgi Messages
        val id = mgiReq?.blockValue("ID")?.firstOrNull() ?: ""

        val numbers = mgiResp.blockValue("NUM")
        val ro = mgiResp.blockValue("RO").firstOrNull() ?: ""

        val nums = numbers.map{
            (reservedNumberRepository.findByIdKt(it) ?: ReservedNumber(it)).apply {
                this.ro = ro
                if (id.isNotEmpty())
                    smsId = id
            }
        }
        // Save all numbers
        reservedNumberRepository.saveAll(nums)
    }

    /**
     * Process RSP-MNQ response
     */
    private fun processMNQResponse(req:SMSMessage?, resp:SMSMessage) {
        // Create Mgi Messages
        val mgiResp = MgiMessage(resp.toUplDataString())

        val maps = mgiResp.blockValue(listOf("NUM", "STAT", "CRO", "NCON", "CTEL", "LACT", "RU"))
        maps.forEach { map ->
            val stat = map["STAT"] ?: ""
            val num = map["NUM"] ?: ""
            val cro = map["CRO"] ?: ""

            if (stat.isNotEmpty() && num.isNotEmpty() && cro.isNotEmpty()) {
                if (stat == NumberStatus.RESERVE.value) {
                    val n = reservedNumberRepository.findByIdKt(num) ?: ReservedNumber(num).apply {
                        ro = cro
                        lastActivated = map["LACT"] ?: ""
                        contactPerson = map["NCON"] ?: ""
                        contactNumber = map["CTEL"] ?: ""
                        reservedUntil = map["RU"] ?: ""
                    }
                    reservedNumberRepository.save(n)
                } else {
                    deleteNumber(num)
                }
            }
        }
    }

    /**
     * Process CRA Response (RSP-CRA, REQ-CRA)
     */
    private fun processCRAResponse(req:SMSMessage?, resp:SMSMessage) {
        val mgiResp = MgiMessage(resp.toUplDataString())
        val num = mgiResp.blockValue("NUM").firstOrNull() ?: return

        if (resp.verb == Verbs.UNSOLICITED || mgiResp.status_termRept == "COMPLD") {
            // When any operation succeed,
            reservedNumberRepository.deleteById(num)
            return
        }

        // when denied, check error code
        val err = mgiResp.blockValue("ERR").firstOrNull() ?: return
        /*
        10 - Invalid Action Code: record already exists
        25 - Cannot create customer record while disconnect is still pending
        27 - Cannot update a copied customer record without making changes
        28 - Cannot create administrative data: number reserved for another RESP ORG
        41 - Number status is SPARE: reserve before using Action Code = N.
        54 - Cannot delete: Record is past due
        55 - Cannot delete: Record is not the latest instance
        61 - Cannot transfer: Target record already exists
        62 - Cannot transfer: Other record(s) exist between source and target
        66 - Cannot disconnect or change: Source date and/or time not specified and more than one record instance exists
        67 - Cannot disconnect or change: Record instance exists between source and target date and/or time
        68 - Cannot disconnect or change: Target date and/or time not specified and source record instance is past due
        71 - Cannot add 'new record': Target record instance exists
        72 - Cannot add 'new record': The previous record instance is not a DISCONNECT record
        90 - Cannot transfer source: Target record already exists and it should be transferred
        91 - Cannot process request: Target record should be transferred
        92 - User is not allowed high priority update for this customer record.
        */
        val errorCodes = arrayOf("10", "25", "27", "28", "41", "54", "55", "61", "62", "66", "67", "68", "71", "72", "90", "91", "92")
        if (errorCodes.contains(err)){
            deleteNumber(num)
        }
    }

    /**
     * Process CRC Response
     */
    private fun processCRCResponse(req:SMSMessage?, resp:SMSMessage) {
        val mgiResp = MgiMessage(resp.toUplDataString())
        val termRpt = resp.statusTermRept
        val statusErr = resp.statusErrorCode
        val num = mgiResp.blockValue("NUM").firstOrNull()
        val numlist = mgiResp.blockValue("NUML").firstOrNull()?.split(",") ?: listOf()
        if (termRpt == "COMPLD") {
            // Delete numbers when request is succeed.
            num?.let{deleteNumber(it)}
            deleteAllNumbers(numlist)

            // When status is 11, no further processing is needed
            if (statusErr == "00")
                return
        }

        // Check DENIED or Partial COMPLD response
        if (num?.isNotEmpty() == true) {    // In case of single number
            /*
             0104 - Only HelpDesk can create the initial test customer record when Number status is UNAVAILABLE.
             0130 - Cannot process request: Target record should be transferred.
             0201 - Cannot process 'New' action, since Target record already exists.
             0202 - To process 'New' action for an existing record, its previous record must be in DISCONNECT or PENDING disconnect status.
             0205 - Cannot process 'New' action, since number status is SPARE. If spare, reserve this number before issuing the 'New' action.
             0206 - Cannot process 'New' action for SUSPEND number.
             0303 - Cannot process 'Change' action, since other record exists between Source and Target.
             0304 - Cannot process 'Change' action, since only 1 record exists for this 800# but the record is past due.
             0306 - Cannot process 'Change' action, since you cannot copy or copy+change a new record backward.
             0308 - Cannot process 'Copy+Change' action, since Target record already exists.
             0309 - To modify a PENDING non disconnect record, you must use the 'Change' action.
             0310 - Cannot process request: Target record should be transferred.
             0403 - Cannot process 'Disconnect' action, since other record exists between Source and Target.
             0404 - Cannot process 'Disconnect' action, since only 1 record exists for this number but the record is past due.
             0406 - Cannot process 'Disconnect' action, since you cannot copy or copy+change a PENDING disconnect record backward.
             0407 - Cannot process 'Disconnect' action, since Source and Target have the same Effective Date and Effective Time.
             0409 - Cannot process 'Disconnect' action, since Target record already exists.
             0410 - To modify a PENDING disconnect record, you must use 'Disconnect' action.
             0502 - Cannot process 'Transfer' action, since Target record already exists.
             0503 - Cannot transfer an OLD, SENDING, ACTIVE, or DISCONNECT customer record.
             0504 - Cannot process 'Transfer' action, since Source and Target have the same Effective Date and Effective Time.
             0505 - To process 'Transfer' action, you must specify Source Effective Date and Time if more than one record exists for the specified number.
             0506 - Cannot process 'Transfer' action, since other record exists between Source and Target.
             0510 - Cannot process 'Transfer'. Target record already exists and should be transferred.
             0601 - Cannot process 'Delete' action, since the Target record is past due.
             0602 - Only the record with the latest Effective Date and Effective Time can be deleted.
             0703 - Cannot process 'Resend' action, since a later SENDING record exists.
             0704 - Cannot process "Resend" action, since no working records exist at any SCP for this ACTIVE or DISCONNECT record.
             */
            val errorCodes = arrayOf("0104", "0130", "0201", "0202", "0205", "0206", "0303", "0304", "0306", "0308", "0309", "0310",
                    "0403", "0404", "0406", "0407", "0409", "0410",
                    "0502", "0503", "0504", "0505", "0506", "0510",
                    "0601", "0602", "0703",
                    "0704")

            // when denied, check error code
            val err = mgiResp.blockValue("ERR").firstOrNull() ?: return
            if (errorCodes.contains(err))
                deleteNumber(num)

            return
        }

        val errvs = mgiResp.blockValue("ERRV")
        for (errv in errvs) {
            val splitted = errv.split(",")
            if (splitted.size != 3)
                continue

            val err = splitted[0]
            val etyp = splitted[1]
            val verr = splitted[2]
            /**
             * etyp values:
            0 - verr is a text string which includes original input if possible
            1 - verr is a valid dial number format (10 or 12 bytes text string)
             */
            // Check if verr is number,
            if (!verr.matches("\\d+".toRegex()) || etyp != "1") {
                continue
            }

            // verr is number.

            /**
             * err codes related
             * 0310 - Cannot process request: Target record should be transferred.
             * 0406 - Cannot process 'Disconnect' action, since you cannot copy or copy+change a PENDING disconnect record backward.
             * 0409 - Cannot process 'Disconnect' action, since Target record already exists.
             *
             */
            if (arrayOf("0310", "0406", "0409").contains(err))
                deleteNumber(verr)
        }
    }

    /**
     * RSP-CRQ
     */
    private fun processCRQResponse(req:SMSMessage?, resp:SMSMessage) {
        val mgiResp = MgiMessage(resp.toUplDataString())
        val termRpt = resp.statusTermRept

        val num = mgiResp.blockValue("NUM").firstOrNull() ?: return
        if (termRpt == "COMPLD") {
            deleteNumber(num)
            return
        }
    }

    /**
     * RSP-CRV
     */
    private fun processCRVResponse(req:SMSMessage?, resp:SMSMessage) {
        val mgiResp = MgiMessage(resp.toUplDataString())
        val termRpt = resp.statusTermRept

        val num = mgiResp.blockValue("NUM").firstOrNull() ?: return
        if (termRpt == "COMPLD") {
            deleteNumber(num)
            return
        }

        val err = mgiResp.blockValue("ERR").firstOrNull() ?: return
        /*
        09 - Warning - Requester has involvement with the number but is not the Control RESP ORG
        10 - Warning - More than one record exists. ACTIVE, SENDING, DISCONNECT, or most recent pending record version is returned.
        17 - Invalid record status. Only ACTIVE, SENDING, and DISCONNECT records can be explicitly requested.
         */
        // Not reserved number
        if (arrayOf("09", "10", "17").contains(err)){
            deleteNumber(num)
        }
    }

    /**
     * Utility functions to manage reserved numbers
     */
    private fun deleteAllNumbers(numbers:Iterable<String>) {
        val nums = reservedNumberRepository.findAllById(numbers)
        reservedNumberRepository.deleteAll(nums)
    }

    private fun deleteNumber(num:String){
        reservedNumberRepository.findByIdKt(num)?.let { reservedNumberRepository.delete(it) }
    }
}