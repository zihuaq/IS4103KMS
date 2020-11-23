/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.DuplicateAwardException;
import Exception.NoResultException;
import entity.AwardEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author zeplh
 */
@Stateless
public class AwardSessionBean implements AwardSessionBeanLocal {

    @EJB
    private UserSessionBeanLocal userSessionBean;

    @EJB
    private ProjectSessionBeanLocal projectSessionBean;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    
    
    
    @Override
    public AwardEntity getAwardById(Long awardId) throws NoResultException {
        AwardEntity award = em.find(AwardEntity.class, awardId);
        if (award != null) {
            return award;
        } else {
            throw new NoResultException("Award does not exists");
        }
    }
    
     @Override
     public List<AwardEntity> getProjectAwards(Long projectId) throws NoResultException {
        ProjectEntity project = em.find(ProjectEntity.class, projectId);
        
        project.getAwards().size();
        return project.getAwards();
    }
     
 
    @Override
    public Long createNewProjectAward(AwardEntity newAward, Long projectId) throws NoResultException {
        
            ProjectEntity project = projectSessionBean.getProjectById(projectId);
            em.persist(newAward);
            em.flush();
            newAward.setProject(project);
            newAward.setUsersReceived(new ArrayList<>());
            project.getAwards().add(newAward);
            
            return newAward.getAwardId();
    }
    
    @Override
    public void deleteProjectAward(Long awardId)  throws NoResultException {
        AwardEntity awardToDelete = getAwardById(awardId);
        
         for (UserEntity user : awardToDelete.getUsersReceived()) {
            user.getReceivedAwards().remove(awardToDelete);
        }
        awardToDelete.getUsersReceived().clear();
        
        ProjectEntity project = awardToDelete.getProject();
        project.getAwards().remove(awardToDelete);
        
        awardToDelete.setProject(null);
        
        em.remove(awardToDelete);
    }
    
    @Override
    public void issueAwardToUser(Long awardId, Long userId) throws NoResultException, DuplicateAwardException{
         AwardEntity award = getAwardById(awardId);   
         UserEntity user = userSessionBean.getUserById(userId);
         
         for(AwardEntity awardCheck : user.getReceivedAwards()){
             if(awardCheck.getAwardId() == award.getAwardId()){
                 throw new DuplicateAwardException("User Already has this award");
             }
         }
         
         award.getUsersReceived().add(user);
         user.getReceivedAwards().add(award);
    }
    
    @Override
    public void withdrawAwardfromUser(Long awardId, Long userId) throws NoResultException{
         AwardEntity award = getAwardById(awardId);   
         UserEntity user = userSessionBean.getUserById(userId);
         
         user.getReceivedAwards().remove(award);
         award.getUsersReceived().remove(user);
    }
    
    @Override
    public void editAward(AwardEntity awardUpdates) throws NoResultException{
        AwardEntity awardToUpdate = getAwardById(awardUpdates.getAwardId());
        awardToUpdate.setName(awardUpdates.getName());
        awardToUpdate.setDescription(awardUpdates.getDescription());
        awardToUpdate.setAwardPicture(awardUpdates.getAwardPicture());
    }

   
}
