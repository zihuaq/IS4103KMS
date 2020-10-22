/*
 * To change this license header, choose License Headers in Group Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateGroupException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import entity.GroupEntity;
import java.util.List;
import javax.ejb.Local;
import util.enumeration.GroupStatusEnum;

/**
 *
 * @author zeplh
 */
@Local
public interface GroupSessionBeanLocal {

    //public Long createNewGroup(GroupEntity newGroup, Long userId, List<Long> tagIds) throws CreateGroupException;
    
    public Long createNewGroup(GroupEntity newGroup, Long userId) throws CreateGroupException;

    public List<GroupEntity> retrieveAllGroup();

   //public List<GroupEntity> retrieveGroupByStatus(GroupStatusEnum status);

    public GroupEntity getGroupById(Long groupId) throws NoResultException;

    public void joinGroup(Long groupId, Long userId) throws NoResultException;

    public void removeMember(Long groupId, Long userId) throws NoResultException, InvalidRoleException;

    public void updateGroup(GroupEntity groupToUpdate) throws NoResultException;

//    public void updateStatus(Long groupId, String status) throws NoResultException;

    public void addAdmin(Long groupId, Long userId) throws NoResultException;

    public void removeAdmin(Long groupId, Long userId) throws NoResultException;

    public void changeOwner(Long groupId, Long newOwnerId) throws NoResultException;

    public void deleteGroup(Long groupId) throws NoResultException;

    //public List<ReviewEntity> getGroupReviews(Long groupId) throws NoResultException;

    //public Long createNewGroupReview(ReviewEntity newReview, Long groupId, Long fromUserId) throws CreateGroupReviewException;

    //public Long createNewUserReview(ReviewEntity newReview, Long groupId, Long fromUserId, Long toUserId) throws CreateUserReviewException;    
    
}
