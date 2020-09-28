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
public class CreateUserReviewRsp {
    private Long newUserReviewId;

    public CreateUserReviewRsp() {
    }

    public CreateUserReviewRsp(Long newUserReviewId) {
        this.newUserReviewId = newUserReviewId;
    }

    public Long getNewUserReviewId() {
        return newUserReviewId;
    }

    public void setNewUserReviewId(Long newUserReviewId) {
        this.newUserReviewId = newUserReviewId;
    }
    
    
}
