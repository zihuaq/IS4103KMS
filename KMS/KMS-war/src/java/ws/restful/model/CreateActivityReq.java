/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ActivityEntity;

/**
 *
 * @author chai
 */
public class CreateActivityReq {
    
    private ActivityEntity newActivity;
    private Long projectId;

    public CreateActivityReq() {
    }

    public CreateActivityReq(ActivityEntity activityEntity, Long projectId) {
        this.newActivity = activityEntity;
        this.projectId = projectId;
    }

    public ActivityEntity getNewActivity() {
        return newActivity;
    }

    public void setNewActivity(ActivityEntity newActivity) {
        this.newActivity = newActivity;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
    
}
