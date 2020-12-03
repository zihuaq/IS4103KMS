/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateNotificationException;
import Exception.NoResultException;
import entity.ActivityEntity;
import entity.FulfillmentEntity;
import entity.MaterialResourcePostingEntity;
import entity.NotificationEntity;
import entity.PaymentEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.ActivityStatusEnum;
import util.enumeration.FulfillmentStatusEnum;
import util.enumeration.MraTypeEnum;
import util.enumeration.MrpStatusEnum;
import util.enumeration.PaymentBasisEnum;
import util.enumeration.PaymentStatusEnum;

/**
 *
 * @author zihua
 */
@Stateless
public class EjbTimerSessionBean implements EjbTimerSessionBeanLocal {

    @EJB(name = "PaymentSessionBeanLocal")
    private PaymentSessionBeanLocal paymentSessionBeanLocal;

    @EJB(name = "NotificationSessionBeanLocal")
    private NotificationSessionBeanLocal notificationSessionBeanLocal;

    @EJB(name = "FulfillmentSessionBeanLocal")
    private FulfillmentSessionBeanLocal fulfillmentSessionBeanLocal;
    
    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Schedule(hour = "*", minute = "*", persistent = false) //every minute
    public void minuteTimer() {
        LocalDateTime now = LocalDateTime.now();
        if (now.getMinute() == 0) {
            String timeStamp = now.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
            System.out.println("********** EjbTimerSession.minuteTimer(): Timeout at " + timeStamp);  
        }
        
        List<ActivityEntity> activities = this.retrieveActivitiesNotCompleted();
        this.updateActivitiesStatus(activities);
    }
    
    @Schedule //every day at 12 midnight
    public void dailyTimer() {
        System.out.println("********** EjbTimerSession.dailyTimer(): Timeout on " + LocalDate.now()); 
        this.updateMrpStatus();
        this.updateFulfillmentStatus();
        this.generateRecurringPayments();
    }
    
    public List<ActivityEntity> retrieveActivitiesNotCompleted() {
        
        Query query = em.createQuery("SELECT a FROM ActivityEntity a WHERE a.activityStatus <> :inStatus");
        query.setParameter("inStatus", ActivityStatusEnum.COMPLETED);
        
        return query.getResultList();
    }
    
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
    public void updateMrpStatus() {
        Query query = em.createQuery("SELECT mrp FROM MaterialResourcePostingEntity mrp WHERE mrp.status = :inStatus");
        query.setParameter("inStatus", MrpStatusEnum.OPEN);
        
        List<MaterialResourcePostingEntity> mrpList = query.getResultList();
        for (MaterialResourcePostingEntity mrp: mrpList) {
            LocalDate today = LocalDate.now();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            LocalDate startDate = LocalDate.parse(sdf.format(mrp.getStartDate()));
            
            if (!today.isBefore(startDate)) {
                mrp.setStatus(MrpStatusEnum.CLOSED);
            }
        }
    }
    
    @Override
    public void updateFulfillmentStatus() {
        LocalDate today = LocalDate.now();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        
        //update accepted to ongoing
        Query query = em.createQuery("SELECT f FROM FulfillmentEntity f WHERE f.status = :inStatus AND f.mra.type <> :inOneTimeDonation AND f.mra.type <> :inOneTimePayment");
        query.setParameter("inStatus", FulfillmentStatusEnum.ACCEPTED);
        query.setParameter("inOneTimeDonation", MraTypeEnum.ONETIMEDONATION);
        query.setParameter("inOneTimePayment", MraTypeEnum.ONETIMEPAYMENT);
        
        List<FulfillmentEntity> fulfillmentList = query.getResultList();
        for (FulfillmentEntity fulfillment: fulfillmentList) {
            LocalDate startDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getStartDate()));
            if (!today.isBefore(startDate)) {
                fulfillment.setStatus(FulfillmentStatusEnum.ONGOING);
            }
        }
        
        //update ongoing to ended
        query = em.createQuery("SELECT f FROM FulfillmentEntity f WHERE f.status = :inStatus");
        query.setParameter("inStatus", FulfillmentStatusEnum.ONGOING);
        fulfillmentList = query.getResultList();
        for (FulfillmentEntity fulfillment: fulfillmentList) {
            if (fulfillment.getPosting().getEndDate() != null) {
                LocalDate endDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getEndDate()));
                if (today.isAfter(endDate)) {
                    fulfillment.setStatus(FulfillmentStatusEnum.ENDED);
                }
            }
            
        }
    }
    
    @Override
    public void generateRecurringPayments() {
        try {
            LocalDate today = LocalDate.now();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            Query query = em.createQuery("SELECT f FROM FulfillmentEntity f WHERE f.status = :inStatus AND f.paymentBasis <> :inBasis");
            query.setParameter("inStatus", FulfillmentStatusEnum.ONGOING);
            query.setParameter("inBasis", PaymentBasisEnum.ONCE);

            List<FulfillmentEntity> fulfillmentList = query.getResultList();
            for (FulfillmentEntity fulfillment: fulfillmentList) {
                List<PaymentEntity> paymentList = paymentSessionBeanLocal.getListOfNonOutstandingPaymentsByFulfillmentNewestToOldest(fulfillment.getFulfillmentId());
                PaymentEntity latestPayment = paymentList.get(0);
                LocalDate dueDate = LocalDate.parse(sdf.format(latestPayment.getDueDate()));
                if (today.isAfter(dueDate)) { 
                    if (latestPayment.getStatus() == PaymentStatusEnum.NOTDUE) { //outstanding payment
                        latestPayment.setStatus(PaymentStatusEnum.OUTSTANDING);
                    } 
                    if (latestPayment.getIsLast() == false) { //create new payment entity for next due date
                        LocalDate newDueDate = LocalDate.now();
                        if (fulfillment.getPaymentBasis() == PaymentBasisEnum.WEEKLY) { //add one week
                            newDueDate = dueDate.plusWeeks(1);
                        } else {
                            newDueDate = dueDate.plusMonths(1); //add one month
                        }
                        LocalDate endDate = null;
                        if (fulfillment.getPosting().getEndDate() != null) {
                           endDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getEndDate())); 
                        }
                        Double amount = fulfillment.getPriceOffered() * fulfillment.getTotalPledgedQuantity();
                        if (endDate != null && !endDate.isAfter(newDueDate)) { //next payment is the last if posting has end date and end date is not after due date
                            long noOfDays = ChronoUnit.DAYS.between(dueDate, endDate);
                            if (fulfillment.getBasisOffered() == MraTypeEnum.DAILY) {
                                amount *= noOfDays;
                            } else if (fulfillment.getBasisOffered() == MraTypeEnum.WEEKLY) {
                                amount *= (long) Math.ceil(noOfDays / 7);
                            }
                            latestPayment.setIsLast(true);
                        } else {
                            if (fulfillment.getBasisOffered() == MraTypeEnum.DAILY) {
                                amount *= 7;
                            }
                        }
                        PaymentEntity newPayment = new PaymentEntity(amount, Date.valueOf(dueDate), Date.valueOf(newDueDate));
                        newPayment.setFulfillment(fulfillment);
                        em.persist(newPayment);
                        em.flush();
                    }
                } else if (today.plusDays(5).isEqual(dueDate) && latestPayment.getStatus() == PaymentStatusEnum.NOTDUE) {
                    ProjectEntity project = fulfillment.getPosting().getProject();
                    NotificationEntity notification = new NotificationEntity();
                    notification.setMsg(fulfillment.getPosting().getName() + " of " + project.getName() + " has a payment due in 5 days!");
                    notification.setProjectId(project.getProjectId());
                    notification.setGroupId(null);
                    notification.setTabName("mrp-tab");
                    for (UserEntity admin: project.getProjectAdmins()) {
                        notificationSessionBeanLocal.createNewNotification(notification, admin.getUserId());
                    }
                } else if (today.plusDays(3).isEqual(dueDate) && latestPayment.getStatus() == PaymentStatusEnum.NOTDUE) {
                    ProjectEntity project = fulfillment.getPosting().getProject();
                    NotificationEntity notification = new NotificationEntity();
                    notification.setMsg(fulfillment.getPosting().getName() + " of " + project.getName() + " has a payment due in 3 days!");
                    notification.setProjectId(project.getProjectId());
                    notification.setGroupId(null);
                    notification.setTabName("mrp-tab");
                    for (UserEntity admin: project.getProjectAdmins()) {
                        notificationSessionBeanLocal.createNewNotification(notification, admin.getUserId());
                    }
                } else if (today.isEqual(dueDate) && latestPayment.getStatus() == PaymentStatusEnum.NOTDUE) {
                    ProjectEntity project = fulfillment.getPosting().getProject();
                    NotificationEntity notification = new NotificationEntity();
                    notification.setMsg(fulfillment.getPosting().getName() + " of " + project.getName() + " has a payment due today!");
                    notification.setProjectId(project.getProjectId());
                    notification.setGroupId(null);
                    notification.setTabName("mrp-tab");
                    for (UserEntity admin: project.getProjectAdmins()) {
                        notificationSessionBeanLocal.createNewNotification(notification, admin.getUserId());
                    }
                }
            }
            
        } catch (NoResultException | CreateNotificationException ex ) {
            System.out.println(ex.getMessage());
        }
    }
}
