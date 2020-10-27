/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.enumeration.ActivityStatusEnum;

/**
 *
 * @author zeplh
 */
@Entity
public class ActivityEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;    
    
    @NotNull
    @Column(nullable=false)
    private Double latitude;
    
    @NotNull
    @Column(nullable=false)
    private Double longitude;
 
    @NotNull
    @Column(nullable=false)
    private String description;
    
    @NotNull
    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private ActivityStatusEnum activityStatus;
    
    private HashMap<Long, Double> allocatedQuantities;
    
    @ManyToOne
    @JoinColumn
    private ProjectEntity project;
    
    @OneToMany(mappedBy = "activity")
    private List<HumanResourcePostingEntity> humanResourcePostings;
    
    @JoinTable(name = "allocatedMrps")
    @ManyToMany(mappedBy = "activities")
    private List<MaterialResourcePostingEntity> materialResourcePostings;
    
    @JoinTable(name = "activityJoined")
    @ManyToMany(mappedBy = "activityJoined")
    private List<UserEntity> joinedUsers;
    
    public ActivityEntity() {
        this.allocatedQuantities = new HashMap<>();
        this.humanResourcePostings = new ArrayList<>();
        this.materialResourcePostings = new ArrayList<>();
        this.joinedUsers = new ArrayList<>();
    }

    public ActivityEntity(String name, Date startDate, Date endDate, Double latitude, Double longitude, String description, ActivityStatusEnum activityStatus) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.activityStatus = activityStatus;
    } 

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (activityId != null ? activityId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the activityId fields are not set
        if (!(object instanceof ActivityEntity)) {
            return false;
        }
        ActivityEntity other = (ActivityEntity) object;
        if ((this.activityId == null && other.activityId != null) || (this.activityId != null && !this.activityId.equals(other.activityId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Activity[ id=" + activityId + " ]";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ActivityStatusEnum getActivityStatus() {
        return activityStatus;
    }

    public void setActivityStatus(ActivityStatusEnum activityStatus) {
        this.activityStatus = activityStatus;
    }

    public HashMap<Long, Double> getAllocatedQuantities() {
        return allocatedQuantities;
    }

    public void setAllocatedQuantities(HashMap<Long, Double> allocatedQuantities) {
        this.allocatedQuantities = allocatedQuantities;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
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

    public List<UserEntity> getJoinedUsers() {
        return joinedUsers;
    }

    public void setJoinedUsers(List<UserEntity> joinedUsers) {
        this.joinedUsers = joinedUsers;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
}
