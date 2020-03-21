package com.digitalipvoice.cps.somos.message

import com.turkcelltech.jac.OctetString
import com.turkcelltech.jac.Sequence

/**
 * Represents UPL (UAL) Header / Data
 */
class Y1Upl @JvmOverloads constructor(var header: UplHeader = UplHeader(), var data:ByteArray = byteArrayOf()) : ISequenceConvertible{

    @Throws(Exception::class)
    fun toByteArray() = toSequence().toByteArray()

    override fun toSequence() =
            Sequence("dataAppl").apply {
                addElement(header.toBerNode())
                addElement(OctetString("upl", data))
            }

    @Throws(Exception::class)
    constructor(sequence: Sequence):this(
            UplHeader(sequence.get(0) as OctetString),
            (try { (sequence.get(1) as? OctetString)?.value } catch(ex:Exception) { null }) ?: ByteArray(0)
    )

    /**
     * Parse data string as MgiMessage
     * @return Parsed MGI Message or null if failed
     */
    fun toMgiMessage(): MgiMessage? = MgiMessage().parse(String(data))

    override fun toString() = "(header => $header\n, data => ${String(data)}"

    /**
     * Static functions
     */
    companion object {
        /**
         * Returns Initial Sequence for decoding
         */
        val parseSequence:Sequence
            get() = Sequence().apply {
                addElement(OctetString("uplHeader"))
                addElement(OctetString("upl"))
            }
    }
    /**
     * Static functions
     */
    /*
    companion object {
        /**
         * Create Y1Upl object from byte array
         * This function parse header & data Appl
         */
        fun from(value: ByteArray): Y1Upl? {
            if (value.size < UplHeader.HEADER_SIZE)
                return null

            val confirmationFlag = value[0].toInt()
            val

            value.takePadding(UplHeader.HEADER_SIZE)
        }
    }*/
}