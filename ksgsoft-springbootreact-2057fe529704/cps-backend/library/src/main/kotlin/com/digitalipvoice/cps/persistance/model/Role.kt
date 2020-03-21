package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableId
import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

/**
 * Role - Defines user role
 */
@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name="role")
class Role(var role:String = "",
           var roleDescription:String = ""): AuditableId() {
    @ManyToMany(mappedBy = "roles")
    @JsonIgnore
    val users:Set<User> = hashSetOf()

    @ManyToMany
    @JoinTable(
            name="role_privileges",
            joinColumns = [JoinColumn(
                    name = "role_id", referencedColumnName = "id")],
            inverseJoinColumns = [JoinColumn(
                    name = "privilege_id", referencedColumnName = "id")])
    var privileges:Set<Privilege> = hashSetOf()

    override fun equals(other: Any?): Boolean {
        return (other as? Role)?.role == role
    }

    override fun hashCode(): Int {
        return super.hashCode() * 31 + role.hashCode() * 31 + roleDescription.hashCode() * 31
    }

    companion object {
        const val SuperAdminRoleName = "ROLE_SUPER_ADMIN"
    }

    fun isSuperAdminRole(): Boolean {
        return role == SuperAdminRoleName
    }
}