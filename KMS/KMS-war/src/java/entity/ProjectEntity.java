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
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
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
public class ProjectEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @Enumerated(EnumType.STRING)
    private ProjectStatusEnum status;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date dateCreated;
    
    @NotNull
    @Column(nullable=false)
    private String country;
    
    @Lob
    private String profilePicture;
    
    private Double monetaryFundingRequired;
    
    private Double monetaryFundingObtained;
    
    private String paypalMerchantId;
    
    @ManyToOne
    private UserEntity projectOwner;

    @JoinTable(name = "projectMembers")
    @ManyToMany(mappedBy="projectsJoined")
    private List<UserEntity> projectMembers;
    
    @JoinTable(name = "projectAdmins")
    @ManyToMany(mappedBy="projectsManaged")
    private List<UserEntity> projectAdmins;
    
    @OneToMany(mappedBy = "project")
    private List<ActivityEntity> activities;

    @OneToMany(mappedBy = "project")
    private List<HumanResourcePostingEntity> humanResourcePostings;
    
    @OneToMany(mappedBy = "project")
    private List<MaterialResourcePostingEntity> materialResourcePostings;
    
    @OneToMany(mappedBy = "project")
    private List<TaskEntity> tasks;
    
    @OneToMany(mappedBy = "project")
    private List<PostEntity> posts;
    
    @ManyToMany
    private List<TagEntity> sdgs;

    @OneToMany(mappedBy = "project")
    private List<ReviewEntity> reviews;

    @OneToMany(mappedBy = "project")
    private List<DonationEntity> donations;
    
    private Boolean isActive;

    public ProjectEntity() {
        this.projectMembers = new ArrayList<>();
        this.activities = new ArrayList<>();
        this.humanResourcePostings = new ArrayList<>();
        this.materialResourcePostings = new ArrayList<>();
        this.projectAdmins = new ArrayList<>();
        this.tasks = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.status = ProjectStatusEnum.ACTIVE;
        this.monetaryFundingObtained = 0.0;
        this.sdgs = new ArrayList<>();
        this.donations = new ArrayList<>();
    }

    public ProjectEntity(String name, String description, Date dateCreated, String country, String profilePicture, Double monetaryFundingRequired, String paypalMerchantId) {
        this();
        this.name = name;
        this.description = description;
        this.dateCreated = dateCreated;
        this.country = country;
        this.profilePicture = profilePicture;
        this.monetaryFundingRequired = monetaryFundingRequired;
        this.paypalMerchantId = paypalMerchantId;
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

    public UserEntity getProjectOwner() {
        return projectOwner;
    }

    public void setProjectOwner(UserEntity projectOwner) {
        this.projectOwner = projectOwner;
    }

    public List<UserEntity> getProjectMembers() {
        return projectMembers;
    }

    public void setProjectMembers(List<UserEntity> projectMembers) {
        this.projectMembers = projectMembers;
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

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public List<ActivityEntity> getActivities() {
        return activities;
    }

    public void setActivities(List<ActivityEntity> activities) {
        this.activities = activities;
    }

    public List<HumanResourcePostingEntity> getHumanResourcePostings() {
        return humanResourcePostings;
    }

    public void setHumanResourcePostings(List<HumanResourcePostingEntity> humanResourcePostings) {
        this.humanResourcePostings = humanResourcePostings;
    }

    public List<MaterialResourcePostingEntity> getMaterialResourcePostings() {
        return materialResourcePostings;
    }

    public void setMaterialResourcePostings(List<MaterialResourcePostingEntity> materialResourcePostings) {
        this.materialResourcePostings = materialResourcePostings;
    }

    public List<TaskEntity> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskEntity> tasks) {
        this.tasks = tasks;
    }

    public ProjectStatusEnum getStatus() {
        return status;
    }

    public void setStatus(ProjectStatusEnum status) {
        this.status = status;
    }

    public List<ReviewEntity> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewEntity> reviews) {
        this.reviews = reviews;
    }
    
    

    public List<UserEntity> getProjectAdmins() {
        return projectAdmins;
    }

    public void setProjectAdmins(List<UserEntity> projectAdmins) {
        this.projectAdmins = projectAdmins;
    }

    public List<PostEntity> getPosts() {
        return posts;
    }

    public void setPosts(List<PostEntity> posts) {
        this.posts = posts;
    }

    public List<TagEntity> getSdgs() {
        return sdgs;
    }

    public void setSdgs(List<TagEntity> sdgs) {
        this.sdgs = sdgs;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public List<DonationEntity> getDonations() {
        return donations;
    }

    public void setDonations(List<DonationEntity> donations) {
        this.donations = donations;
    }

    public String getPaypalMerchantId() {
        return paypalMerchantId;
    }

    public void setPaypalMerchantId(String paypalMerchantId) {
        this.paypalMerchantId = paypalMerchantId;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    
    
}
