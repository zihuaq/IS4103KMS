/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.FulfillmentEntity;
import java.util.List;

/**
 *
 * @author zihua
 */
public class MakePaymentReq {
    
    private FulfillmentEntity fulfillmentToUpdate;
    private List<Long> paymentIds;
    private String paypalOrderId;

    public MakePaymentReq() {
    }

    public MakePaymentReq(FulfillmentEntity fulfillmentToUpdate, List<Long> paymentIds, String paypalOrderId) {
        this.fulfillmentToUpdate = fulfillmentToUpdate;
        this.paymentIds = paymentIds;
        this.paypalOrderId = paypalOrderId;
    }

    public FulfillmentEntity getFulfillmentToUpdate() {
        return fulfillmentToUpdate;
    }

    public void setFulfillmentToUpdate(FulfillmentEntity fulfillmentToUpdate) {
        this.fulfillmentToUpdate = fulfillmentToUpdate;
    }

    public List<Long> getPaymentIds() {
        return paymentIds;
    }

    public void setPaymentIds(List<Long> paymentIds) {
        this.paymentIds = paymentIds;
    }

    public String getPaypalOrderId() {
        return paypalOrderId;
    }

    public void setPaypalOrderId(String paypalOrderId) {
        this.paypalOrderId = paypalOrderId;
    }
    
    
    
}
