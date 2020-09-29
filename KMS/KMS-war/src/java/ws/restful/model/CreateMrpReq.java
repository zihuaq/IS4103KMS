/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.MaterialResourcePostingEntity;
import java.util.List;

/**
 *
 * @author chai
 */
public class CreateMrpReq {
    
    private MaterialResourcePostingEntity newMrp;
    private Long projectId;
    private List<Long> tagIds;
    
    public CreateMrpReq() {
    }

    public CreateMrpReq(MaterialResourcePostingEntity newMrp, Long projectId, List<Long> tagIds) {
        this.newMrp = newMrp;
        this.projectId = projectId;
        this.tagIds = tagIds;
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

    public List<Long> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }
    
}
