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
import java.time.LocalDateTime;
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

    @EJB(name = "MaterialResourcePostingSessionBeanLocal")
    private MaterialResourcePostingSessionBeanLocal materialResourcePostingSessionBeanLocal;

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
        
        LocalDateTime today = LocalDateTime.now().withSecond(0).withNano(0);
        LocalDateTime startDate = LocalDateTime.parse(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm").format(newActivity.getStartDate()));

        if (startDate.isAfter(today)) {
            newActivity.setActivityStatus(ActivityStatusEnum.PLANNED);
        } else {
            newActivity.setActivityStatus(ActivityStatusEnum.ONGOING);
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
        System.out.println(fromDate);
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        cal.set(Calendar.HOUR, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date toDate = cal.getTime();
        System.out.println(toDate);
        
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
        activity.setStartDate(activityToUpdate.getStartDate());
        activity.setEndDate(activityToUpdate.getEndDate());
        activity.setDescription(activityToUpdate.getDescription());
        activity.setLatitude(activityToUpdate.getLatitude());
        activity.setLongitude(activityToUpdate.getLongitude());
        
        LocalDateTime today = LocalDateTime.now().withSecond(0).withNano(0);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
        LocalDateTime startDate = LocalDateTime.parse(sdf.format(activity.getStartDate()));
        LocalDateTime endDate = LocalDateTime.parse(sdf.format(activity.getEndDate()));

        if (today.isAfter(endDate)) {
            activity.setActivityStatus(ActivityStatusEnum.COMPLETED);
        } else if (today.isBefore(startDate)) {
            activity.setActivityStatus(ActivityStatusEnum.PLANNED);
        } else {
            activity.setActivityStatus(ActivityStatusEnum.ONGOING);
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
                mrp.getActivities().remove(activityToDelete);
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
        LocalDateTime today = LocalDateTime.now().withSecond(0).withNano(0);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");

        if (!activities.isEmpty()) {
            for (ActivityEntity activity: activities) {
                LocalDateTime startDate = LocalDateTime.parse(sdf.format(activity.getStartDate()));
                LocalDateTime endDate = LocalDateTime.parse(sdf.format(activity.getEndDate()));

                if (today.isAfter(endDate)) {
                    activity.setActivityStatus(ActivityStatusEnum.COMPLETED);
                } else if (!today.isBefore(startDate)) {
                    activity.setActivityStatus(ActivityStatusEnum.ONGOING);
                }

                em.merge(activity);
                em.flush();
            }
        }
    }
    
    @Override
    public List<MaterialResourcePostingEntity> getAllocatedResources(Long activityId) throws NoResultException {
        ActivityEntity activity = this.getActivityById(activityId);
        activity.getMaterialResourcePostings().size();
        
        return activity.getMaterialResourcePostings();
    }
    
    @Override
    public void allocateResource(Long activityId, Long mrpId, Double quantity) throws NoResultException {
        ActivityEntity activity = this.getActivityById(activityId);
        MaterialResourcePostingEntity mrp = materialResourcePostingSessionBeanLocal.getMrpById(mrpId);
        
        activity.getMaterialResourcePostings().add(mrp);
        activity.getAllocatedQuantities().put(mrpId, quantity);
        mrp.getActivities().add(activity);
        mrp.setAllocatedQuantity(mrp.getAllocatedQuantity() + quantity);   
    }
    
    @Override
    public void updateAllocateQuantity(Long activityId, Long mrpId, Double newQuantity) throws NoResultException {
        ActivityEntity activity = this.getActivityById(activityId);
        MaterialResourcePostingEntity mrp = materialResourcePostingSessionBeanLocal.getMrpById(mrpId);
        
        Double diff = newQuantity - activity.getAllocatedQuantities().get(mrpId);
        activity.getAllocatedQuantities().put(mrpId, newQuantity);
        mrp.setAllocatedQuantity(mrp.getAllocatedQuantity() + diff);
    }
    
    @Override
    public void removeAllocation(Long activityId, Long mrpId) throws NoResultException {
        ActivityEntity activity = this.getActivityById(activityId);
        MaterialResourcePostingEntity mrp = materialResourcePostingSessionBeanLocal.getMrpById(mrpId);
        
        mrp.getActivities().remove(activity);
        mrp.setAllocatedQuantity(mrp.getAllocatedQuantity() - activity.getAllocatedQuantities().get(mrpId));
        activity.getMaterialResourcePostings().remove(mrp);
        activity.getAllocatedQuantities().remove(mrpId);
    }
        
}
