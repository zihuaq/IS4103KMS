/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ProjectEntity;
import entity.UserEntity;
import java.util.List;

/**
 *
 * @author Cassie
 */
public class ProjectRecommendationBasedOnFollowingRsp {
    
    private ProjectEntity projectToRecommend;
    
    private List<UserEntity> followingInProject;

    public ProjectRecommendationBasedOnFollowingRsp() {
    }

    public ProjectEntity getProjectToRecommend() {
        return projectToRecommend;
    }

    public void setProjectToRecommend(ProjectEntity projectToRecommend) {
        this.projectToRecommend = projectToRecommend;
    }

    public List<UserEntity> getFollowingInProject() {
        return followingInProject;
    }

    public void setFollowingInProject(List<UserEntity> followingInProject) {
        this.followingInProject = followingInProject;
    }
}
