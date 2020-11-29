/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateNotificationException;
import Exception.NoResultException;
import entity.FulfillmentEntity;
import entity.MaterialResourceAvailableEntity;
import entity.MaterialResourcePostingEntity;
import entity.NotificationEntity;
import entity.PaymentEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
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
public class FulfillmentSessionBean implements FulfillmentSessionBeanLocal {

    @EJB(name = "NotificationSessionBeanLocal")
    private NotificationSessionBeanLocal notificationSessionBeanLocal;

    @EJB(name = "PaymentSessionBeanLocal")
    private PaymentSessionBeanLocal paymentSessionBeanLocal;

    @EJB(name = "MaterialResourceAvailableSessionBeanLocal")
    private MaterialResourceAvailableSessionBeanLocal materialResourceAvailableSessionBeanLocal;

    @EJB(name = "MaterialResourcePostingSessionBeanLocal")
    private MaterialResourcePostingSessionBeanLocal materialResourcePostingSessionBeanLocal;

    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal; 

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public Long createFulfillment(FulfillmentEntity newFulfillment, Long ownerId, Long postingId, Long mraId) throws NoResultException {
        System.out.println("******** FulfillmentSessionBean: createFulfillment()");
        
        UserEntity fulfillmentOwner = userSessionBeanLocal.getUserById(ownerId);
        MaterialResourcePostingEntity posting = materialResourcePostingSessionBeanLocal.getMrpById(postingId);
        MaterialResourceAvailableEntity mra = materialResourceAvailableSessionBeanLocal.getMaterialResourceAvailableById(mraId);
        
        if (mra.getType() == MraTypeEnum.ONETIMEDONATION || mra.getType() == MraTypeEnum.ONETIMEPAYMENT) { //if one-time
            newFulfillment.setReceivedQuantity(0.0);
            newFulfillment.setUnreceivedQuantity(newFulfillment.getTotalPledgedQuantity());
            posting.setLackingQuantity(posting.getLackingQuantity() - newFulfillment.getTotalPledgedQuantity());
        } else { //if recurring
            newFulfillment.setReceivedQuantity(null);
            newFulfillment.setUnreceivedQuantity(null);
            posting.setLackingQuantity(0.0);
        }
        
        if (posting.getLackingQuantity() == 0.0) {
            posting.setStatus(MrpStatusEnum.CLOSED);
        }
        newFulfillment.setFulfillmentOwner(fulfillmentOwner);
        fulfillmentOwner.getFulfillments().add(newFulfillment);
        newFulfillment.setPosting(posting);
        posting.getFulfillments().add(newFulfillment);
        newFulfillment.setMra(mra);
        
        em.persist(newFulfillment);
        em.flush();
        
        return newFulfillment.getFulfillmentId();
    }
    
    @Override
    public FulfillmentEntity getFulfillmentById(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillment = em.find(FulfillmentEntity.class, fulfillmentId);
        
        if (fulfillment != null) {
            return fulfillment;
        } else {
            throw new NoResultException("Fulfillment does not exist");
        }
    }
    
    @Override
    public List<FulfillmentEntity> getListOfFulfillmentsByMrp(Long mrpId) throws NoResultException {
        MaterialResourcePostingEntity mrp = materialResourcePostingSessionBeanLocal.getMrpById(mrpId);

        List<FulfillmentEntity> fulfillmentList = new ArrayList<>();
        fulfillmentList = mrp.getFulfillments();

        return fulfillmentList;
    }
    
    //only for one-time donations and payments
    @Override
    public void receiveResource(FulfillmentEntity fulfillmentToUpdate) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentToUpdate.getFulfillmentId());
        
        fulfillment.getPosting().setObtainedQuantity(fulfillment.getPosting().getObtainedQuantity() + fulfillmentToUpdate.getReceivedQuantity());
        fulfillment.setTotalPledgedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity());
        fulfillment.setReceivedQuantity(fulfillmentToUpdate.getReceivedQuantity());
        fulfillment.setUnreceivedQuantity(fulfillmentToUpdate.getUnreceivedQuantity());
        fulfillment.setStatus(fulfillmentToUpdate.getStatus());
    }
    
    @Override
    public void updateQuantity(FulfillmentEntity fulfillmentToUpdate) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentToUpdate.getFulfillmentId());
        
        if (fulfillment.getMra().getType() == MraTypeEnum.ONETIMEDONATION || fulfillment.getMra().getType() == MraTypeEnum.ONETIMEPAYMENT) {
            Double difference = fulfillment.getTotalPledgedQuantity() - fulfillmentToUpdate.getTotalPledgedQuantity();
            fulfillment.getPosting().setLackingQuantity(fulfillment.getPosting().getLackingQuantity() + difference);
            fulfillment.setTotalPledgedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity());
            fulfillment.setUnreceivedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity() - fulfillmentToUpdate.getReceivedQuantity());
            fulfillment.setStatus(fulfillmentToUpdate.getStatus());
        } else {
            fulfillment.setTotalPledgedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity());
        }
        
        LocalDate today = LocalDate.now();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getStartDate()));
        
        if (fulfillment.getPosting().getLackingQuantity() == 0.0 || today.isAfter(startDate)) {
            fulfillment.getPosting().setStatus(MrpStatusEnum.CLOSED);
        } else {
            fulfillment.getPosting().setStatus(MrpStatusEnum.OPEN);
        }
        
    }
    
    @Override
    public void rejectFulfillment(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentId);
        
        fulfillment.setStatus(FulfillmentStatusEnum.REJECTED);
        fulfillment.getPosting().setLackingQuantity(fulfillment.getPosting().getLackingQuantity() + fulfillment.getTotalPledgedQuantity());
        
        LocalDate today = LocalDate.now();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getStartDate()));

        if (!today.isAfter(startDate)) {
            fulfillment.getPosting().setStatus(MrpStatusEnum.OPEN);
        }
    }
    
    @Override
    public void acceptFulfillment(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentId);
        
        fulfillment.setStatus(FulfillmentStatusEnum.ACCEPTED);
        
        if (fulfillment.getMra().getType() != MraTypeEnum.ONETIMEDONATION && fulfillment.getMra().getType() != MraTypeEnum.ONETIMEPAYMENT) {
            fulfillment.getPosting().setObtainedQuantity(null);
            
            LocalDate today = LocalDate.now();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            LocalDate startDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getStartDate()));
            
            if (today.isEqual(startDate)) {
                fulfillment.setStatus(FulfillmentStatusEnum.ONGOING);
            }    
            PaymentEntity newPayment = new PaymentEntity();
            Double amount = fulfillment.getPriceOffered() * fulfillment.getTotalPledgedQuantity();
            if (fulfillment.getPaymentBasis() == PaymentBasisEnum.ONCE) { //pay in full
                LocalDate endDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getEndDate()));
                long noOfDays = ChronoUnit.DAYS.between(startDate, endDate);
                if (fulfillment.getBasisOffered() == MraTypeEnum.DAILY) {
                    amount *= noOfDays;
                } else if (fulfillment.getBasisOffered() == MraTypeEnum.WEEKLY) {
                    long noOfWeeks = (long) Math.ceil(noOfDays / 7); //round up
                    amount *= noOfWeeks;
                }
                newPayment.setDueDate(fulfillment.getPosting().getEndDate());
                newPayment.setIsLast(true);
            } else { //paying installments
                if (fulfillment.getBasisOffered() == MraTypeEnum.DAILY) { //daily but paid weekly
                    amount *= 7;
                }
                if (fulfillment.getPaymentBasis() == PaymentBasisEnum.WEEKLY) {
                    newPayment.setDueDate(Date.valueOf(startDate.plusWeeks(1)));
                } else if (fulfillment.getPaymentBasis() == PaymentBasisEnum.MONTHLY) {
                    newPayment.setDueDate(Date.valueOf(startDate.plusMonths(1)));
                }
            }
            newPayment.setPreviousDueDate(fulfillment.getPosting().getStartDate());
            newPayment.setAmount(amount);
            newPayment.setFulfillment(fulfillment);
            
            em.persist(newPayment);
            em.flush();
        }
    }
    
    //for recurring fulfillments where mrp has no end date
    @Override
    public PaymentEntity endSubscription(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentId);
        
        List<PaymentEntity> payments = paymentSessionBeanLocal.getListOfPaymentsByFulfillmentNewestToOldest(fulfillmentId);
        PaymentEntity latestPayment = payments.get(0);
        latestPayment.setIsLast(true);
        
        if (latestPayment.getStatus() == PaymentStatusEnum.NOTDUE && fulfillment.getBasisOffered() == MraTypeEnum.DAILY) {
            LocalDate today = LocalDate.now();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            LocalDate prevDate = LocalDate.parse(sdf.format(latestPayment.getPreviousDueDate()));
            long noOfDays = ChronoUnit.DAYS.between(prevDate, today);
            Double amount = fulfillment.getPriceOffered() * fulfillment.getTotalPledgedQuantity() * noOfDays;
            latestPayment.setAmount(amount);
        }
        fulfillment.setStatus(FulfillmentStatusEnum.ENDED);
        
        return latestPayment;
    }
    
    @Override //only pledged or rejected fulfillments
    public void deleteFulfillment(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillmentToDelete = getFulfillmentById(fulfillmentId);
        
        if (fulfillmentToDelete.getFulfillmentOwner()!= null) {
            fulfillmentToDelete.getFulfillmentOwner().getFulfillments().remove(fulfillmentToDelete);
            fulfillmentToDelete.setFulfillmentOwner(null);
        }
        
        if (fulfillmentToDelete.getPosting()!= null) {
            if (fulfillmentToDelete.getStatus() != FulfillmentStatusEnum.REJECTED) {
                fulfillmentToDelete.getPosting().setLackingQuantity(fulfillmentToDelete.getPosting().getLackingQuantity() + fulfillmentToDelete.getTotalPledgedQuantity());
                
                LocalDate today = LocalDate.now();
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                LocalDate startDate = LocalDate.parse(sdf.format(fulfillmentToDelete.getPosting().getStartDate()));

                if (!today.isAfter(startDate)) {
                    fulfillmentToDelete.getPosting().setStatus(MrpStatusEnum.OPEN);
                }
            }
            fulfillmentToDelete.getPosting().getFulfillments().remove(fulfillmentToDelete);
            fulfillmentToDelete.setPosting(null);
        }
        
        if (fulfillmentToDelete.getMra()!= null) {
            fulfillmentToDelete.setMra(null);
        }
        em.remove(fulfillmentToDelete);
    }
    
    @Override
    public List<FulfillmentEntity> getListOfFulfillmentsByUserAndProject(Long userId, Long projectId) throws NoResultException {
        Query query = em.createQuery("SELECT f FROM FulfillmentEntity f WHERE f.fulfillmentOwner.userId = :inUserId AND f.posting.project.projectId = :inProjectId");
        query.setParameter("inUserId", userId);
        query.setParameter("inProjectId", projectId);
        
        return query.getResultList();
    }
    
    @Override
    public List<FulfillmentEntity> getListOfFulfillmentsByProject(Long projectId) throws NoResultException {
        Query query = em.createQuery("SELECT f FROM FulfillmentEntity f WHERE f.posting.project.projectId = :inProjectId");
        query.setParameter("inProjectId", projectId);
        
        return query.getResultList();
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
            if (today.isAfter(startDate)) {
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
    public void createRecurringPayments() {
        try {
            LocalDate today = LocalDate.now();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            Query query = em.createQuery("SELECT f FROM FulfillmentEntity f WHERE f.status = :inStatus AND f.paymentBasis <> :inBasis");
            query.setParameter("inStatus", FulfillmentStatusEnum.ONGOING);
            query.setParameter("inBasis", PaymentBasisEnum.ONCE);

            List<FulfillmentEntity> fulfillmentList = query.getResultList();
            for (FulfillmentEntity fulfillment: fulfillmentList) {
                List<PaymentEntity> paymentList = paymentSessionBeanLocal.getListOfNonOutstandingPaymentsByFulfillmentNewestToOldest(fulfillment.getFulfillmentId());
                for (PaymentEntity payment: paymentList) {
                    LocalDate dueDate = LocalDate.parse(sdf.format(payment.getDueDate()));
                    if (today.isAfter(dueDate)) { 
                        if (payment.getStatus() == PaymentStatusEnum.NOTDUE) { //outstanding payment
                            payment.setStatus(PaymentStatusEnum.OUTSTANDING);
                        } 
                        
                        if (payment.getIsLast() == false) { //create new payment entity for next due date
                            LocalDate newDueDate = LocalDate.now();
                            if (fulfillment.getPaymentBasis() == PaymentBasisEnum.WEEKLY) { //add one week
                                newDueDate = dueDate.plusWeeks(1);
                            } else {
                                newDueDate = dueDate.plusMonths(1); //add one month
                            }
                            LocalDate endDate = LocalDate.parse(sdf.format(fulfillment.getPosting().getEndDate()));
                            Double amount = fulfillment.getPriceOffered() * fulfillment.getTotalPledgedQuantity();
                            if (endDate.isBefore(newDueDate)) { //next payment is the last
                                long noOfDays = ChronoUnit.DAYS.between(dueDate, endDate);
                                if (fulfillment.getBasisOffered() == MraTypeEnum.DAILY) {
                                    amount *= noOfDays;
                                } else if (fulfillment.getBasisOffered() == MraTypeEnum.WEEKLY) {
                                    amount *= (long) Math.ceil(noOfDays / 7);
                                }
                                payment.setIsLast(true);
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
                    } else if (today.plusDays(5).isEqual(dueDate) && payment.getStatus() == PaymentStatusEnum.NOTDUE) {
                        ProjectEntity project = fulfillment.getPosting().getProject();
                        NotificationEntity notification = new NotificationEntity();
                        notification.setMsg(fulfillment.getPosting().getName() + " of " + project.getName() + " has a payment due in 5 days!");
                        notification.setProjectId(project.getProjectId());
                        notification.setGroupId(null);
                        notification.setProjectTab("mrp-tab");
                        for (UserEntity admin: project.getProjectAdmins()) {
                            notificationSessionBeanLocal.createNewNotification(notification, admin.getUserId());
                        }
                    } else if (today.plusDays(3).isEqual(dueDate) && payment.getStatus() == PaymentStatusEnum.NOTDUE) {
                        ProjectEntity project = fulfillment.getPosting().getProject();
                        NotificationEntity notification = new NotificationEntity();
                        notification.setMsg(fulfillment.getPosting().getName() + " of " + project.getName() + " has a payment due in 3 days!");
                        notification.setProjectId(project.getProjectId());
                        notification.setGroupId(null);
                        notification.setProjectTab("mrp-tab");
                        for (UserEntity admin: project.getProjectAdmins()) {
                            notificationSessionBeanLocal.createNewNotification(notification, admin.getUserId());
                        }
                    } else if (today.isEqual(dueDate) && payment.getStatus() == PaymentStatusEnum.NOTDUE) {
                        ProjectEntity project = fulfillment.getPosting().getProject();
                        NotificationEntity notification = new NotificationEntity();
                        notification.setMsg(fulfillment.getPosting().getName() + " of " + project.getName() + " has a payment due today!");
                        notification.setProjectId(project.getProjectId());
                        notification.setGroupId(null);
                        notification.setProjectTab("mrp-tab");
                        for (UserEntity admin: project.getProjectAdmins()) {
                            notificationSessionBeanLocal.createNewNotification(notification, admin.getUserId());
                        }
                    }
                }
            }
            
        } catch (NoResultException | CreateNotificationException ex ) {
            System.out.println(ex.getMessage());
        }
    }
}
