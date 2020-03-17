package com.archil.persistance.model

import com.archil.configuration.AuditableId
import com.fasterxml.jackson.annotation.JsonIgnore
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.Entity
import javax.persistence.EntityListeners
import javax.persistence.ManyToMany
import javax.persistence.Table

/**
 * Privilege - Defines User Privilege. Roles can have privileges
 */
@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "privilege")
class Privilege(var name: String = "") : AuditableId() {
    @ManyToMany(mappedBy = "privileges")
    @JsonIgnore
    var roles: Set<Role> = hashSetOf()

    override fun equals(other: Any?): Boolean {
        return (other as? Privilege)?.name == name
    }

    override fun hashCode(): Int {
        return super.hashCode() * 31 + name.hashCode() * 31
    }

    // Constants defining privileges
    companion object {
        // Back-end
        const val Dashboard = "MENU_DASHBOARD"               // DASHBOARD MENU
    }
}