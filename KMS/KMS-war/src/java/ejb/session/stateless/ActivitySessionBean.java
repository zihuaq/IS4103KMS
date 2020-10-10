/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ActivityEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.util.Calendar;
import java.util.Date;
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
public class ActivitySessionBean implements ActivitySessionBeanLocal {

    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public Long createNewActivity(ActivityEntity newActivity, Long projectId) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        
        em.persist(newActivity);
        em.flush();
        
        newActivity.setProject(project);
        project.getActivities().add(newActivity);
        
        return newActivity.getActivityId();
    }
    
    @Override
    public ActivityEntity getActivityById(Long activityId) throws NoResultException {
        ActivityEntity activity = em.find(ActivityEntity.class, activityId);
        
        if (activity != null) {
            return activity;
        } else {
            throw new NoResultException("Activity with Id " + activityId + " does not exists!");
        }
    }
    
    @Override
    public List<ActivityEntity> getActivitiesByProjectId(Long projectId, Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMinimum(Calendar.DAY_OF_MONTH));
        Date fromDate = cal.getTime();
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        Date toDate = cal.getTime();
        
        Query query = em.createQuery("SELECT a FROM ActivityEntity a WHERE a.project.projectId = :inProjectId AND a.startDate <= :inToDate AND a.endDate >= :inFromDate");
        query.setParameter("inProjectId", projectId);
        query.setParameter("inToDate", toDate);
        query.setParameter("inFromDate", fromDate);
        
        return query.getResultList();
    }
    
    @Override
    public void updateActivity(ActivityEntity activityToUpdate) throws NoResultException {
        ActivityEntity activity = getActivityById(activityToUpdate.getActivityId());
        
        activity.setName(activityToUpdate.getName());
        activity.setCountry(activityToUpdate.getCountry());
        activity.setStartDate(activityToUpdate.getStartDate());
        activity.setEndDate(activityToUpdate.getEndDate());
        activity.setLocation(activityToUpdate.getLocation());
        activity.setDescription(activityToUpdate.getDescription());
        
        activity.getProject().getActivities().remove(activity);
        ProjectEntity project = projectSessionBeanLocal.getProjectById(activityToUpdate.getProject().getProjectId());
        activity.setProject(project);
        project.getActivities().add(activity);        
    }
    
    @Override
    public void addMemberToActivity(Long activityId, Long userId) throws NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        ActivityEntity activity = getActivityById(activityId);
        
        user.getActivityJoined().add(activity);
        activity.getJoinedUsers().add(user);
    }
    
    @Override
    public void removeMemberToActivity(Long activityId, Long userId) throws NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        ActivityEntity activity = getActivityById(activityId);
        
        user.getActivityJoined().remove(activity);
        activity.getJoinedUsers().remove(user);
    }
    
    @Override
    public void deleteActivity(Long activityId) throws NoResultException {
        ActivityEntity activityToDelete = getActivityById(activityId);
        
        activityToDelete.getProject().getActivities().remove(activityToDelete);
        activityToDelete.setProject(null);
        
        if (!activityToDelete.getHumanResourcePostings().isEmpty()) {
            for (HumanResourcePostingEntity hrp : activityToDelete.getHumanResourcePostings()) {
                hrp.setActivity(null);                
            }
            activityToDelete.getHumanResourcePostings().clear();
        }
        
        if (!activityToDelete.getMaterialResourcePostings().isEmpty()) {
            for (MaterialResourcePostingEntity mrp : activityToDelete.getMaterialResourcePostings()) {
                mrp.setActivity(null);                
            }
            activityToDelete.getMaterialResourcePostings().clear();
        }
        
        if (!activityToDelete.getJoinedUsers().isEmpty()) {
            for (UserEntity user : activityToDelete.getJoinedUsers()) {
                user.getActivityJoined().remove(activityToDelete);
            }
            activityToDelete.getJoinedUsers().clear();
        }
        
        em.remove(activityToDelete);
    }
}
