/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.HumanResourcePostingEntity;
import java.util.List;

/**
 *
 * @author chai
 */
public class CreateHrpReq {
    
    private HumanResourcePostingEntity newHrp;
    private Long projectId;
    private List<Long> tagIds;

    public CreateHrpReq() {
    }

    public CreateHrpReq(HumanResourcePostingEntity newHrp, Long projectId, List<Long> tagIds) {
        this.newHrp = newHrp;
        this.projectId = projectId;
        this.tagIds = tagIds;
    }

    public HumanResourcePostingEntity getNewHrp() {
        return newHrp;
    }

    public void setNewHrp(HumanResourcePostingEntity newHrp) {
        this.newHrp = newHrp;
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
