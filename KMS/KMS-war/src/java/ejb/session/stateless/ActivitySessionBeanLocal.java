/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ActivityEntity;
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

    public void removeMemberToActivity(Long activityId, Long userId) throws NoResultException;

    public void deleteActivity(Long activityId) throws NoResultException;
        
}
