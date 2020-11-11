/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateNotificationException;
import Exception.NoResultException;
import entity.NotificationEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author chai
 */
@Local
public interface NotificationSessionBeanLocal {

    public Long createNewNotification(NotificationEntity newNotification, Long userId) throws CreateNotificationException;

    public List<NotificationEntity> getNotificationByUserId(Long userId);

    public void deleteNotification(Long notificationId) throws NoResultException;

    
}
