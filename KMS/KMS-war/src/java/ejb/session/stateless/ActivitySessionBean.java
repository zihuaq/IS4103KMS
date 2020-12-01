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
import entity.ReviewEntity;
import entity.UserEntity;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
        cal.set(Calendar.HOUR, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
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
            for(UserEntity user: activity.getJoinedUsers()){
                user.setCountOfActivitiesCompleted(user.getCountOfActivitiesCompleted()+1);
            }
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
        
        if (activityToDelete.getProject() != null) {
            activityToDelete.getProject().getActivities().remove(activityToDelete);
            activityToDelete.setProject(null);
        } 
        
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
        
        if (!activityToDelete.getReviews().isEmpty()){
            for (ReviewEntity review: activityToDelete.getReviews()){
                review.setMadeFromActivity(null);
            }
        }
        activityToDelete.getReviews().clear();
        
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
    
    public List<ReviewEntity> getAllUserWrittenReviewsForCurrentActivity(Long userId, Long activityId){
        Query query = em.createQuery("SELECT r FROM ReviewEntity r WHERE r.madeFromActivity.activityId = :activityId AND r.from.userId = :userId");
        query.setParameter("activityId", activityId).setParameter("userId", userId);
        
        return query.getResultList();
    }
        
    @Override
    public List<ReviewEntity> getToUserWrittenReviewsForCurrentActivity(Long userId, Long activityId){
        List<ReviewEntity> allUserReviews = getAllUserWrittenReviewsForCurrentActivity(userId, activityId); 
        List<ReviewEntity> toUserReviews = new ArrayList<>();
        if(!allUserReviews.isEmpty()){
            for (ReviewEntity review : allUserReviews){
                if(review.getTo() != null){
                    toUserReviews.add(review);
                }
            }
        }
        return toUserReviews;
    }
    
    @Override
    public List<ReviewEntity> getToProjectWrittenReviewsForCurrentActivity(Long userId, Long activityId){
        List<ReviewEntity> allUserReviews = getAllUserWrittenReviewsForCurrentActivity(userId, activityId); 
        List<ReviewEntity> toProjectReviews = new ArrayList<>();
        if(!allUserReviews.isEmpty()){
            for (ReviewEntity review : allUserReviews){
                if(review.getProject() != null){
                    toProjectReviews.add(review);
                }
            }
        }
        return toProjectReviews;
    }
    
    
    @Override
    public ReviewEntity getReviewById(Long reviewId) throws NoResultException{
        ReviewEntity review = em.find(ReviewEntity.class, reviewId);
        
        if (review != null) {
            return review;
        } else {
            throw new NoResultException("Activity with Id " + reviewId + " does not exists!");
        }
    }
    
    @Override
    public void deleteReview(Long reviewId) throws NoResultException{
        ReviewEntity review = getReviewById(reviewId);
        if (review.getProject() != null){
            ProjectEntity project = review.getProject();
            project.getReviews().remove(review);
            review.setProject(null);
        }
        if(review.getTo() != null){
            UserEntity to = review.getTo();
            to.getReviewsReceived().remove(review);
            review.setTo(null);
        }
        
        UserEntity from = review.getFrom();
        from.getReviewsGiven().remove(review);
        review.setFrom(null);
        
        ActivityEntity activity  = review.getMadeFromActivity();
        activity.getReviews().remove(review);
        review.setMadeFromActivity(null);
        
        em.remove(review);
    }
        
        

    @Override
    public Long createNewUserReview(ReviewEntity review, Long fromId, Long toId, Long activityId) throws NoResultException {
        
        ReviewEntity newReview = new ReviewEntity(review.getTitle(), review.getReviewField(), review.getRating());
        
        
        UserEntity fromUser = userSessionBeanLocal.getUserById(fromId);
        UserEntity toUser = userSessionBeanLocal.getUserById(toId);
        ActivityEntity madeFromActivity = getActivityById(activityId);
        
        newReview.setFrom(fromUser);
        fromUser.getReviewsGiven().add(newReview);
        
        newReview.setTo(toUser);
        toUser.getReviewsReceived().add(newReview);
        
        newReview.setMadeFromActivity(madeFromActivity);
        madeFromActivity.getReviews().add(newReview);
        
        em.persist(newReview);
        em.flush();
        fromUser.setCountOfReviewsCreated(fromUser.getCountOfReviewsCreated() + 1);
        
        return newReview.getReviewId();
    }
    
    @Override
    public Long createNewProjectReview(ReviewEntity review, Long fromId, Long toProjectId, Long activityId) throws NoResultException {
        
        ReviewEntity newReview = new ReviewEntity(review.getTitle(), review.getReviewField(), review.getRating());
        System.out.println(review.getTitle());
        System.out.println(review.getReviewField());
        System.out.println(review.getRating());
        
        UserEntity fromUser = userSessionBeanLocal.getUserById(fromId);
        ProjectEntity toProject = projectSessionBeanLocal.getProjectById(toProjectId);
        ActivityEntity madeFromActivity = getActivityById(activityId);
        
        newReview.setFrom(fromUser);
        fromUser.getReviewsGiven().add(newReview);
        
        newReview.setProject(toProject);
        toProject.getReviews().add(newReview);
        
        newReview.setMadeFromActivity(madeFromActivity);
        madeFromActivity.getReviews().add(newReview);
        
        em.persist(newReview);
        em.flush();
        
        fromUser.setCountOfReviewsCreated(fromUser.getCountOfReviewsCreated() + 1);
        
        return newReview.getReviewId();
    }
}
