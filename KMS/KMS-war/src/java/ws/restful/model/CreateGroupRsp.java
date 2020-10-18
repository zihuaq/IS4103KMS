/*
 * To change this license header, choose License Headers in Group Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

/**
 *
 * @author zeplh
 */
public class CreateGroupRsp {
    
    private Long groupId;

    public CreateGroupRsp() {
    }

    public CreateGroupRsp(Long groupId) {
        this.groupId = groupId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
    
    
}
