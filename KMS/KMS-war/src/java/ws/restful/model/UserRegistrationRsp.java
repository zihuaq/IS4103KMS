/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

/**
 *
 * @author zeplh
 */
public class UserRegistrationRsp {
    Long newUserId;

    public UserRegistrationRsp() {
    }

    public UserRegistrationRsp(Long newUserId) {
        this.newUserId = newUserId;
    }

    public Long getNewUserId() {
        return newUserId;
    }

    public void setNewUserId(Long newUserId) {
        this.newUserId = newUserId;
    }
    
    
}
