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
public class Project implements Serializable {

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
    private User user;
    
    @ManyToMany
    private List<User> contributors;
    
    private Double monetaryFundingRequired;
    private Double monetaryFundingObtained;
    
    @OneToMany(mappedBy = "project")
    private List<Activity> activities;

    @OneToMany(mappedBy = "project")
    private List<HumanResourcePosting> humanResourcePostings;

    @OneToMany(mappedBy = "project")
    private List<MaterialResourcePosting> materialResourcePostings;

    @OneToMany
    private List<Task> tasks;

    public Project() {
        this.contributors = new ArrayList<>();
    }

    public Project(String name, String description, User user, Double monetaryFundingRequired, Double monetaryFundingObtained) {
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
        if (!(object instanceof Project)) {
            return false;
        }
        Project other = (Project) object;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<User> getContributors() {
        return contributors;
    }

    public void setContributors(List<User> contributors) {
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
