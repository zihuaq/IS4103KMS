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
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author zihua
 */
@Entity
public class DonationEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId;
    
    @NotNull
    @Column(nullable=false)
    private String paypalOrderId;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date dateDonated;
    
    @NotNull
    @Column(nullable=false)
    private Double amount;
    
    @ManyToOne
    private ProjectEntity project;

    public DonationEntity() {
    }

    public DonationEntity(String paypalOrderId, Date dateDonated, Double amount) {
        this();
        this.paypalOrderId = paypalOrderId;
        this.dateDonated = dateDonated;
        this.amount = amount;
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (donationId != null ? donationId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the donationId fields are not set
        if (!(object instanceof DonationEntity)) {
            return false;
        }
        DonationEntity other = (DonationEntity) object;
        if ((this.donationId == null && other.donationId != null) || (this.donationId != null && !this.donationId.equals(other.donationId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.DonationEntity[ id=" + donationId + " ]";
    }

    public String getPaypalOrderId() {
        return paypalOrderId;
    }

    public void setPaypalOrderId(String paypalOrderId) {
        this.paypalOrderId = paypalOrderId;
    }

    public Date getDateDonated() {
        return dateDonated;
    }

    public void setDateDonated(Date dateDonated) {
        this.dateDonated = dateDonated;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }
    
}
