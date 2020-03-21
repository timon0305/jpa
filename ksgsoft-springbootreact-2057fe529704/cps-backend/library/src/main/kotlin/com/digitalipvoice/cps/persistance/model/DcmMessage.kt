package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableBaseId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name="dcm_message")
class DcmMessage: AuditableBaseId() {
    var version: Int = 1
    var priority: Int = 0

    @Column(length = 12)
    var messageTag = ""

    @Column(length = 51)
    var destinationNodeName = ""

    @Column(length = 51)
    var sourceNodeName = ""

    var errorCode: Byte = 0

    var messageCode: Int = 0

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sms_message_id", insertable = false, updatable = false, foreignKey = ForeignKey(name = "fk_dcm_message_to_sms_message", foreignKeyDefinition = "FOREIGN KEY (`sms_message_id`) REFERENCES `sms_message`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"))
    var smsMessage: SMSMessage? = null

    @Column(name = "sms_message_id")
    var smsMessageId: Long? = null
}