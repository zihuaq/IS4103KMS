/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.FulfillmentEntity;

/**
 *
 * @author zihua
 */
public class CreateFulfillmentReq {
    
    private FulfillmentEntity newFulfillment;
    private Long ownerId;
    private Long postingId;
    private Long mraId;

    public CreateFulfillmentReq() {
    }

    public CreateFulfillmentReq(FulfillmentEntity newFulfillment, Long ownerId, Long postingId, Long mraId) {
        this.newFulfillment = newFulfillment;
        this.ownerId = ownerId;
        this.postingId = postingId;
        this.mraId = mraId;
    }

    public FulfillmentEntity getNewFulfillment() {
        return newFulfillment;
    }

    public void setNewFulfillment(FulfillmentEntity newFulfillment) {
        this.newFulfillment = newFulfillment;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Long getPostingId() {
        return postingId;
    }

    public void setPostingId(Long postingId) {
        this.postingId = postingId;
    }

    public Long getMraId() {
        return mraId;
    }

    public void setMraId(Long mraId) {
        this.mraId = mraId;
    }
    
    
    
}
