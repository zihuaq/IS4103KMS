/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.UserEntity;
import java.util.List;

/**
 *
 * @author Cassie
 */
public class FollowingOfFollowingRsp {

    private UserEntity userToRecommend;

    private List<UserEntity> usersFollowing;

    public FollowingOfFollowingRsp() {

    }

    public UserEntity getUserToRecommend() {
        return userToRecommend;
    }

    public void setUserToRecommend(UserEntity userToRecommend) {
        this.userToRecommend = userToRecommend;
    }

    public List<UserEntity> getUsersFollowing() {
        return usersFollowing;
    }

    public void setUsersFollowing(List<UserEntity> usersFollowing) {
        this.usersFollowing = usersFollowing;
    }
}
