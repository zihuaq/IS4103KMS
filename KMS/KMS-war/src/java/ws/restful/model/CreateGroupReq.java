/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.GroupEntity;

/**
 *
 * @author zeplh
 */
public class CreateGroupReq {
   private GroupEntity group;
   private Long userId;

    public CreateGroupReq() {
    }

    public CreateGroupReq(GroupEntity group, Long userId) {
        this.group = group;
        this.userId = userId;
    }

    public GroupEntity getGroup() {
        return group;
    }

    public void setGroup(GroupEntity group) {
        this.group = group;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
   
   
}
