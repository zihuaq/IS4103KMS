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
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

/**
 *
 * @author zeplh
 */
@Entity
public class AwardEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long awardId;
    
    @ManyToOne
    private ProjectEntity project;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @NotNull
    @Column(nullable=false)
    private String description;
    
    @Lob
    @Column
    private String awardPicture;
    
    @JoinTable(name = "receivedAwards")
    @ManyToMany(mappedBy = "receivedAwards")
    private List<UserEntity> usersReceived;

    public AwardEntity() {
    }
    

    public AwardEntity(ProjectEntity project, String name, String description, String awardPicture) {
        this.project = project;
        this.name = name;
        this.description = description;
        this.awardPicture = awardPicture;
        this.usersReceived = new ArrayList<>();
    }
    
    

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAwardPicture() {
        return awardPicture;
    }

    public void setAwardPicture(String awardPicture) {
        this.awardPicture = awardPicture;
    }

    public List<UserEntity> getUsersReceived() {
        return usersReceived;
    }

    public void setUsersReceived(List<UserEntity> usersReceived) {
        this.usersReceived = usersReceived;
    }
    

    public Long getAwardId() {
        return awardId;
    }

    public void setAwardId(Long id) {
        this.awardId = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (awardId != null ? awardId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof AwardEntity)) {
            return false;
        }
        AwardEntity other = (AwardEntity) object;
        if ((this.awardId == null && other.awardId != null) || (this.awardId != null && !this.awardId.equals(other.awardId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.AwardEntity[ id=" + awardId + " ]";
    }
    
}
