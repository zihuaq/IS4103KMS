/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.FulfillmentEntity;
import entity.PaymentEntity;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.PaymentStatusEnum;

/**
 *
 * @author zihua
 */
@Stateless
public class PaymentSessionBean implements PaymentSessionBeanLocal {

    @EJB(name = "FulfillmentSessionBeanLocal")
    private FulfillmentSessionBeanLocal fulfillmentSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public Long createPayment(PaymentEntity newPayment, Long fulfillmentId) throws NoResultException {
        System.out.println("******** PaymentSessionBean: createPayment()");
        FulfillmentEntity fulfillment = fulfillmentSessionBeanLocal.getFulfillmentById(fulfillmentId);
        
        newPayment.setFulfillment(fulfillment);
        
        em.persist(newPayment);
        em.flush();
        
        
        return newPayment.getPaymentId();
    }
    
    @Override
    public void makePayment(FulfillmentEntity fulfillmentToUpdate, List<Long> paymentIds, String paypalOrderId) throws NoResultException {
        FulfillmentEntity fulfillment = fulfillmentSessionBeanLocal.getFulfillmentById(fulfillmentToUpdate.getFulfillmentId());
        
        for (Long paymentId: paymentIds) {
            PaymentEntity paymentToUpdate = this.getPaymentById(paymentId);
            
            paymentToUpdate.setPaypalOrderId(paypalOrderId);
            paymentToUpdate.setStatus(PaymentStatusEnum.COMPLETED);
        }
        fulfillment.setStatus(fulfillmentToUpdate.getStatus());
    }
    
    @Override
    public PaymentEntity getPaymentById(Long paymentId) throws NoResultException {
        PaymentEntity payment = em.find(PaymentEntity.class, paymentId);
        if (payment != null) {
            return payment;
        } else {
            throw new NoResultException("Payment does not exists.");
        }
    }
    
    @Override
    public List<PaymentEntity> getListOfPaymentsByFulfillmentNewestToOldest(Long fulfillmentId) throws NoResultException {
        Query query = em.createQuery("SELECT p FROM PaymentEntity p WHERE p.fulfillment.fulfillmentId = :inFulfillmentId ORDER BY p.dueDate DESC");
        query.setParameter("inFulfillmentId", fulfillmentId);
        
        return query.getResultList();
    }
    
    @Override
    public List<PaymentEntity> getListOfNonOutstandingPaymentsByFulfillmentNewestToOldest(Long fulfillmentId) throws NoResultException {
        Query query = em.createQuery("SELECT p FROM PaymentEntity p WHERE p.fulfillment.fulfillmentId = :inFulfillmentId AND p.status <> :inStatus ORDER BY p.dueDate DESC");
        query.setParameter("inFulfillmentId", fulfillmentId);
        query.setParameter("inStatus", PaymentStatusEnum.OUTSTANDING);
        
        return query.getResultList();
    }
}
