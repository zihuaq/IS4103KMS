/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.ActivityEntity;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Schedule;
import javax.ejb.Stateless;

/**
 *
 * @author zihua
 */
@Stateless
public class EjbTimerSessionBean implements EjbTimerSessionBeanLocal {

    @EJB(name = "FulfillmentSessionBeanLocal")
    private FulfillmentSessionBeanLocal fulfillmentSessionBeanLocal;

    @EJB(name = "MaterialResourcePostingSessionBeanLocal")
    private MaterialResourcePostingSessionBeanLocal materialResourcePostingSessionBeanLocal;

    @EJB(name = "ActivitySessionBeanLocal")
    private ActivitySessionBeanLocal activitySessionBeanLocal;

    @Schedule(hour = "*", minute = "*", persistent = false) //every minute
    public void timer() {
        LocalDateTime now = LocalDateTime.now();
        if (now.getMinute() == 0) {
            String timeStamp = now.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
            System.out.println("********** EjbTimerSession.timer(): Timeout at " + timeStamp);  
        }
        
        List<ActivityEntity> activities = activitySessionBeanLocal.retrieveActivitiesNotCompleted();
        activitySessionBeanLocal.updateActivitiesStatus(activities);
    }
    
    @Schedule //every day at 12 midnight
    public void Dailytimer() {
        materialResourcePostingSessionBeanLocal.updateMrpStatus();
        fulfillmentSessionBeanLocal.updateFulfillmentStatus();
        fulfillmentSessionBeanLocal.createRecurringPayments();
    }
}
