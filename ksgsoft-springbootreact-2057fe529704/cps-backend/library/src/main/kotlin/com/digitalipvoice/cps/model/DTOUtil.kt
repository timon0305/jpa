package com.digitalipvoice.cps.model

import com.digitalipvoice.cps.client.admin.models.NotificationDTO
import com.digitalipvoice.cps.client.admin.models.RoleDTO
import com.digitalipvoice.cps.client.admin.models.VersionLogDTO
import com.digitalipvoice.cps.persistance.model.Notification
import com.digitalipvoice.cps.persistance.model.Role
import com.digitalipvoice.cps.persistance.model.VersionLog
import com.digitalipvoice.cps.utils.toISO8601Format

fun VersionLog.toDTO(): VersionLogDTO {
    val result = VersionLogDTO()
    result.version = version
    result.description = description
    return result
}

fun Notification.toDTO(): NotificationDTO {
    val dto = NotificationDTO()
    dto.type = type
    dto.description = description
    dto.time = createdAt.toISO8601Format()
    return dto
}

fun Role.toDTO(): RoleDTO {
    val dto = RoleDTO()
    dto.id = id
    dto.name = role
    dto.description = roleDescription
    dto.privileges = privileges.map { it.name }
    return dto
}