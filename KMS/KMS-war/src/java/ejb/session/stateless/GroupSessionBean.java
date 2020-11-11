/*
 * To change this license header, choose License Headers in Group Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateGroupException;
//import Exception.CreateGroupReviewException;
import Exception.CreateUserReviewException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import Exception.GroupNotFoundException;
import entity.ActivityEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.PostEntity;
import entity.GroupEntity;
import entity.ReportEntity;
import entity.TagEntity;
import entity.ReviewEntity;
import entity.TaskEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;


/**
 *
 * @author chai
 */
@Stateless
public class GroupSessionBean implements GroupSessionBeanLocal {

    @EJB
    private ReportSessionBeanLocal reportSessionBean;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;
    
    @EJB(name = "PostSessionBeanLocal")
    private PostSessionBeanLocal postSessionBeanLocal;
    
    @EJB(name = "TagSessionBeanLocal")
    private TagSessionBeanLocal tagSessionBeanLocal;
    
    

    @Override
    public Long createNewGroup(GroupEntity newGroup, Long userId, List<Long> tagIds) throws CreateGroupException {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            em.persist(newGroup);
            em.flush();
            newGroup.setIsActive(Boolean.TRUE);
            user.getGroupsOwned().add(newGroup);
            newGroup.setGroupOwner(user);
            newGroup.getGroupAdmins().add(user);
            user.getGroupsManaged().add(newGroup);
            newGroup.getGroupMembers().add(user);
            user.getGroupsJoined().add(newGroup);
            for (Long tagId : tagIds) {
                TagEntity tag = tagSessionBeanLocal.getTagById(tagId);
                newGroup.getSdgs().add(tag);
            }
            return newGroup.getGroupId();
        } catch (NoResultException ex) {
            throw new CreateGroupException("User not found");
        }
    }
    

    
    public Long createNewUserReview(ReviewEntity newReview, Long groupId, Long fromUserId, Long toUserId)throws CreateUserReviewException{
        try {
            UserEntity fromUser = userSessionBeanLocal.getUserById(fromUserId);
            UserEntity toUser = userSessionBeanLocal.getUserById(toUserId);
            GroupEntity group = getGroupById(groupId);
            em.persist(newReview);
            em.flush();
            
            fromUser.getReviewsGiven().add(newReview);
            toUser.getReviewsGiven().add(newReview);
//            group.getReviews().add(newReview);
//            newReview.setFrom(fromUser);
//            newReview.setTo(toUser);
//            newReview.setGroup(group);
            
            return newReview.getReviewId();
        } catch (NoResultException ex) {
            throw new CreateUserReviewException("User not found");
        }
    }
    
    @Override
    public List<GroupEntity> retrieveAllGroup() {
        Query query = em.createQuery("SELECT p FROM GroupEntity p");
        
        return query.getResultList();
    }
    

    
    @Override
    public GroupEntity getGroupById(Long groupId) throws NoResultException {
        GroupEntity group = em.find(GroupEntity.class, groupId);
        if (group != null) {
            return group;
        } else {
            throw new NoResultException("Group does not exists");
        }
    }
    
    //User join group
    @Override
    public void joinGroup(Long groupId, Long userId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        user.getGroupsJoined().add(group);
        group.getGroupMembers().add(user); 

    }
    
    //Admin/Member leave group or Admin remove Admin/Member from group
    @Override
    public void removeMember(Long groupId, Long userId) throws NoResultException, InvalidRoleException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        if (group.getGroupOwner().getUserId().equals(userId)) {
            throw new InvalidRoleException("Owner cannot leave the group");

        } else {
            if (group.getGroupAdmins().contains(user)) {
                group.getGroupAdmins().remove(user);
                user.getGroupsManaged().remove(group);
            }
            user.getGroupsJoined().remove(group);
            group.getGroupMembers().remove(user);
        }
        
    }
    
    @Override
    public void updateGroup(GroupEntity groupToUpdate) throws NoResultException {
        GroupEntity group = getGroupById(groupToUpdate.getGroupId());
        
        group.setName(groupToUpdate.getName());
        group.setDescription(groupToUpdate.getDescription());
        group.setCountry(groupToUpdate.getCountry());

        for (int i = 0; i < groupToUpdate.getSdgs().size(); i++) {
            TagEntity tag = em.find(TagEntity.class, groupToUpdate.getSdgs().get(i).getTagId());
           if (tag == null) {
               throw new NoResultException("SDG tag not found.");
           }
        }
        group.setSdgs(groupToUpdate.getSdgs());
        group.setIsActive(groupToUpdate.getIsActive());
        

        for (int i = 0; i < groupToUpdate.getSdgs().size(); i++) {
            TagEntity tag = em.find(TagEntity.class, groupToUpdate.getSdgs().get(i).getTagId());
           if (tag == null) {
               throw new NoResultException("SDG tag not found.");
           }
        }
        group.setSdgs(groupToUpdate.getSdgs());

        group.setProfilePicture(groupToUpdate.getProfilePicture());
        
    }
    

    
    //Promote Member to Admin
    @Override
    public void addAdmin(Long groupId, Long userId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        group.getGroupAdmins().add(user);
        user.getGroupsManaged().add(group);
    }
    
    //Demote Admin to Member
    @Override
    public void removeAdmin(Long groupId, Long userId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        group.getGroupAdmins().remove(user);
        user.getGroupsManaged().remove(group);
    }
    
    //Pass Owner status to Admin
    @Override
    public void changeOwner(Long groupId, Long newOwnerId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(newOwnerId);
        
        group.getGroupOwner().getGroupsOwned().remove(group);
        group.setGroupOwner(user);
        
        user.getGroupsOwned().add(group);
    }
    
    @Override
    public void deleteGroup(Long groupId)  throws NoResultException {
        GroupEntity groupToDelete = getGroupById(groupId);
        
        groupToDelete.getGroupOwner().getGroupsOwned().remove(groupToDelete);
        groupToDelete.setGroupOwner(null);
        
        for (UserEntity user : groupToDelete.getGroupAdmins()) {
            user.getGroupsManaged().remove(groupToDelete);
        }
        groupToDelete.getGroupAdmins().clear();
        
        for (UserEntity user : groupToDelete.getGroupMembers()) {
            user.getGroupsJoined().remove(groupToDelete);
        }
        groupToDelete.getGroupMembers().clear();
    
       for (PostEntity post : groupToDelete.getPosts()) {
           postSessionBeanLocal.deletePostInGroupFeed(post.getPostId());
       }
        groupToDelete.getPosts().clear();
        
        try{
            List<ReportEntity> reports = reportSessionBean.getGroupReports();
            
            List<Long> reportIds = new ArrayList<>();
            for(ReportEntity report: reports){
                if(report.getReportedGroup().getGroupId() == groupId){
                    reportIds.add(report.getReportId());
                }
            }
            for(int i = 0; i < reportIds.size(); i++){
                reportSessionBean.deleteReport(reportIds.get(i));
            }
        }
        catch(NoResultException ex){
            System.out.println("No reports  made against group");
        }
//        
            em.remove(groupToDelete);
    }


}
    
