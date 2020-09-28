/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

/**
 *
 * @author zeplh
 */
public class editReviewRsp {
    private Long ReviewId;

    public editReviewRsp() {
    }

    public editReviewRsp(Long ReviewId) {
        this.ReviewId = ReviewId;
    }

    public Long getReviewId() {
        return ReviewId;
    }

    public void setReviewId(Long ReviewId) {
        this.ReviewId = ReviewId;
    }
    
    
}
