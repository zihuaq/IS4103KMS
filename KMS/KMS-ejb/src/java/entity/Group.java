/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class Group implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    private String country;
    
    private String profilePicture;
    
    @ManyToOne
    private User groupOwner;
    
    @ManyToMany
    private List<User> users;
    
    public Group() {
        users = new ArrayList<>();
    }

    public Group(String name, String country, String profilePicture) {
        this();
        this.name = name;
        this.country = country;
        this.profilePicture = profilePicture;
    }
    

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (groupId != null ? groupId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the groupId fields are not set
        if (!(object instanceof Group)) {
            return false;
        }
        Group other = (Group) object;
        if ((this.groupId == null && other.groupId != null) || (this.groupId != null && !this.groupId.equals(other.groupId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Group[ id=" + groupId + " ]";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public User getGroupOwner() {
        return groupOwner;
    }

    public void setGroupOwner(User groupOwner) {
        this.groupOwner = groupOwner;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
    
}
