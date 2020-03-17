package com.archil.persistance.model

import com.archil.configuration.AuditableId
import org.hibernate.annotations.NaturalId
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import javax.persistence.*

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name="user")
class User(
        @NaturalId
        @Column(unique = true, nullable = false)
        var username:String = "",
        @Column(length = 255)
        var password:String = ""): AuditableId() {
    @ManyToMany
    @JoinTable(
            name = "user_role",
            joinColumns = [JoinColumn(name="user_id", referencedColumnName = "id")],
            inverseJoinColumns = [JoinColumn(name="role_id", referencedColumnName = "id")])
    var roles:Set<Role> = hashSetOf()
    var isActive = true     // Check if is active

    var firstName = ""
    var lastName = ""


    val isSuperAdmin: Boolean
        get() = (username == SuperAdminUsername)


    // Super admin name. Unchanged forever.
    companion object {
        const val SuperAdminUsername = "sadmin@example.com"
    }
}