/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.GroupEntity;
import entity.MaterialResourceAvailableEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.util.List;
import java.util.Map;
import javax.ejb.Local;
import ws.restful.model.FollowingOfFollowingRsp;
import ws.restful.model.GroupRecommendationBasedOnFollowingRsp;
import ws.restful.model.MrpMatchesRsp;
import ws.restful.model.ProjectMatchesRsp;
import ws.restful.model.ProjectRecommendationBasedOnFollowingRsp;

/**
 *
 * @author Cassie
 */
@Local
public interface MatchingSessionBeanLocal {

    public List<MrpMatchesRsp> getMatchesForMrp(long mrpId) throws NoResultException;

    public List<UserEntity> getMatchesForHrp(long hrpId) throws NoResultException;

    public List<ProjectMatchesRsp> getMatchesForProjects(long projectId) throws NoResultException;

    public List<FollowingOfFollowingRsp> getFollowingofFollowing(long userId) throws NoResultException;

    public List<UserEntity> getFollowersToFollow(long userId) throws NoResultException;

    public List<GroupEntity> getGroupRecommendationsBasedOnSDG(long userId) throws NoResultException;

    public List<GroupRecommendationBasedOnFollowingRsp> getGroupRecommendationsBasedOnFollowing(long userId) throws NoResultException;

    public List<ProjectEntity> getProjectRecommendationsBasedOnSDG(long userId) throws NoResultException;

    public List<ProjectRecommendationBasedOnFollowingRsp> getProjectRecommendationsBasedOnFollowing(long userId) throws NoResultException;
}
