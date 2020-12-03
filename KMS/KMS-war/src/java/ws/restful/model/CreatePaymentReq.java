/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.PaymentEntity;

/**
 *
 * @author zihua
 */
public class CreatePaymentReq {
    
    private PaymentEntity newPayment;
    private Long fulfillmentId;

    public CreatePaymentReq() {
    }

    public CreatePaymentReq(PaymentEntity newPayment, Long fulfillmentId) {
        this.newPayment = newPayment;
        this.fulfillmentId = fulfillmentId;
    }

    public PaymentEntity getNewPayment() {
        return newPayment;
    }

    public void setNewPayment(PaymentEntity newPayment) {
        this.newPayment = newPayment;
    }

    public Long getFulfillmentId() {
        return fulfillmentId;
    }

    public void setFulfillmentId(Long fulfillmentId) {
        this.fulfillmentId = fulfillmentId;
    }
    
    
    
}
