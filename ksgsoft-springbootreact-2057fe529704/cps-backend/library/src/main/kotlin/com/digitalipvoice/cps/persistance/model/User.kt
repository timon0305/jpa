package com.digitalipvoice.cps.persistance.model

import com.digitalipvoice.cps.configuration.AuditableId
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

    @Column(unique = true)
    var email = ""
    var firstName = ""
    var lastName = ""

    @OneToOne(mappedBy = "user", fetch=FetchType.LAZY, orphanRemoval = true)
    var profile: UserProfile? = null
    set(value) {
        field?.user = this
        if (value == null) {
            if (field != null) {
                field!!.user = null
            }
        } else {
            value.user = this
        }
        field = value
    }

    @OneToMany(
            mappedBy = "user",
            cascade = [CascadeType.ALL],
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    var ips:List<UserIP> = listOf()

    @OneToOne(mappedBy = "user", fetch=FetchType.LAZY, orphanRemoval = true)
    var idro: UserIDRO? = null
        set(value) {
            field?.user = this
            if (value == null) {
                if (field != null) {
                    field!!.user = null
                }
            } else {
                value.user = this
            }
            field = value
        }

    val isSuperAdmin: Boolean
        get() = (username == SuperAdminUsername)


    // Super admin name. Unchanged forever.
    companion object {
        const val SuperAdminUsername = "sadmin"
    }
}