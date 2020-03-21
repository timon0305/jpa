package com.digitalipvoice.cps.controller

import com.digitalipvoice.cps.client.somos.models.VolumeTestRequest
import com.digitalipvoice.cps.components.CorrelationIDGen
import com.digitalipvoice.cps.components.SMSConnectionManager
import com.digitalipvoice.cps.persistance.model.Privilege
import com.digitalipvoice.cps.somos.SMSClient
import com.digitalipvoice.cps.somos.message.*
import com.digitalipvoice.cps.utils.RandomString
import com.digitalipvoice.cps.utils.logger
import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux
import java.time.Duration
import java.time.LocalDateTime
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors


/**
 * VolumeTestStatus
 */
data class VolumeTestStatus(val requestId:String, val all:Int, var received:Int) {
    val cached = mutableListOf<Y1DcmMsg?>()
    var isCancelled = false
}

object VolumeTester{
    /**
     * Volume test status
     * [messageId : VolumeTestStatus]
     */
    private val testStatusMap = ConcurrentHashMap<String, VolumeTestStatus>()

    /**
     * Check if arrived message is volume test message. (Compare correlation id)
     */
    fun checkIfVolumeTestMessage(msg:Y1DcmMsg): Boolean{

        val key = msg.data?.header?.correlationID ?: return false
        val stat = testStatusMap[key] ?: return false

        testStatusMap.remove(key)
        synchronized(stat) {
            stat.received += 1
            stat.cached.add(msg)
            // All has processed.
            if (stat.received == stat.all) {
                // Add null message to indicate it's end
                stat.cached.add(null)
            }
        }
        return true
    }

    /**
     * Cache messages
     */
    fun cacheMessage(stat:VolumeTestStatus, msg:Y1DcmMsg) {
        val key = msg.data!!.header.correlationID   // Get Key
        // map the status to this message id to catch response
        testStatusMap[key] = stat

        // Add message to linked list
        synchronized(stat){
            stat.cached.add(msg)
        }
    }
}

@RestController
class SomosTestVolumeController {

    private val log = logger(javaClass)
    /**
     * UPL Header CorrelationID Generator
     */
    @Autowired
    private lateinit var correlationIDGen: CorrelationIDGen

    /**
     * SMS Transport Header MessageTag(Message ID) generator
     */
    @Autowired
    private lateinit var messageIDGen: CorrelationIDGen

    @Autowired
    private lateinit var connectionManager: SMSConnectionManager

    private val soGenerator = RandomString(11)

    @PostMapping("/somos/volume_test", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    @PreAuthorize("hasAuthority('${Privilege.TestBench}')")
    fun volumeTest(@RequestBody req: VolumeTestRequest): Flux<String> {
        val stat = VolumeTestStatus(correlationIDGen.next(), req.volume.count() , 0)
        val mapper = ObjectMapper()
        // Send every 5 seconds
        val flux = Flux.interval(Duration.ofMillis(3000L))
                .map{
                    synchronized(stat) {
                        val result = stat.cached.toList()
                        stat.cached.clear()
                        return@synchronized result
                    }
                }.takeUntil{ it.contains(null) }
                .map {
                    //log.error("Returning $it")
                    mapper.writeValueAsString(it)
                }.doOnCancel {
                    synchronized(stat) {
                        stat.isCancelled = true
                    }
                }.doOnError{
                    synchronized(stat) {
                        stat.isCancelled = true
                    }
                }
        Executors.newSingleThreadExecutor().submit{
            testInternal(req, stat)
        }
        return flux
    }

    private fun testInternal(req:VolumeTestRequest, stat:VolumeTestStatus){
        val id = req.id!!
        val ro = req.ro!!
        val (cntQueryOne, cntSearchSpare, cntSearchReserve, cntNumStatChange,
                cntNewRec, cntChangeRec, cntDisconnect, cntRecStat, cntRecQuery, cntQueryTroubleNum) = req.volume.requestMessageCounts()

        val whole = req.volume.count()
        val interval = (req.volume.timelimit() / whole / 1.5).toLong()    // Calculate again!!
        //val interval = 1000L

        // read values from request
        val nums = req.nums!!
        val notes = req.notes ?: listOf()
        val respOrgs = req.ros ?: listOf()
        val conTels = req.conTels!!

        log.debug("Start sending volume test cases, count : $whole")

        // 1. Send Query One Number Request
        // Use numstat change req numbers
        (0 until cntQueryOne).forEach {i ->
            val num = nums.getOrNullMod(i)!!
            val connection = getActiveClient()
            val msg = createDcmMessage(RouteID.get("REQ-NSR"), message4QueryOneDial(id, ro, num), connection)
            // Send message
            try {
                connection.sendMessage(msg)
                // Emit sent message
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            Thread.sleep(interval)
        }

        //2. Search for Spare Numbers
        (0 until cntSearchSpare).forEach {
            val connection = getActiveClient()
            val msg = createDcmMessage(RouteID.get("REQ-NSR"), message4SearchSpareNumbers(id, ro), connection)
            // Send message
            try {
                connection.sendMessage(msg)
                // Emit sent message
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            Thread.sleep(interval)
        }

        //3. Search for and reserve spare numbers
        (0 until cntSearchReserve).forEach {
            val connection = getActiveClient()
            val msg = createDcmMessage(RouteID.get("REQ-NSR"), message4SearchAndReserveNumbers(id, ro), connection)
            // Send message
            try {
                connection.sendMessage(msg)
                // Emit sent message
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            Thread.sleep(interval)
        }

        //4. Number Status Change
        (0 until cntNumStatChange).forEach {i ->
            val connection = getActiveClient()
            val num = nums.getOrNullMod(i)!!
            val newRo = respOrgs.getOrNullMod(i)
            val con = conTels.getOrNullMod(i)!!
            val note = notes.getOrNullMod(i)
            val msg = createDcmMessage(RouteID.get("REQ-NSC"), message4NumberStatusChange(id, ro, num, newRo, con.con, con.tel, note), connection)
            // Send message
            try {
                connection.sendMessage(msg)
                // Emit sent message
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            Thread.sleep(interval)
        }

        // 5. Customer Record Administration - Create new record
        val edetCnt = Math.ceil(cntNewRec.toDouble() / nums.size).toInt()

        // create effective date times
        val n = LocalDateTime.now().plusDays(1)
        val times = (0 until edetCnt).map { n.plusHours(2)}

        // This time remember numbers, eds, ets, also shuffle note, con, tel to update records
        // For further testing messages.
        val records = mutableListOf<CustomerRecordInfo>()

        (0 until cntNewRec).forEach { i ->
            val connection = getActiveClient()
            val num = nums.getOrNullMod(i)!!
            val edet = times[i / nums.size]
            val (ed,et) = edAndet(edet)
            val con = conTels.getOrNullMod(i)!!
            val note = notes.getOrNullMod(i)

            val msg = createDcmMessage(RouteID.get("REQ-CRA"), message4NewRecord(id, ro, num, ed, et, note, con.con, con.tel), connection)

            // Add for further use
            records.add(CustomerRecordInfo(num, ed, et!!))

            // Send message
            try {
                connection.sendMessage(msg)
                // Emit sent message
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            Thread.sleep(interval)
        }

        // 5. Customer Record Administration - Change or Transfer
        var usedSoFar = 0
        // shuffle
        val shuffledNotes = notes.shuffled()
        val shuffledCons = conTels.shuffled()
        val shuffledRos = respOrgs.shuffled()
        (0 until cntChangeRec).forEach{ i ->
            val connection = getActiveClient()
            val (num, ed, et) = records[usedSoFar]
            val note = shuffledNotes.getOrNullMod(i)
            val newRo = shuffledRos.getOrNullMod(i)
            val con = shuffledCons.getOrNullMod(i)!!

            val msg = createDcmMessage(RouteID.get("REQ-CRA"), message4ChangeRecord(id, ro, num, ed, et, newRo, note, con.con, con.tel), connection)
            try {
                connection.sendMessage(msg)
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            usedSoFar += 1
            Thread.sleep(interval)
        }

        // 6. Disconnect customer record
        (0 until cntDisconnect).forEach {
            val connection = getActiveClient()
            val (num, ed, et) = records[usedSoFar]
            val msg = createDcmMessage(RouteID.get("REQ-CRA"), message4Disconnect(id, ro, num, ed, et), connection)
            try {
                connection.sendMessage(msg)
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            usedSoFar += 1
            Thread.sleep(interval)
        }

        // 7. Query for the status of a customer record
        (0 until cntRecStat).forEach {
            val connection = getActiveClient()
            val (num, ed, et) = records[usedSoFar]
            val msg = createDcmMessage(RouteID.get("REQ-CRQ"), message4RecStatQuery(id, ro, num, ed, et), connection)
            try {
                connection.sendMessage(msg)
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            usedSoFar += 1
            Thread.sleep(interval)
        }

        //8. Customer Record Query
        (0 until cntRecQuery).forEach {
            val connection = getActiveClient()
            val (num, ed, et) = records[usedSoFar]
            val msg = createDcmMessage(RouteID.get("REQ-CRV"), message4RecQuery(id, ro, num, ed, et), connection)
            try {
                connection.sendMessage(msg)
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            usedSoFar += 1
            Thread.sleep(interval)
        }

        //9. Query for the trouble referral number
        (0 until cntQueryTroubleNum).forEach { i ->
            val connection = getActiveClient()
            val num = nums.getOrNullMod(i)!!
            val msg = createDcmMessage(RouteID.get("REQ-TRN"), message4TroubleReferralNumber(id, ro, listOf(num)), connection)
            try {
                connection.sendMessage(msg)
                emitMessage(msg, stat) ?: return
            }catch(ex:Exception){}
            if (i < cntQueryTroubleNum - 1)
                Thread.sleep(interval)
        }
    }

    private fun emitMessage(msg:Y1DcmMsg, status:VolumeTestStatus):Int?{
        if (status.isCancelled) return null
        VolumeTester.cacheMessage(status, msg)
        return 1
    }

    fun edAndet(dt:LocalDateTime): Pair<String, String?> {
        val x = if (dt.hour >= 12)  "P" else "A"
        val hour = if (dt.hour > 12) dt.hour - 12 else dt.hour

        val ed = "${"%02d".format(dt.monthValue)}/${"%02d".format(dt.dayOfMonth)}/${"%02d".format(dt.year % 100)}"
        val et = "${"%02d".format(hour)}:${"%02d".format(dt.minute)}$x/C"
        return Pair(ed, et)
    }

    //////////////////////////////////////////////////////////////////////////////////////
    private fun message4QueryOneDial(id:String, ro:String, num:String) = "REQ-NSR:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=Q,NUM=\"$num\";"
    private fun message4SearchSpareNumbers(id:String, ro:String) = "REQ-NSR:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=S,QT=05;"
    private fun message4SearchAndReserveNumbers(id:String, ro:String) = "REQ-NSR:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=R,QT=10;"
    private fun message4NumberStatusChange(id:String, ro:String, num:String, newRo:String?= null, newContact:String? = null, newCTel:String? = null, notes:String? = null): String {
        var suffix = arrayOf(newRo?.let { "NEWRO=$it" },
                newContact?.let { "NCON=\"$it\"" },
                newCTel?.let { "CTEL=\"$it\"" },
                notes?.let{"NOTES=\"$it\""}).filterNotNull().joinToString(",")
        if (!suffix.isEmpty())
            suffix = ",$suffix"
        return "REQ-NSC:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=C,NUM=\"$num\"$suffix"
    }

    //////////////////////////////////////////////////////////////////////////
    // Create service order automatically here
    private fun message4NewRecord(id: String, ro:String, num:String, ed:String, et: String? = null, note:String?=null, ncon:String, ctel:String):String {
        val so = "S${soGenerator.nextString()}V"    // service order
        val etPart = et?.let{",ET=$it"}
        val notePart = note?.let { ",NOTE=\"$it\"" }
        return "REQ-CRA:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=N,NUM=\"$num\",ED=\"$ed\"$etPart,INTERC=\"CNT=01,0288\",INTRAC=\"CNT=01,0288\",SO=\"$so\"$notePart,NCON=\"$ncon\",CTEL=\"$ctel\":CNT6=01:ANET=\"US\":CNT9=01:TEL=\"$num\",LNS=9999;"
    }
    private fun message4ChangeRecord(id: String, ro:String, num:String, ed:String, et: String, newRo:String? = null, note:String?=null, ncon:String, ctel:String):String {
        val so = "S${soGenerator.nextString()}V"    // service order
        val notePart = note?.let { ",NOTE=\"$it\"" }
        val newRoPart = newRo?.let { ",NEWRO=$it" }
        return "REQ-CRA:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=C,NUM=\"$num\",ED=\"$ed\",ET=\"$et\",INTERC=\"CNT=01,0288\",INTRAC=\"CNT=01,0288\",SO=\"$so\"$notePart$newRoPart,NCON=\"$ncon\",CTEL=\"$ctel\":CNT6=01:ANET=\"US\":CNT9=01:TEL=\"$num\",LNS=9999;"
    }
    private fun message4Disconnect(id:String, ro:String, num:String, ed:String, et:String) = "REQ-CRA:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=D,NUM=\"$num\",ED=\"$ed\",ET=\"$et\";"
    private fun message4RecStatQuery(id:String, ro:String, num:String, ed:String, et:String) = "REQ-CRQ:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=D,NUM=\"$num\",ED=\"$ed\",ET=\"$et\";"
    private fun message4RecQuery(id:String, ro:String, num:String, ed:String, et:String) = "REQ-CRV:,${generateDateTime()}:::::ID=$id,RO=$ro,AC=D,NUM=\"$num\",ED=\"$ed\",ET=\"$et\";"
    private fun message4TroubleReferralNumber(id:String, ro:String, nums:List<String>):String {
        val qt = "%02d".format(nums.size)
        val _nums = nums.joinToString(":"){"NUM=\"$it\""}
        return "REQ-TRN:,${generateDateTime()}:::::ID=$id,RO=$ro:QT=$qt:$_nums;"
    }
    /**
     * Date / Time Generator
     */
    private fun generateDateTime():String{
        val timezone = "CST"
        val cal = Calendar.getInstance(TimeZone.getTimeZone(timezone))
        cal.time = Date()
        val year = cal.get(Calendar.YEAR)
        val month = cal.get(Calendar.MONTH) + 1
        val day = cal.get(Calendar.DATE)
        val hour = cal.get(Calendar.HOUR_OF_DAY)
        val minute = cal.get(Calendar.MINUTE)
        val second = cal.get(Calendar.SECOND)
        return "$year-${"%02d".format(month)}-${"%02d".format(day)},${"%02d".format(hour)}-${"%02d".format(minute)}-${"%02d".format(second)}-$timezone"
    }

    /**
     * Dcm Message Generator
     */
    private fun createDcmMessage(drc:String, message:String, client:SMSClient): Y1DcmMsg{
        val srcNodeName = client.sourceNodeName
        val destNodeName = client.destinationNodeName
        val uplHeader = UplHeader(
                correlationID = correlationIDGen.next(),
                sourceNodeName = "O" + srcNodeName.substring(IntRange(0, 11)),
                DRC = drc)
        val tliHeader = Y1T1iHdr(messageId = messageIDGen.next(), destNodeName = destNodeName, srcNodeName = srcNodeName)
        return Y1DcmMsg(tliHeader, Y1Upl(uplHeader, message.toByteArray()))
    }

    private fun getActiveClient():SMSClient{
        var connection = connectionManager.getActiveClient()
        while(connection == null) {
            Thread.sleep(100)   // Sleep 100 ms to wait for active conection
            connection = connectionManager.getActiveClient()
        }
        return connection
    }
}

data class CustomerRecordInfo(val num:String,val ed:String,val et:String)

typealias  Volume = VolumeTestRequest.VolumeEnum
fun Volume.requestMessageCounts():List<Int> {
    return when (this) {
        Volume._75 -> arrayListOf(6, 17, 22, 2, 20, 1, 2, 1, 3, 1)
        Volume._130 -> arrayListOf(10, 31, 40, 3, 34, 1, 3, 2, 5, 1)
        Volume._195 ->  arrayListOf(15, 45, 58, 7, 50, 2, 6, 3, 8, 1)
        Volume._260 -> arrayListOf(21, 63, 75, 8, 67, 2, 7, 5, 10, 2)
        Volume._325 -> arrayListOf(26, 75, 96, 9, 85, 3, 9, 6, 13, 3)
        Volume._390 -> arrayListOf(31, 90, 114, 12, 101, 4, 12, 7, 16, 3)
        Volume._455 -> arrayListOf(36, 106, 133, 14, 118, 4, 13, 9, 18, 4)
        Volume._520 -> arrayListOf(43, 120, 151, 15, 135, 5, 15, 10, 21, 5)
        Volume._585 -> arrayListOf(48, 135, 169, 17, 152, 7, 17, 11, 24, 5)
        Volume._650 -> arrayListOf(52, 152, 188, 19, 169, 6, 19, 13, 26, 6)
    }
}
fun Volume.count():Int = requestMessageCounts().reduce(Int::plus)

// Time Limit in milliseconds
fun Volume.timelimit():Int {
    return when  (this ){
        Volume._75 -> 60000
        Volume._130 -> 120000
        Volume._195 -> 180000
        Volume._260 -> 240000
        Volume._325 -> 300000
        Volume._390 -> 360000
        Volume._455 -> 420000
        Volume._520 -> 480000
        Volume._585 -> 540000
        Volume._650 -> 600000
    }
}

// Get element from array
fun<T> List<T>.getOrNullMod(i:Int):T?{
    return if (isEmpty()) null else get(i % size)
}

operator fun List<Int>.component6() = this[5]
operator fun List<Int>.component7() = this[6]
operator fun List<Int>.component8() = this[7]
operator fun List<Int>.component9() = this[8]
operator fun List<Int>.component10() = this[9]
