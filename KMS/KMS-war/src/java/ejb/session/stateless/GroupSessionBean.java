/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateGroupException;
import Exception.CreateProjectException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import entity.ActivityEntity;
import entity.GroupEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.TaskEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author zeplh
 */
@Stateless
public class GroupSessionBean implements GroupSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
     @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;
    
    @EJB(name = "PostSessionBeanLocal")
    private PostSessionBeanLocal postSessionBeanLocal;
    
    public Long createNewGroup(GroupEntity newGroup, Long userId) throws CreateGroupException {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            em.persist(newGroup);
            em.flush();
            
            user.getGroupsOwned().add(newGroup);
            newGroup.setGroupOwner(user);
            user.getGroupAdmins().add(newGroup);
            newGroup.getGroupAdmins().add(user);
            user.getGroupsJoined().add(newGroup);
            newGroup.getGroupMembers().add(user);
            
            return newGroup.getGroupId();
        } catch (NoResultException ex) {
            throw new CreateGroupException("User not found");
        }
    }
    
    public List<GroupEntity> retrieveAllGroup() {
        Query query = em.createQuery("SELECT g FROM GroupEntity G");
        
        return query.getResultList();
    }
    
 
    public GroupEntity getGroupById(Long groupId) {
        GroupEntity group = em.find(GroupEntity.class, groupId);
        
        return group;
    }
    
    public void joinGroup(Long groupId, Long userId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        user.getGroupsJoined().add(group);
        group.getGroupMembers().add(user); 
    }
    
    public void removeMember(Long groupId, Long userId) throws NoResultException, InvalidRoleException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        if (group.getGroupOwner().getUserId().equals(userId)) {
            throw new InvalidRoleException("Owner cannot leave the project");
            
        } else {
            user.getGroupsJoined().remove(group);
            group.getGroupMembers().remove(user);
            
            for(UserEntity admin: group.getGroupAdmins()){
               if (admin.equals(user)){
                   user.getGroupAdmins().remove(group);
                   group.getGroupAdmins().remove(user);
               }
            }
        }
        
    }
     public void updateGroup(GroupEntity groupToUpdate) {
        em.merge(groupToUpdate);
        em.flush();
    }
     
      public void addAdmin(Long groupId, Long userId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        group.getGroupAdmins().add(user);
        user.getGroupAdmins().add(group);
    }
      
      public void removeAdmin(Long groupId, Long userId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        group.getGroupAdmins().remove(user);
        user.getGroupAdmins().remove(group);
    }
      
       public void changeOwner(Long groupId, Long newOwnerId) throws NoResultException {
        GroupEntity group = getGroupById(groupId);
        UserEntity user = userSessionBeanLocal.getUserById(newOwnerId);
        
        group.getGroupOwner().getGroupsOwned().remove(group);
        group.setGroupOwner(user);
        user.getGroupsOwned().add(group);
    }
       
       public void deleteGroup(Long groupId) {
        GroupEntity groupToDelete = getGroupById(groupId);
        
        groupToDelete.getGroupOwner().getGroupsOwned().remove(groupToDelete);
        groupToDelete.setGroupOwner(null);
        
        for (UserEntity user : groupToDelete.getGroupAdmins()) {
            user.getGroupAdmins().remove(groupToDelete);
        }
        groupToDelete.getGroupAdmins().clear();
        
        for (UserEntity user : groupToDelete.getGroupMembers()) {
            user.getGroupsJoined().remove(groupToDelete);
        }
       groupToDelete.getGroupMembers().clear();
        
        
//        for (PostEntity post : groupToDelete.getPosts()) {
//            postSessionBeanLocal.deletePost(post.getPostId());
//        }
//        groupToDelete.getPosts().clear();
        
        em.remove(groupToDelete);
    }
}
