/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.enumeration.ProjectStatusEnum;

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
    
    private ProjectStatusEnum status;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date startDate;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date endDate;
    
    @NotNull
    @Column(nullable=false)
    private String country;
    
    @NotNull
    @Column(nullable=false)
    private String location;
    
    @ManyToOne
    private User owner;
    
    @ManyToMany
    private List<User> contributors;
    
    @ManyToMany
    private List<User> admins;
    
    private Double monetaryFundingRequired;
    private Double monetaryFundingObtained;
    
    @OneToMany(mappedBy = "project")
    private List<Activity> activities;

    @OneToMany(mappedBy = "project")
    private List<HumanResourcePosting> humanResourcePostings;
    
    @OneToMany(mappedBy = "project")
    private List<MaterialResourcePosting> materialResourcePostings;
    
    @OneToMany(mappedBy = "project")
    private List<Task> tasks;
    
    @OneToMany(mappedBy = "project")
    private List<Post> posts;

    public Project() {
        this.contributors = new ArrayList<>();
        this.activities = new ArrayList<>();
        this.humanResourcePostings = new ArrayList<>();
        this.materialResourcePostings = new ArrayList<>();
        this.admins = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.status = ProjectStatusEnum.NOTSTARTED;
    }

    public Project(Long projectId, String name, String description, Date startDate, Date endDate, String country, String location, User user, Double monetaryFundingRequired, Double monetaryFundingObtained) {
        this();
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.country = country;
        this.location = location;
        this.owner = user;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
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

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }

    public List<HumanResourcePosting> getHumanResourcePostings() {
        return humanResourcePostings;
    }

    public void setHumanResourcePostings(List<HumanResourcePosting> humanResourcePostings) {
        this.humanResourcePostings = humanResourcePostings;
    }

    public List<MaterialResourcePosting> getMaterialResourcePostings() {
        return materialResourcePostings;
    }

    public void setMaterialResourcePostings(List<MaterialResourcePosting> materialResourcePostings) {
        this.materialResourcePostings = materialResourcePostings;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public ProjectStatusEnum getStatus() {
        return status;
    }

    public void setStatus(ProjectStatusEnum status) {
        this.status = status;
    }

    public List<User> getAdmins() {
        return admins;
    }

    public void setAdmins(List<User> admins) {
        this.admins = admins;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
    
}
