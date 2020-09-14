/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ProjectEntity;

/**
 *
 * @author chai
 */
public class CreateProjectReq {
    
    private ProjectEntity newProject;
    private Long ownerId;

    public CreateProjectReq() {
    }

    public CreateProjectReq(ProjectEntity newProject, Long ownerId) {
        this.newProject = newProject;
        this.ownerId = ownerId;
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
    
    
}
