/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.PostEntity;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 *
 * @author Cassie
 */
public class SharePostToProjectOrGroupsReq {

    private String text;
    private Date postDate;
    private List<Long> projectsOrGroupsIds = new ArrayList<>();

    public SharePostToProjectOrGroupsReq() {
    }

    
    public SharePostToProjectOrGroupsReq(String text, Date postDate, List<Long> projectOrGroupIds) {
        this.text = text;
        this.postDate = postDate;
        this.projectsOrGroupsIds = projectOrGroupIds;
    }

    public List<Long> getProjectsOrGroupsIds() {
        return projectsOrGroupsIds;
    }

    public void setProjectsOrGroupsIds(List<Long> projectOrGroupIds) {
        this.projectsOrGroupsIds = projectOrGroupIds;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
        this.postDate = postDate;
    }

}
