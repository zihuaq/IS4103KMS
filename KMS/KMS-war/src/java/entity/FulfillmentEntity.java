/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import util.enumeration.FulfillmentStatusEnum;

/**
 *
 * @author zihua
 */
@Entity
public class FulfillmentEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fulfillmentId;
    
    @NotNull
    @Column(nullable=false)
    private Double totalPledgedQuantity;
    
    @NotNull
    @Column(nullable=false)
    private Double receivedQuantity;
    
    @NotNull
    @Column(nullable=false)
    private Double unreceivedQuantity;
    
    @Enumerated(EnumType.STRING)
    private FulfillmentStatusEnum status;
    
    @ManyToOne
    private UserEntity fulfillmentOwner;
    
    @ManyToOne
    private MaterialResourcePostingEntity posting;
    
    @ManyToOne
    private MaterialResourceAvailableEntity mra;

    public FulfillmentEntity() {
        this.status = FulfillmentStatusEnum.PLEDGED;
    }

    public FulfillmentEntity(Double totalPledgedQuantity, Double receivedQuantity, Double unreceivedQuantity) {
        this();
        this.totalPledgedQuantity = totalPledgedQuantity;
        this.receivedQuantity = receivedQuantity;
        this.unreceivedQuantity = unreceivedQuantity;
    }

    public Long getFulfillmentId() {
        return fulfillmentId;
    }

    public void setFulfillmentId(Long fulfillmentId) {
        this.fulfillmentId = fulfillmentId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (fulfillmentId != null ? fulfillmentId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the fulfillmentId fields are not set
        if (!(object instanceof FulfillmentEntity)) {
            return false;
        }
        FulfillmentEntity other = (FulfillmentEntity) object;
        if ((this.fulfillmentId == null && other.fulfillmentId != null) || (this.fulfillmentId != null && !this.fulfillmentId.equals(other.fulfillmentId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.PostingFulfilmentEntity[ id=" + fulfillmentId + " ]";
    }

    public Double getTotalPledgedQuantity() {
        return totalPledgedQuantity;
    }

    public void setTotalPledgedQuantity(Double totalPledgedQuantity) {
        this.totalPledgedQuantity = totalPledgedQuantity;
    }

    public Double getReceivedQuantity() {
        return receivedQuantity;
    }

    public void setReceivedQuantity(Double receivedQuantity) {
        this.receivedQuantity = receivedQuantity;
    }

    public Double getUnreceivedQuantity() {
        return unreceivedQuantity;
    }

    public void setUnreceivedQuantity(Double unreceivedQuantity) {
        this.unreceivedQuantity = unreceivedQuantity;
    }

    public FulfillmentStatusEnum getStatus() {
        return status;
    }

    public void setStatus(FulfillmentStatusEnum status) {
        this.status = status;
    }

    public UserEntity getFulfillmentOwner() {
        return fulfillmentOwner;
    }

    public void setFulfillmentOwner(UserEntity fulfillmentOwner) {
        this.fulfillmentOwner = fulfillmentOwner;
    }

    public MaterialResourcePostingEntity getPosting() {
        return posting;
    }

    public void setPosting(MaterialResourcePostingEntity posting) {
        this.posting = posting;
    }

    public MaterialResourceAvailableEntity getMra() {
        return mra;
    }

    public void setMra(MaterialResourceAvailableEntity mra) {
        this.mra = mra;
    }
    
}
