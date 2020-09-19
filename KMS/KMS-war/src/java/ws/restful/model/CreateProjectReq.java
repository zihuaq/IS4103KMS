/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ProjectEntity;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author chai
 */
public class CreateProjectReq {
    
    private ProjectEntity newProject;
    private Long ownerId;
    private List<Long> tagIds;

    public CreateProjectReq() {
    }

    public CreateProjectReq(ProjectEntity newProject, Long ownerId, List<Long> tagIds) {
        this.newProject = newProject;
        this.ownerId = ownerId;
        this.tagIds = tagIds;
    }

    public ProjectEntity getNewProject() {
        return newProject;
    }

    public void setNewProject(ProjectEntity newProject) {
        this.newProject = newProject;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Long> tagIds) {
        this.tagIds = tagIds;
    }
    
    
}
