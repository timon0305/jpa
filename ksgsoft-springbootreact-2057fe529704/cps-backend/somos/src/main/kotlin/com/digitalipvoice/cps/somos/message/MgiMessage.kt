package com.digitalipvoice.cps.somos.message

import com.digitalipvoice.cps.somos.message.mgi.ApplicationMessageLexer
import com.digitalipvoice.cps.somos.message.mgi.ApplicationMessageParser
import org.antlr.v4.runtime.CharStreams
import org.antlr.v4.runtime.CommonTokenStream

typealias DateContext = ApplicationMessageParser.DateContext
typealias TimeContext = ApplicationMessageParser.TimeContext
typealias StatusContext = ApplicationMessageParser.StatusContext
typealias ParameterBlockContext = ApplicationMessageParser.ParameterBlockContext
/**
 * Defines Application MgiMessage for MGI
 */
class MgiMessage {
    var verb:String = ""
    var mod = ""
    var year = 0
    var month = 0
    var day = 0
    var hour = 0
    var minute = 0
    var second = 0
    var timezone = ""
    var data = mutableListOf<Map<String, ArrayList<DataElement>>>()

    var status_termRept = ""
    var status_errorCode = ""

    // Sequence of test message (For only REQ-TEST or RSP-TEST)
    var sequence = ""
    var testMessage = ""

    // Default constructor
    constructor(){}

    // Stringed message
    constructor(string:String){
        parse(string)
    }

    /**
     * Constructor
     * @param verb
     * @param mod
     * @param date
     * @param time
     * @param data
     * @param sequence
     * @param testMessage
     */
    @JvmOverloads constructor(
            verb:String,
            mod:String,
            date:String,
            time:String,
            data:List<Map<String, ArrayList<DataElement>>> = mutableListOf(),
            sequence:String = "",
            testMessage:String = ""
    ):this("$verb-$mod", date, time, data, sequence, testMessage)

    /**
     * Constructor
     * @param verbMod
     * @param date
     * @param time
     * @param data
     * @param sequence
     * @param testMessage
     */
    @JvmOverloads constructor(
            verbMod:String,
            date:String,
            time:String,
            data:List<Map<String, ArrayList<DataElement>>> = mutableListOf(),
            sequence:String = "",
            testMessage:String = ""
    ){
        val array = verbMod.split('-')
        this.verb = array[0]
        this.mod = array[1]
        this.year = date.slice(IntRange(0, 4)).toIntOrNull() ?: 0
        this.month = date.slice(IntRange(5, 2)).toIntOrNull() ?: 0
        this.day = date.slice(IntRange(8, 2)).toIntOrNull() ?: 0
        this.hour = time.slice(IntRange(0, 2)).toIntOrNull() ?: 0
        this.minute = time.slice(IntRange(3, 5)).toIntOrNull() ?: 0
        this.second = time.slice(IntRange(6, 8)).toIntOrNull() ?: 0
        this.timezone = time.slice(IntRange(9, 12))
        this.data = data.toMutableList()

        this.sequence = sequence
        this.testMessage = testMessage
    }

    /**
     * Only use to parse RSP, UNS Messages (Do not try to parse command messages)
     * This function will initialize all values in the object
     * Will return null if
     * @param string : String to parse
     * @returns return this on success, null on failure
     */
    fun parse(string:String): MgiMessage? {
        // Initialise values
        initValues()

        val stream = CharStreams.fromString(string)
        val lexer = ApplicationMessageLexer(stream)
        val tokenStream = CommonTokenStream(lexer)
        val parser = ApplicationMessageParser(tokenStream)
        //lexer.removeErrorListeners()
        //parser.removeErrorListeners()

        // Ignore compiler warning. Because Verbs.UNSOLICITED and Verbs.REPORT same condition
        when {
            string.startsWith(VerbMod.AppStatusInfoRetrieve) ->
            {
                this.verb = Verbs.RETRIEVE
                this.mod = Mods.AppStatusInfo
                return this
            }
            string.startsWith(VerbMod.TestCapResp)-> // RSP-TEST MgiMessage
                return parseTestCapMessage(Verbs.RESPONSE, parser)
            string.startsWith(VerbMod.TestCapReq) -> // REQ-TEST MgiMessage
                return parseTestCapMessage(Verbs.REQUEST, parser)
            string.startsWith(Verbs.REPORT) ->
                return parseUnsolicited(Verbs.REPORT, parser)
            string.startsWith(Verbs.UNSOLICITED) -> // UNS-XXX MgiMessage
                return parseUnsolicited(Verbs.UNSOLICITED, parser)
            string.startsWith(Verbs.REQUEST) -> //REQ-XXX MgiMessage
                return parseUnsolicited(Verbs.REQUEST, parser)
            string.startsWith(Verbs.RESPONSE) -> // RSP-XXX MgiMessage
                return parseResponse(parser)

            else -> return null
        }
    }

    /**
     * Render message to string
     */
    override fun toString(): String {
        val messageDataBlock = data.joinToString("") {":" + it.toMessageString()}
        val verbMod = "$verb-$mod"

        val dateTimePart = if  (verbMod != VerbMod.AppStatusInfoRetrieve) ",$year-${"%02d".format(month)}-${"%02d".format(day)},${"%02d".format(hour)}-${"%02d".format(minute)}-${"%02d".format(second)}-$timezone" else ""
        val statusPart = if (Verbs.isResponse(verb)) "$status_termRept,$status_errorCode" else ""
        val testMessageSequencePart = if (mod == Mods.TestCapabilities) sequence else ""
        val testMessageMsgPart = if (mod == Mods.TestCapabilities) ":\"$testMessage\"" else ""
        return "$verbMod:$dateTimePart::$testMessageSequencePart:$statusPart:$messageDataBlock$testMessageMsgPart;"
    }

    /**
     * Returns message Data block string
     */
    fun messageDataBlockString() =
        data.joinToString("") {":" + it.toMessageString()}

    /**
     * Parse Test Capabilities Response MgiMessage
     * @param parser Antlr4 ApplicationMessage Grammar parser
     * @returns return this on success, null on failure
     */
    private fun parseTestCapMessage(verb:String, parser: ApplicationMessageParser): MgiMessage? {
        val ctx = parser.test()
        if (ctx.EOF() == null)
            return null

        // Assume it succeed in parsing in case of EOF is parsed correctly

        // Parse values
        this.verb = verb
        mod = Mods.TestCapabilities

        // Parse date, time status
        parseCommon(ctx.date(), ctx.time(), ctx.status())
        ctx.sequence()?.text?.let {sequence = it}
        ctx.Text()?.text?.let { testMessage = it.slice(IntRange(1, it.length - 2))}   // remove quote here
        return this
    }

    /**
     * Parse Unsolicited MgiMessage
     * @param parser Antlr4 ApplicationMessage Grammar parser
     * @returns return this on success, null on failure
     */
    private fun parseUnsolicited(verb:String, parser: ApplicationMessageParser) : MgiMessage? {
        val ctx = parser.uns()
        if (ctx.EOF() == null)
            return null

        this.verb = verb
        ctx.Mod()?.text?.let { mod = it}

        // parse date & time
        parseCommon(ctx.date(), ctx.time())
        parseBlocks(ctx.block()?.parameterBlock())
        return this
    }

    /**
     *
     */
    private fun parseResponse(parser: ApplicationMessageParser): MgiMessage? {
        val ctx = parser.response()
        verb = Verbs.RESPONSE
        ctx.Mod()?.text?.let { mod = it}

        // parse date & time
        parseCommon(ctx.date(), ctx.time(), ctx.status())
        parseBlocks(ctx.block()?.parameterBlock())

        return this
    }

    /**
     * Parse common date, time, status
     * @param date
     * @param time
     * @param status
     */
    private fun parseCommon(date: DateContext?, time: TimeContext?, status: StatusContext? = null) {
        date?.year()?.text?.toIntOrNull()?.let { year = it }
        date?.month()?.text?.toIntOrNull()?.let { month = it }
        date?.day()?.text?.toIntOrNull()?.let { day = it }

        time?.hour()?.text?.toIntOrNull()?.let { hour = it}
        time?.minute()?.text?.toIntOrNull()?.let { minute = it}
        time?.second()?.text?.toIntOrNull()?.let { second = it}
        time?.timeZone()?.text?.let { timezone = it}

        status?.termRept()?.text?.let { status_termRept = it}
        status?.errorCode()?.text?.let {status_errorCode = it}
    }

    private fun parseBlocks(p: List<ParameterBlockContext>?) {
        // traverse parameters
        val paramBlock = p ?: return
        for (block in paramBlock){
            val map = mutableMapOf<String, ArrayList<DataElement>>()
            val params = block.parameter() ?: continue
            for (param in params) {
                val name = param.parameterName()?.text ?: continue
                param.parameterValue()?.let {value ->
                    // Save Identifier
                    value.Identifier()?.text?.let { push_save(map, name, DataElement(DataElement.IDENTIFIER, it)) }
                    // Save Text
                    value.Text()?.text?.let {push_save(map, name, DataElement(DataElement.TEXT, it))}    // do not un-peel double quotes. to identify type
                    // Save Decimal Number
                    value.DecimalNumber()?.text?.toIntOrNull()?.let { push_save(map, name, DataElement(DataElement.DECIMAL, it)) }
                    // Binary
                    value.BinaryData()?.text?.let {
                        // structure : $0x0x0x0xByteArray... (First Byte is '$', following 4 bytes indicate size, and bytearray)
                        val bytes = it.toByteArray()
                        if (bytes.size > 5) {
                            // Get Length
                            val len = ((bytes[1].toInt() and 0xFF) shl 24) or
                                    ((bytes[2].toInt() and 0xFF) shl 16) or
                                    ((bytes[3].toInt() and 0xFF) shl 8) or
                                    (bytes[4].toInt() and 0xFF)
                            push_save(map, name, DataElement(DataElement.BINARY, bytes.takeLast(len).toByteArray()))
                        }
                    }
                }
            }
            if (map.isNotEmpty())
                data.add(map)
        }
    }

    /**
     * Pushes value to map
     * When key for value already exists, save those as list
     * so map[nums] = {8002030303, 8002030303, 8002030303}...
     */
    private fun push_save(map: MutableMap<String, ArrayList<DataElement>>, name:String, value:DataElement) {
        val prev = map[name] ?: arrayListOf()
        prev.add(value)
        map[name] = prev
    }

    // Utility functions
    private fun initValues(){
        verb = ""
        mod = ""
        year = 0
        month = 0
        day = 0
        hour = 0
        minute = 0
        second = 0
        timezone = ""
        data = mutableListOf()

        status_termRept = ""
        status_errorCode = ""

        //Sequence of test message (For only REQ-TEST or RSP-TEST)
        sequence = ""
        testMessage = ""
    }
}

/**
 * To MgiMessage Block String of MGI MgiMessage
 */
private fun Map<String, ArrayList<DataElement>>.toMessageString(): String{
    if (isEmpty())
        return ""
    return map { entry ->
        val k = entry.key
        val v = entry.value
        v.joinToString (",") {elem ->
            when(elem.type) {
                DataElement.IDENTIFIER, DataElement.DECIMAL, DataElement.TEXT -> "$k=${elem.value}"
                DataElement.BINARY -> "$k=${((elem.value as? ByteArray) ?: byteArrayOf()).toMessageString()}"
                else -> "$k="
            }
        }
    }.joinToString (",")
}

private fun ByteArray.toMessageString():String {
    val bl = mutableListOf<Byte>()
    bl.add('$'.toByte())
    bl.add(0)       // Assume not to big
    bl.add((size and 0x00FF0000).toByte())
    bl.add((size and 0x0000FF00).toByte())
    bl.add((size and 0x000000FF).toByte())
    bl.addAll(toList())
    return String(bl.toByteArray())
}

/**
 * This function gets block value for specified key
 * */
fun MgiMessage.blockValue(key:String):List<String> {
    val result = mutableListOf<String>()
    for(map in data) {
        val elements = map[key] ?: continue
        result.addAll(elements.map {
            var str = it.value.toString()
            if (str.startsWith("\"")){
               str = str.replace("\"", "")
            }
            return@map str.trim()
        })
    }
    return result
}

/**
 * Get keys pair of keys
 * Suitable for messages like
 * RSP-MNQ:,2010-06-10,12-02-01-CST:::COMPLD,00::ID=XXXXX101, RO=XXXX1:QT=00000004:NUM="8007671111 ",LACT="02/01/10",RU="07/01/10",SE="06/01/ 10",STAT=" RESERVE",CRO=XXXX1, NCON="MY NAME", CTEL="7326002111", NOTES="IMPORTANT NOTE":
NUM="8007671112 ",LACT="02/01/10", STAT="SPARE ": NUM="8007671113 ",DU="07/01/10",SE="06/01/10", STAT="DISCONN",CRO=XXXX1, NCON="OTHER NAME",CTEL="7326002113",NOTES="OTHER NOTE":NUM="8667671234 ",STAT="WORKING",CRO=YYYY1;
 So in this message, (NUM, LACT, RU, SE, STAT< CRO, NCON, CTEL, NOTES) appears in one block.
 Not all parameters are present in one block, so in this case can't use blockValue for single key.
 This is the reason that function below exists.

 */
fun MgiMessage.blockValue(keys:Iterable<String>): List<Map<String, String>> {
    val result = mutableListOf<Map<String, String>>()
    for (map in data) {
        val mutableMap = mutableMapOf<String, String>()
        for (key in keys) {
            // Put if exists
            map[key]?.firstOrNull()?.let {
                var str = it.value.toString()
                if (str.startsWith("\"")){
                    str = str.replace("\"", "")
                }
                return@let str.trim()
            }?.let { mutableMap[key] = it }
        }
        // if any of key is present. then add this to result
        if (mutableMap.isNotEmpty())
            result.add(mutableMap)
    }
    return result
}