/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.MaterialResourcePostingEntity;

/**
 *
 * @author chai
 */
public class CreateMrpReq {
    
    private MaterialResourcePostingEntity newMrp;
    private Long projectId;

    public CreateMrpReq() {
    }

    public CreateMrpReq(MaterialResourcePostingEntity newMrp, Long projectId) {
        this.newMrp = newMrp;
        this.projectId = projectId;
    }

    public MaterialResourcePostingEntity getNewMrp() {
        return newMrp;
    }

    public void setNewMrp(MaterialResourcePostingEntity newMrp) {
        this.newMrp = newMrp;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
    
    
}
