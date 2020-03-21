package com.digitalipvoice.cps.somos.message

/**
 * Good Day MgiMessage
 */
class GDMessage(srcNodeName:String,
                destNodeName:String,
                messageId:String):
        Y1DcmMsg(srcNodeName = srcNodeName,
                destNodeName = destNodeName,
                messageId = messageId,
                messageCode = MessageCode.GOOD_DAY)

/**
 * Good Night MgiMessage
 */
class GNMessage(srcNodeName:String,
                destNodeName:String,
                messageId:String):
        Y1DcmMsg(srcNodeName = srcNodeName,
                destNodeName = destNodeName,
                messageId = messageId,
                messageCode = MessageCode.GOOD_NIGHT)

/**
 * Good Bye MgiMessage
 */
class GBMessage(srcNodeName:String,
                destNodeName:String,
                messageId:String):
        Y1DcmMsg(srcNodeName = srcNodeName,
                destNodeName = destNodeName,
                messageId = messageId,
                messageCode = MessageCode.GOOD_BYE)