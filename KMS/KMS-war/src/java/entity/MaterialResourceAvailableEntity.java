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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class MaterialResourceAvailableEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mraId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @NotNull
    @Column(nullable=false)
    private Integer quantity;
    
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
    private Double longitude;
    
    @NotNull
    @Column(nullable=false)
    private Double latitude;
    
    @ManyToOne
    private UserEntity materialResourceAvailableOwner;
    
    @ManyToMany
    private List<TagEntity> tags;

    public MaterialResourceAvailableEntity() {
        this.tags = new ArrayList<>();
    }

    public MaterialResourceAvailableEntity(String name, Integer quantity, String description, Date startDate, Date endDate, Double longitude, Double latitude) {
        this();
        this.name = name;
        this.quantity = quantity;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.longitude = longitude;
        this.latitude = latitude;
    }
    
    
    
    public Long getMraId() {
        return mraId;
    }

    public void setMraId(Long mraId) {
        this.mraId = mraId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (mraId != null ? mraId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the mraId fields are not set
        if (!(object instanceof MaterialResourceAvailableEntity)) {
            return false;
        }
        MaterialResourceAvailableEntity other = (MaterialResourceAvailableEntity) object;
        if ((this.mraId == null && other.mraId != null) || (this.mraId != null && !this.mraId.equals(other.mraId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.MaterialResourceAvailable[ id=" + mraId + " ]";
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public UserEntity getMaterialResourceAvailableOwner() {
        return materialResourceAvailableOwner;
    }

    public void setMaterialResourceAvailableOwner(UserEntity materialResourceAvailableOwner) {
        this.materialResourceAvailableOwner = materialResourceAvailableOwner;
    }

    public List<TagEntity> getTags() {
        return tags;
    }

    public void setTags(List<TagEntity> tags) {
        this.tags = tags;
    }
    
}