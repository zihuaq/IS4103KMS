/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.User;

/**
 *
 * @author zeplh
 */
public class UserRegistrationReq {
    private User newUser; 

    public UserRegistrationReq() {
    }

    public UserRegistrationReq(User newUser) {
        this.newUser = newUser;
    }

    public User getNewUser() {
        return newUser;
    }

    public void setNewUser(User newUser) {
        this.newUser = newUser;
    }
    
    
}
