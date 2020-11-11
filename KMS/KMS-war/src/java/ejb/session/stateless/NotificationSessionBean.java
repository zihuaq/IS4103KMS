/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateNotificationException;
import Exception.NoResultException;
import entity.NotificationEntity;
import entity.UserEntity;
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
public class NotificationSessionBean implements NotificationSessionBeanLocal {

    @EJB(name = "GroupSessionBeanLocal")
    private GroupSessionBeanLocal groupSessionBeanLocal;
    
    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;       

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public Long createNewNotification(NotificationEntity newNotification, Long userId) throws CreateNotificationException {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            
            em.persist(newNotification);
            em.flush();
            
            newNotification.setTo(user);
            user.getNotifications().add(newNotification);
            
            return newNotification.getNotificationId();
            
        } catch (NoResultException ex) {
            throw new CreateNotificationException("User not found");
        }      
    }
    
    @Override
    public List<NotificationEntity> getNotificationByUserId(Long userId) {
        Query query = em.createQuery("SELECT n FROM NotificationEntity n WHERE n.to.userId = :inUserId");
        query.setParameter("inUserId", userId);
        
        return query.getResultList();
    }

    @Override
    public void deleteNotification(Long notificationId) throws NoResultException {
        NotificationEntity notification = em.find(NotificationEntity.class, notificationId);
        UserEntity user = userSessionBeanLocal.getUserById(notification.getTo().getUserId());
        
        user.getNotifications().remove(notification);
        notification.setTo(null);
        
        em.remove(notification);
    }
}
