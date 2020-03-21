package com.digitalipvoice.cps

import com.digitalipvoice.cps.somos.message.MgiMessage
import org.junit.Assert
import org.junit.Test

/**
 * Test case for MgiMessage Read & Parse
 */
class MgiMessageTest {
    @Test
    fun testParse(){
        val messages = arrayOf(
                "RSP-NSC:,2003-03-28,12-02-01-CST:::COMPLD,00::ID=XXXXX101,RO=XXXX1:QT=00000012:NUML=\"8005601111,8005601112,8005601113,8005601114,8005601115,8005601116,8005601117,8005601118,8005601119,8005601120,8005601121,8005601122\";"
                ,"RSP-NSC:,2003-03-28,12-02-01-CST:::COMPLD,11::ID=XXXXX101,RO=XXXX1:QT=00000012:NUML=\"8005601111,8005601112,8005601113,8005601114,8005601115,8005601116,8005601117,8005601118,8005601119,8005601120,8005601121,8005601122\":ECNT=00000002:ERRV=\"06,1,8001231234\",ERRV=\"06,1,8001231235\";"
                ,"RSP-NSC:,2003-03-28,12-02-01-CST:::DENIED,01::ID=XXXXX101,RO=XXXX1:ECNT=00000002:ERRV=\"03,0,NCON\",ERRV=\"50\";"
                ,"RSP-NSC:,2003-03-28,12-02-01-CST:::DENIED,01::ID=XXXXX101,RO=XXXX1:ECNT=00000002:ERRV=\"06,1,8001231234\",ERRV=\"06,1,8001231235\";"
                ,"UNS-RSV:,2005-04-04,11-42-11-CST:::::RO=BRX01:CNT=03:NUM=\"8775551234\",NUM=\"8775550002\",NUM=\"8775550003\";"
                ,"REQ-TEST:,2018-08-21,08-20-29-EDT::S10001:::\"TEST DATAAPPL\";"
                ,"RSP-TEST:,2018-08-21,08-20-29-EDT::S10001:COMPLD,00::\"TEST DATAAPPL\";"
                ,"REPT-ASI:,2018-08-21,08-20-29-EDT:::::VERS=1;"
                ,"REQ-MNQ:,2010-12-25,11-02-01-CST:::::ID=XXXXX101,RO=XXXX1 :QT=3:NUML=\"8007671111,8887671112,8887671113\";"
                ,"RTRV-ASI::::::;")

        messages.forEach {
            val msg = MgiMessage(it)
            val converted = msg.toString()
            System.out.println(converted)
            Assert.assertEquals(converted, MgiMessage(converted).toString())
        }
    }

    /**
     * Test for serialize / deserialize jackson data bind
     * // This test will fail as bytes are encoded as base64 array. but that's ok.
     */
    /*
    @Test
    fun testJacksonSerialization(){
        val message = "RSP-NSC:,2003-03-28,12-02-01-CST:::COMPLD,00::ID=XXXXX101,RO=XXXX1:QT=00000012:NUML=\"8005601111,8005601112,8005601113,8005601114,8005601115,8005601116,8005601117,8005601118,8005601119,8005601120,8005601121,8005601122\";"
        val msg = MgiMessage(message)

        // Add byte array test,
        // This test will fail as bytes are encoded as base64 array. but that's ok.
        msg.data.add(mapOf("BYTES" to arrayListOf(DataElement(DataElement.BINARY, byteArrayOf(0, 1, 2, 3, 4, 5, 10, 0)))))

        val mapper = ObjectMapper()
        val serialized  = mapper.writeValueAsString(msg.data)

        val data = SMSMessage.deserializeData(serialized)
        val serialized2 = mapper.writeValueAsString(data)
        Assert.assertEquals(serialized, serialized2)
    }
    */
}

