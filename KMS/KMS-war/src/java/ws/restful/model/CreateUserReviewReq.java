/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ReviewEntity;

/**
 *
 * @author zeplh
 */
public class CreateUserReviewReq {
    private ReviewEntity review;
    private Long from;
    private Long to;
    private Long madeFromActivityId;

    public CreateUserReviewReq() {
    }

    public CreateUserReviewReq(ReviewEntity review, Long from, Long to, Long madeFromActivityId) {
        this.review = review;
        this.from = from;
        this.to = to;
        this.madeFromActivityId = madeFromActivityId;
    }

  

    public ReviewEntity getReview() {
        return review;
    }

    public void setReview(ReviewEntity review) {
        this.review = review;
    }

    public Long getFrom() {
        return from;
    }

    public void setFrom(Long from) {
        this.from = from;
    }

    public Long getTo() {
        return to;
    }

    public void setTo(Long to) {
        this.to = to;
    }

    public Long getMadeFromActivityId() {
        return madeFromActivityId;
    }

    public void setMadeFromActivityId(Long madeFromActivityId) {
        this.madeFromActivityId = madeFromActivityId;
    }
    
    
    
}
