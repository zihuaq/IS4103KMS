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
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class ProjectEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    private String description;
    
    // Status enumeration
    
    @ManyToOne
    private UserEntity user;
    
    @ManyToMany
    private List<UserEntity> contributors;
    
    private Double monetaryFundingRequired;
    private Double monetaryFundingObtained;
    
    @OneToMany(mappedBy = "project")
    private List<ActivityEntity> activities;

    @OneToMany(mappedBy = "project")
    private List<HumanResourcePostingEntity> humanResourcePostings;
    
    @OneToMany(mappedBy = "project")
    private List<MaterialResourcePostingEntity> materialResourcePostings;
    
    @OneToMany
    private List<TaskEntity> tasks;

    public ProjectEntity() {
        this.contributors = new ArrayList<>();
    }

    public ProjectEntity(String name, String description, UserEntity user, Double monetaryFundingRequired, Double monetaryFundingObtained) {
        this();
        this.name = name;
        this.description = description;
        this.user = user;
        this.monetaryFundingRequired = monetaryFundingRequired;
        this.monetaryFundingObtained = monetaryFundingObtained;
    }    

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (projectId != null ? projectId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the projectId fields are not set
        if (!(object instanceof ProjectEntity)) {
            return false;
        }
        ProjectEntity other = (ProjectEntity) object;
        if ((this.projectId == null && other.projectId != null) || (this.projectId != null && !this.projectId.equals(other.projectId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Project[ id=" + projectId + " ]";
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

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<UserEntity> getContributors() {
        return contributors;
    }

    public void setContributors(List<UserEntity> contributors) {
        this.contributors = contributors;
    }

    public Double getMonetaryFundingRequired() {
        return monetaryFundingRequired;
    }

    public void setMonetaryFundingRequired(Double monetaryFundingRequired) {
        this.monetaryFundingRequired = monetaryFundingRequired;
    }

    public Double getMonetaryFundingObtained() {
        return monetaryFundingObtained;
    }

    public void setMonetaryFundingObtained(Double monetaryFundingObtained) {
        this.monetaryFundingObtained = monetaryFundingObtained;
    }
    
}
