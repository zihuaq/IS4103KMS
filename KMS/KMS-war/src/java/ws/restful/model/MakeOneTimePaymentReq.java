/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.FulfillmentEntity;
import entity.PaymentEntity;

/**
 *
 * @author zihua
 */
public class MakeOneTimePaymentReq {
    
    private FulfillmentEntity fulfillmentToUpdate;
    private PaymentEntity payment;

    public MakeOneTimePaymentReq() {
    }

    public MakeOneTimePaymentReq(FulfillmentEntity fulfillmentToUpdate, PaymentEntity payment) {
        this.fulfillmentToUpdate = fulfillmentToUpdate;
        this.payment = payment;
    }

    public FulfillmentEntity getFulfillmentToUpdate() {
        return fulfillmentToUpdate;
    }

    public void setFulfillmentToUpdate(FulfillmentEntity fulfillmentToUpdate) {
        this.fulfillmentToUpdate = fulfillmentToUpdate;
    }

    public PaymentEntity getPayment() {
        return payment;
    }

    public void setPayment(PaymentEntity payment) {
        this.payment = payment;
    }
}
