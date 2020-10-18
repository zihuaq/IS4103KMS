/*
 * To change this license header, choose License Headers in Group Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.GroupEntity;
import entity.GroupEntity;
import java.util.List;

/**
 *
 * @author melindechu
 */
public class RetrieveAllGroupRsp {
    
    List<GroupEntity> groups;

    public RetrieveAllGroupRsp() {
    }

    public RetrieveAllGroupRsp(List<GroupEntity> groups) {
        this.groups = groups;
    }

    public List<GroupEntity> getGroups() {
        return groups;
    }

    public void setGroups(List<GroupEntity> groups) {
        this.groups = groups;
    }
    
    
}