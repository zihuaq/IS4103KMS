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
public class CreateProjectReviewRsp {
    
    private Long newProjectReviewId;

    public CreateProjectReviewRsp() {
    }

    public CreateProjectReviewRsp(Long newProjectId) {
        this.newProjectReviewId = newProjectId;
    }

    public Long getNewReviewProjectId() {
        return newProjectReviewId;
    }

    public void setNewReviewProjectId(Long newProjectId) {
        this.newProjectReviewId = newProjectId;
    }
    
    
    
}
