/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import entity.FulfillmentEntity;
import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.enumeration.PaymentStatusEnum;

/**
 *
 * @author zihua
 */
@Entity
public class PaymentEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;
    
    @NotNull
    @Column(nullable=false)
    private Double amount;
    
    private String paypalOrderId;
    
    @Temporal(TemporalType.DATE)
    private Date previousDueDate;
    
    @Temporal(TemporalType.DATE)
    private Date dueDate;
    
    @NotNull
    @Column(nullable=false)
    @Enumerated(EnumType.STRING)
    private PaymentStatusEnum status;
    
    @NotNull
    @Column(nullable=false)
    private boolean isLast; //last payment
    
    @ManyToOne
    private FulfillmentEntity fulfillment;

    public PaymentEntity() {
        this.status = PaymentStatusEnum.NOTDUE;
        this.isLast = false;
    }

    public PaymentEntity(Double amount, Date previousDueDate, Date dueDate) {
        this();
        this.amount = amount;
        this.previousDueDate = previousDueDate;
        this.dueDate = dueDate;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (paymentId != null ? paymentId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the paymentId fields are not set
        if (!(object instanceof PaymentEntity)) {
            return false;
        }
        PaymentEntity other = (PaymentEntity) object;
        if ((this.paymentId == null && other.paymentId != null) || (this.paymentId != null && !this.paymentId.equals(other.paymentId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.PaymentEntity[ id=" + paymentId + " ]";
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getPaypalOrderId() {
        return paypalOrderId;
    }

    public void setPaypalOrderId(String paypalOrderId) {
        this.paypalOrderId = paypalOrderId;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public PaymentStatusEnum getStatus() {
        return status;
    }

    public void setStatus(PaymentStatusEnum status) {
        this.status = status;
    }

    public FulfillmentEntity getFulfillment() {
        return fulfillment;
    }

    public void setFulfillment(FulfillmentEntity fulfillment) {
        this.fulfillment = fulfillment;
    }

    public boolean getIsLast() {
        return isLast;
    }

    public void setIsLast(boolean isLast) {
        this.isLast = isLast;
    }

    public Date getPreviousDueDate() {
        return previousDueDate;
    }

    public void setPreviousDueDate(Date previousDueDate) {
        this.previousDueDate = previousDueDate;
    }
    
}
