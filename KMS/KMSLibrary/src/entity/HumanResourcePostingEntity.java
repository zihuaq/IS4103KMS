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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author zeplh
 */
@Entity
public class HumanResourcePostingEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long humanResourcePostingId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @NotNull
    @Column(nullable=false)
    private Integer totalSlots;
    
    @NotNull
    @Column(nullable=false)
    private Integer obtainedSlots;
    
    @NotNull
    @Column(nullable=false)
    private Integer lackingSlots;
    
    @NotNull
    @Column(nullable=false)
    private String description;
    
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
    private Double latitude;
    
    @NotNull
    @Column(nullable=false)
    private Double longitude;
    
    @ManyToOne
    private ActivityEntity activity;
    
    @ManyToOne
    @JoinColumn
    private ProjectEntity project;
    
    @ManyToMany
    private List<TagEntity> tags;
    
    @JoinTable(name = "humanResourcePostingApplied")
    @ManyToMany(mappedBy = "hrpApplied")
    private List<UserEntity> appliedUsers;

    public HumanResourcePostingEntity() {
        this.tags = new ArrayList<>();
        this.appliedUsers = new ArrayList<>();
    }

    public HumanResourcePostingEntity(String name, Integer totalSlots, Integer obtainedSlots, Integer lackingSlots, String description, Date startDate, Date endDate, Double latitude, Double lontitude) {
        this();
        this.name = name;
        this.totalSlots = totalSlots;
        this.obtainedSlots = obtainedSlots;
        this.lackingSlots = lackingSlots;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.latitude = latitude;
        this.longitude = lontitude;
    }  

    public Long getHumanResourcePostingId() {
        return humanResourcePostingId;
    }

    public void setHumanResourcePostingId(Long humanResourcePostingId) {
        this.humanResourcePostingId = humanResourcePostingId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (humanResourcePostingId != null ? humanResourcePostingId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the humanResourcePostingId fields are not set
        if (!(object instanceof HumanResourcePostingEntity)) {
            return false;
        }
        HumanResourcePostingEntity other = (HumanResourcePostingEntity) object;
        if ((this.humanResourcePostingId == null && other.humanResourcePostingId != null) || (this.humanResourcePostingId != null && !this.humanResourcePostingId.equals(other.humanResourcePostingId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.HumanResourcePosting[ id=" + humanResourcePostingId + " ]";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTotalSlots() {
        return totalSlots;
    }

    public void setTotalSlots(Integer totalSlots) {
        this.totalSlots = totalSlots;
    }

    public Integer getObtainedSlots() {
        return obtainedSlots;
    }

    public void setObtainedSlots(Integer obtainedSlots) {
        this.obtainedSlots = obtainedSlots;
    }

    public Integer getLackingSlots() {
        return lackingSlots;
    }

    public void setLackingSlots(Integer lackingSlots) {
        this.lackingSlots = lackingSlots;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public ActivityEntity getActivity() {
        return activity;
    }

    public void setActivity(ActivityEntity activity) {
        this.activity = activity;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public List<TagEntity> getTags() {
        return tags;
    }

    public void setTags(List<TagEntity> tags) {
        this.tags = tags;
    }

    public List<UserEntity> getAppliedUsers() {
        return appliedUsers;
    }

    public void setAppliedUsers(List<UserEntity> appliedUsers) {
        this.appliedUsers = appliedUsers;
    }
    
}
