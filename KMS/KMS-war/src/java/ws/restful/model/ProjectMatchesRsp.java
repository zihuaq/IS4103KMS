/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.ProjectEntity;

/**
 *
 * @author Cassie
 */
public class ProjectMatchesRsp {
    
    private ProjectEntity matchingProject;
    
    private double percentageMatch;

    public ProjectMatchesRsp() {
    }

    public ProjectEntity getMatchingProject() {
        return matchingProject;
    }

    public void setMatchingProject(ProjectEntity matchingProject) {
        this.matchingProject = matchingProject;
    }

    public double getPercentageMatch() {
        return percentageMatch;
    }

    public void setPercentageMatch(double percentageMatch) {
        this.percentageMatch = percentageMatch;
    }
    
    
}
