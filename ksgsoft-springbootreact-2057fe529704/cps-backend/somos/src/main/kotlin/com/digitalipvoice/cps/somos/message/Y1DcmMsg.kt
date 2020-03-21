package com.digitalipvoice.cps.somos.message

import com.turkcelltech.jac.OctetString
import com.turkcelltech.jac.Sequence
import java.io.IOException

/**
 * Basic MgiMessage Class
 */
open class Y1DcmMsg @JvmOverloads constructor(var t1iHdr: Y1T1iHdr, var data:Y1Upl? = null): ISequenceConvertible {
    @JvmOverloads constructor(
            priority:Long = 0,
            messageId:String = "",
            destNodeName:String = "",
            srcNodeName:String = "",
            errorCode: ErrorCode = ErrorCode.NO_ERROR,
            messageCode: MessageCode = MessageCode.DATA,
            data: Y1Upl? = null):this(Y1T1iHdr(1L, priority, messageId, destNodeName, srcNodeName, errorCode, messageCode),  data)

    override fun toSequence() =
            Sequence().apply {
                addElement(t1iHdr.toSequence())
                addElement(OctetString("dataAppl", data?.toByteArray() ?: byteArrayOf()))
            }

    override fun toString() =
            StringBuilder().append("Y1DcmMsg=>\n")
                    .append("header=>$t1iHdr\n")
                    .append("dataAppl=>${data?.toString()}\n")
                    .toString()

    @Throws(IOException::class)
    constructor(sequence:Sequence):this(Y1T1iHdr(sequence.get(0) as Sequence)){
        val bytes = (sequence.get(1) as? OctetString)?.value ?: byteArrayOf()
        if (bytes.size < 0)
            return      // data is null
        data = try { Y1Upl(Y1Upl.parseSequence.fromByteArray(bytes)) } catch (ex:Exception) { null }
    }

    companion object {
        val parseSequence:Sequence
            get()  = Y1DcmMsg().toSequence()
    }
}