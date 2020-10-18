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
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.ActivityStatusEnum;

/**
 *
 * @author chai
 */
@Stateless
public class ActivitySessionBean implements ActivitySessionBeanLocal {

    @EJB(name = "HumanResourcePostingSessionBeanLocal")
    private HumanResourcePostingSessionBeanLocal humanResourcePostingSessionBeanLocal;

    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public Long createNewActivity(ActivityEntity newActivity, Long projectId) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        LocalDate activityDate = LocalDate.parse(sdf.format(newActivity.getStartDate()));
        LocalDate today = LocalDate.now();
        if (activityDate.isEqual(today)) {
            newActivity.setActivityStatus(ActivityStatusEnum.ONGOING);
        } else {
            newActivity.setActivityStatus(ActivityStatusEnum.PLANNED);
        }
        
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
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        LocalDate today = LocalDate.now();
        LocalDate startDate = LocalDate.parse(sdf.format(activityToUpdate.getStartDate()));
        LocalDate endDate = LocalDate.parse(sdf.format(activityToUpdate.getStartDate()));

        if (startDate.isEqual(today)) {
            activity.setActivityStatus(ActivityStatusEnum.ONGOING);
        } else if (endDate.isAfter(today)) {
            activity.setActivityStatus(ActivityStatusEnum.COMPLETED);
        }
    }
    
    @Override
    public void addMemberToActivity(Long activityId, Long userId) throws NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        ActivityEntity activity = getActivityById(activityId);
        
        user.getActivityJoined().add(activity);
        activity.getJoinedUsers().add(user);
    }
    
    @Override
    public void removeMemberFromActivity(Long activityId, Long userId) throws NoResultException {
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
    
    @Override
    public void allocateHrpToActivity(Long activityId, Long hrpId) throws NoResultException {
        ActivityEntity activity = getActivityById(activityId);
        HumanResourcePostingEntity hrp = humanResourcePostingSessionBeanLocal.getHrpById(hrpId);
        
        hrp.setActivity(activity);
        activity.getHumanResourcePostings().add(hrp);
        
    }
    
    @Override
    public void removeHrpFromActivity(Long activityId, Long hrpId) throws NoResultException {
        ActivityEntity activity = getActivityById(activityId);
        HumanResourcePostingEntity hrp = humanResourcePostingSessionBeanLocal.getHrpById(hrpId);
        
        hrp.setActivity(null);
        activity.getHumanResourcePostings().remove(hrp);
    }
    
    @Override
    public List<ActivityEntity> retrieveActivitiesNotCompleted() {
        
        Query query = em.createQuery("SELECT a FROM ActivityEntity a WHERE a.activityStatus <> :inStatus");
        query.setParameter("inStatus", ActivityStatusEnum.COMPLETED);
        
        return query.getResultList();
    }
    
    @Override
    public void updateActivitiesStatus(List<ActivityEntity> activities) {
        if (!activities.isEmpty()) {
            for (ActivityEntity activity: activities) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                LocalDate today = LocalDate.now();
                LocalDate startDate = LocalDate.parse(sdf.format(activity.getStartDate()));
                LocalDate endDate = LocalDate.parse(sdf.format(activity.getStartDate()));

                if (startDate.isEqual(today)) {
                    activity.setActivityStatus(ActivityStatusEnum.ONGOING);
                } else if (endDate.isAfter(today)) {
                    activity.setActivityStatus(ActivityStatusEnum.COMPLETED);
                }

                em.merge(activity);
                em.flush();
            }
        }
    }
        
}
