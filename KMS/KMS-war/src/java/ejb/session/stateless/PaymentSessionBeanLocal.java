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
import javax.ejb.Local;

/**
 *
 * @author zihua
 */
@Local
public interface PaymentSessionBeanLocal {

    public Long createPayment(PaymentEntity newPayment, Long fulfillmentId) throws NoResultException;

    public void makePayment(FulfillmentEntity fulfillmentToUpdate, List<Long> paymentIds, String paypalOrderId) throws NoResultException;

    public PaymentEntity getPaymentById(Long paymentId) throws NoResultException;

    public List<PaymentEntity> getListOfPaymentsByFulfillmentNewestToOldest(Long fulfillmentId) throws NoResultException;

    public List<PaymentEntity> getListOfNonOutstandingPaymentsByFulfillmentNewestToOldest(Long fulfillmentId) throws NoResultException;

    public List<PaymentEntity> getListOfOutstandingPaymentsByProject(Long projectId) throws NoResultException;

    public List<PaymentEntity> getListOfNotCompletedPaymentsByFulfillmentNewestToOldest(Long fulfillmentId) throws NoResultException;
    
}
