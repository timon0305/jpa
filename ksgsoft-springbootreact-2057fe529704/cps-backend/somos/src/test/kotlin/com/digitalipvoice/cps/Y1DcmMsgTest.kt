package com.digitalipvoice.cps

import com.digitalipvoice.cps.components.CorrelationIDGen
import com.digitalipvoice.cps.components.MessageIdGen
import com.digitalipvoice.cps.somos.message.*
import org.junit.Assert
import org.junit.Test

/**
 * Test class for Y1DcmMsg
 */
class Y1DcmMsgTest{
    private val messageIdGen = MessageIdGen()
    private val correlationIDGen = CorrelationIDGen()

    @Test
    fun testWithUpl(){
        val msg = "RSP-NSC:,2003-03-28,12-02-01-CST:::COMPLD,00::ID=XXXXX101,RO=XXXX1:QT=00000012:NUML=\\\"8005601111,8005601112,8005601113,8005601114,8005601115,8005601116,8005601117,8005601118,8005601119,8005601120,8005601121,8005601122\\\";"
        val uplHeader = UplHeader(correlationID = correlationIDGen.next(), sourceNodeName = "SRC_NODENAME", DRC = "RSR")
        val upl = Y1Upl(uplHeader, msg.toByteArray())

        val dcmMsg = Y1DcmMsg(
                Y1T1iHdr(1, 0, messageIdGen.next(), "DEST_NODENAME", "SRC_NODENAME", ErrorCode.BAD_DESTINATION, MessageCode.DATA),
                upl
        )

        val bytes = dcmMsg.toSequence().toByteArray()
        val decodedMsg = Y1DcmMsg(Y1DcmMsg.parseSequence.fromByteArray(bytes))

        // Compare contents of messages
        Assert.assertEquals(decodedMsg.t1iHdr, dcmMsg.t1iHdr)
        Assert.assertEquals(decodedMsg.data!!.header, dcmMsg.data!!.header)
        Assert.assertEquals(decodedMsg.data!!.data.size, dcmMsg.data!!.data.size)
        Assert.assertEquals(String(decodedMsg.data!!.data), String(dcmMsg.data!!.data))
    }

    @Test
    fun testWithoutUpl(){
        val dcmMsg = Y1DcmMsg(Y1T1iHdr(1, 0, messageIdGen.next(), "DEST_NODENAME", "SRC_NODENAME", ErrorCode.BAD_DESTINATION, MessageCode.GOOD_BYE))
        val bytes = dcmMsg.toSequence().toByteArray()
        val decodedMsg = Y1DcmMsg(Y1DcmMsg.parseSequence.fromByteArray(bytes))
        // Compare contents of messages
        Assert.assertEquals(decodedMsg.t1iHdr, dcmMsg.t1iHdr)
    }
}