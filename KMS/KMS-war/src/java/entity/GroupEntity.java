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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class GroupEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    private String country;
    
    private String profilePicture;
    
    @ManyToOne
    private UserEntity groupOwner;
    
    @ManyToMany
    @JoinTable(name= "groupMembers")
    private List<UserEntity> groupMembers;
    
    @ManyToMany
    @JoinTable(name= "groupAdmins")
    private List<UserEntity> groupAdmins;
    
    @ManyToMany
    private List<TagEntity> sdgs;
    
    public GroupEntity() {
        groupMembers = new ArrayList<>();
        groupAdmins = new ArrayList<>();
    }

    public GroupEntity(String name, String country, String profilePicture) {
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
        if (!(object instanceof GroupEntity)) {
            return false;
        }
        GroupEntity other = (GroupEntity) object;
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

    public UserEntity getGroupOwner() {
        return groupOwner;
    }

    public void setGroupOwner(UserEntity groupOwner) {
        this.groupOwner = groupOwner;
    }

    public List<UserEntity> getGroupMembers() {
        return groupMembers;
    }

    public void setGroupMembers(List<UserEntity> groupMembers) {
        this.groupMembers = groupMembers;
    }

    public List<UserEntity> getGroupAdmins() {
        return groupAdmins;
    }

    public void setGroupAdmins(List<UserEntity> groupAdmins) {
        this.groupAdmins = groupAdmins;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<TagEntity> getSdgs() {
        return sdgs;
    }

    public void setSdgs(List<TagEntity> sdgs) {
        this.sdgs = sdgs;
    }
    
}
