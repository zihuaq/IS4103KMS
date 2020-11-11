/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.AwardEntity;

/**
 *
 * @author zeplh
 */
public class CreateAwardReq {
    
    AwardEntity award;
    Long projectId;

    public CreateAwardReq() {
    }

    public CreateAwardReq(AwardEntity award, Long projectId) {
        this.award = award;
        this.projectId = projectId;
    }

    public AwardEntity getAward() {
        return award;
    }

    public void setAward(AwardEntity award) {
        this.award = award;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
    
    
}
