/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author zeplh
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
    private Double totalQuantity;
    
    @NotNull
    @Column(nullable=false)
    private Double obtainedQuantity;
    
    @NotNull
    @Column(nullable=false)
    private Double lackingQuantity;
    
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
    private Double lontitude;
    
    @ManyToOne
    private ActivityEntity activity;
    
    @ManyToOne
    @JoinColumn
    private ProjectEntity project;

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
    
}
