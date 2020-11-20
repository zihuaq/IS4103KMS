/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.GroupEntity;
import entity.UserEntity;
import java.util.List;

/**
 *
 * @author Cassie
 */
public class GroupRecommendationBasedOnFollowingRsp {

    private GroupEntity groupToRecommend;

    private List<UserEntity> followingInGroup;

    public GroupRecommendationBasedOnFollowingRsp() {
    }

    public GroupEntity getGroupToRecommend() {
        return groupToRecommend;
    }

    public void setGroupToRecommend(GroupEntity groupToRecommend) {
        this.groupToRecommend = groupToRecommend;
    }

    public List<UserEntity> getFollowingInGroup() {
        return followingInGroup;
    }

    public void setFollowingInGroup(List<UserEntity> followingInGroup) {
        this.followingInGroup = followingInGroup;
    }
}
