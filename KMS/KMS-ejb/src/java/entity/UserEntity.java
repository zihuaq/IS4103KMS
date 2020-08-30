/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.security.CryptographicHelper;

/**
 *
 * @author Jeremy
 */
@Entity
public class UserEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @NotNull
    @Column(nullable=false)
    private String firstName;
    @NotNull
    @Column(nullable=false)
    private String lastName;
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date dob;
    @NotNull
    @Column(nullable=false)
    private String gender;
    @NotNull
    @Column(nullable=false, unique = true)
    private String email;
    @NotNull
    @Column(nullable=false)
    private String password;
    private String salt;
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date joinedDate;
    @Column(nullable=false)
    private Boolean isAdmin;
    @Temporal(TemporalType.DATE)
    private Date adminStartDate;

    public UserEntity() {
        this.salt = CryptographicHelper.getInstance().generateRandomString(32);
        this.isAdmin = Boolean.FALSE;
    }

    public UserEntity(String firstName, String lastName, Date dob, String gender, String email, String password, Date joinedDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.joinedDate = joinedDate;
    }
    
        
    
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (userId != null ? userId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the userId fields are not set
        if (!(object instanceof UserEntity)) {
            return false;
        }
        UserEntity other = (UserEntity) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.UserEntity[ id=" + userId + " ]";
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        if(password != null) {
            this.password = CryptographicHelper.getInstance().byteArrayToHexString(CryptographicHelper.getInstance().doMD5Hashing(password + this.salt));
        }
        else {
            this.password = null;
        }
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Date getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(Date joinedDate) {
        this.joinedDate = joinedDate;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public Date getAdminStartDate() {
        return adminStartDate;
    }

    public void setAdminStartDate(Date adminStartDate) {
        this.adminStartDate = adminStartDate;
    }
    
}
