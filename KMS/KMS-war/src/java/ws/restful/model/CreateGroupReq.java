/*
 * To change this license header, choose License Headers in Group Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.GroupEntity;
import java.util.List;

/**
 *
 * @author zeplh
 */
public class CreateGroupReq {
    
    private GroupEntity newGroup;
    private Long ownerId;

    public CreateGroupReq() {
    }

    public CreateGroupReq(GroupEntity newGroup, Long ownerId) {
        this.newGroup = newGroup;
        this.ownerId = ownerId;
    }

    public GroupEntity getNewGroup() {
        return newGroup;
    }

    public void setNewGroup(GroupEntity newGroup) {
        this.newGroup = newGroup;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    
    
}
