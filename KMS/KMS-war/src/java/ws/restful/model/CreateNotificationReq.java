/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.NotificationEntity;

/**
 *
 * @author chai
 */
public class CreateNotificationReq {
    
    private NotificationEntity newNotification;
    private Long userId;

    public CreateNotificationReq() {
    }

    public CreateNotificationReq(NotificationEntity newNotification, Long userId) {
        this.newNotification = newNotification;
        this.userId = userId;
    }

    public NotificationEntity getNewNotification() {
        return newNotification;
    }

    public void setNewNotification(NotificationEntity newNotification) {
        this.newNotification = newNotification;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    
}
