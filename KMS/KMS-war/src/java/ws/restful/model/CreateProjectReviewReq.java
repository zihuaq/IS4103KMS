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
public class CreateProjectReviewReq {
    private ReviewEntity review;
    private Long from;
    private Long project;
    private Long madeFromActivityId;

    public CreateProjectReviewReq() {
    }

    public CreateProjectReviewReq(ReviewEntity review, Long from, Long project, Long madeFromActivityId) {
        this.review = review;
        this.from = from;
        this.project = project;
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

    public Long getProject() {
        return project;
    }

    public void setProject(Long project) {
        this.project = project;
    }

    public Long getMadeFromActivityId() {
        return madeFromActivityId;
    }

    public void setMadeFromActivityId(Long madeFromActivityId) {
        this.madeFromActivityId = madeFromActivityId;
    }
    
    
    
}
