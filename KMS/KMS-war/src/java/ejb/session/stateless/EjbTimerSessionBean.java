/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.ActivityEntity;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author zihua
 */
@Stateless
public class EjbTimerSessionBean implements EjbTimerSessionBeanLocal {

    @EJB(name = "ActivitySessionBeanLocal")
    private ActivitySessionBeanLocal activitySessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Schedule() //every day at midnight
    public void timer() {
        String timeStamp = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss").format(new Date());
        System.out.println("********** EjbTimerSession.timer(): Timeout at " + timeStamp);
        
        List<ActivityEntity> activities = activitySessionBeanLocal.retrieveActivitiesNotCompleted();
        activitySessionBeanLocal.updateActivitiesStatus(activities);
    }
}
