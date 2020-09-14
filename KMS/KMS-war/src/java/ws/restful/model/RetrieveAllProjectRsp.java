/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ProjectEntity;
import java.util.List;

/**
 *
 * @author chai
 */
public class RetrieveAllProjectRsp {
    
    List<ProjectEntity> projects;

    public RetrieveAllProjectRsp() {
    }

    public RetrieveAllProjectRsp(List<ProjectEntity> projects) {
        this.projects = projects;
    }

    public List<ProjectEntity> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectEntity> projects) {
        this.projects = projects;
    }
    
    
}
