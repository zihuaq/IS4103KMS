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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.enumeration.MrpStatusEnum;

/**
 *
 * @author zihua
 */
@Entity
public class MaterialResourcePostingEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long materialResourcePostingId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @NotNull
    @Column(nullable=false)
    private String unit;
    
    @NotNull
    @Column(nullable=false)
    private Double totalQuantity;
    
    private Double obtainedQuantity;
    
    @NotNull
    @Column(nullable=false)
    private Double lackingQuantity;
    
    @NotNull
    @Column(nullable=false)
    private Double allocatedQuantity;
    
    private String description;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date startDate;
    
    @Temporal(TemporalType.DATE)
    private Date endDate;
    
    @NotNull
    @Column(nullable=false)
    private Double latitude;
    
    @NotNull
    @Column(nullable=false)
    private Double longitude;
    
    @NotNull
    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private MrpStatusEnum status;
    
    @JoinTable(name = "allocatedMrps")
    @ManyToMany
    private List<ActivityEntity> activities;
    
    @ManyToOne
    @JoinColumn
    private ProjectEntity project;
    
    @ManyToMany
    private List<TagEntity> tags;
    
    @OneToMany(mappedBy = "posting")
    private List<FulfillmentEntity> fulfillments;

    public MaterialResourcePostingEntity() {
        this.tags = new ArrayList<>();
        this.activities = new ArrayList<>();
        this.fulfillments = new ArrayList<>();
        this.status = MrpStatusEnum.OPEN;
    }

    public MaterialResourcePostingEntity(String name, String unit, Double totalQuantity, Double obtainedQuantity, Double lackingQuantity, String description, Date startDate, Date endDate, Double latitude, Double lontitude) {
        this();
        this.name = name;
        this.unit = unit;
        this.totalQuantity = totalQuantity;
        this.obtainedQuantity = obtainedQuantity;
        this.lackingQuantity = lackingQuantity;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.latitude = latitude;
        this.longitude = lontitude;
    }

    public Long getMaterialResourcePostingId() {
        return materialResourcePostingId;
    }

    public void setMaterialResourcePostingId(Long materialResourcePostingId) {
        this.materialResourcePostingId = materialResourcePostingId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (materialResourcePostingId != null ? materialResourcePostingId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the materialResourcePostingId fields are not set
        if (!(object instanceof MaterialResourcePostingEntity)) {
            return false;
        }
        MaterialResourcePostingEntity other = (MaterialResourcePostingEntity) object;
        if ((this.materialResourcePostingId == null && other.materialResourcePostingId != null) || (this.materialResourcePostingId != null && !this.materialResourcePostingId.equals(other.materialResourcePostingId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.MaterialResourcePosting[ id=" + materialResourcePostingId + " ]";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Double totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Double getObtainedQuantity() {
        return obtainedQuantity;
    }

    public void setObtainedQuantity(Double obtainedQuantity) {
        this.obtainedQuantity = obtainedQuantity;
    }

    public Double getLackingQuantity() {
        return lackingQuantity;
    }

    public void setLackingQuantity(Double lackingQuantity) {
        this.lackingQuantity = lackingQuantity;
    }

    public Double getAllocatedQuantity() {
        return allocatedQuantity;
    }

    public void setAllocatedQuantity(Double allocatedQuantity) {
        this.allocatedQuantity = allocatedQuantity;
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

    public List<ActivityEntity> getActivities() {
        return activities;
    }

    public void setActivities(List<ActivityEntity> activities) {
        this.activities = activities;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public List<TagEntity> getTags() {
        return tags;
    }

    public void setTags(List<TagEntity> tags) {
        this.tags = tags;
    }

    public List<FulfillmentEntity> getFulfillments() {
        return fulfillments;
    }

    public void setFulfillments(List<FulfillmentEntity> fulfillments) {
        this.fulfillments = fulfillments;
    }

    public MrpStatusEnum getStatus() {
        return status;
    }

    public void setStatus(MrpStatusEnum status) {
        this.status = status;
    }
    
}
