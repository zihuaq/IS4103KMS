/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ActivityEntity;
import entity.MaterialResourcePostingEntity;
import entity.ReviewEntity;
import java.util.Date;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author chai
 */
@Local
public interface ActivitySessionBeanLocal {

    public Long createNewActivity(ActivityEntity newActivity, Long projectId) throws NoResultException;

    public ActivityEntity getActivityById(Long activityId) throws NoResultException;
    
    public List<ActivityEntity> getActivitiesByProjectId(Long projectId, Date date);
    
    public void updateActivity(ActivityEntity activityToUpdate) throws NoResultException;

    public void addMemberToActivity(Long activityId, Long userId) throws NoResultException;

    public void removeMemberFromActivity(Long activityId, Long userId) throws NoResultException;

    public void deleteActivity(Long activityId) throws NoResultException;

    public void allocateHrpToActivity(Long activityId, Long hrpId) throws NoResultException;

    public void removeHrpFromActivity(Long activityId, Long hrpId) throws NoResultException;

    public List<ActivityEntity> retrieveActivitiesNotCompleted();

    public void updateActivitiesStatus(List<ActivityEntity> activities);

    public List<MaterialResourcePostingEntity> getAllocatedResources(Long activityId) throws NoResultException;

    public void allocateResource(Long activityId, Long mrpId, Double quantity) throws NoResultException;

    public void updateAllocateQuantity(Long activityId, Long mrpId, Double newQuantity) throws NoResultException;

    public void removeAllocation(Long activityId, Long mrpId) throws NoResultException;

    public List<ReviewEntity> getToUserWrittenReviewsForCurrentActivity(Long userId, Long activityId);

    public List<ReviewEntity> getToProjectWrittenReviewsForCurrentActivity(Long userId, Long activityId);

    public Long createNewUserReview(ReviewEntity review, Long fromId, Long toId, Long activityId) throws NoResultException;

    public Long createNewProjectReview(ReviewEntity review, Long fromId, Long toProjectId, Long activityId) throws NoResultException;

    public ReviewEntity getReviewById(Long reviewId) throws NoResultException;

    public void deleteReview(Long reviewId) throws NoResultException;
        
}
