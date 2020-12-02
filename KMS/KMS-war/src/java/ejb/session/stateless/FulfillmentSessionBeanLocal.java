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
public interface FulfillmentSessionBeanLocal {

    public Long createFulfillment(FulfillmentEntity newFulfillment, Long ownerId, Long postingId, Long mraId) throws NoResultException;

    public FulfillmentEntity getFulfillmentById(Long fulfillmentId) throws NoResultException;
    
    public List<FulfillmentEntity> getListOfFulfillmentsByMrp(Long mrpId) throws NoResultException;

    public void receiveResource(FulfillmentEntity fulfillmentToUpdate, PaymentEntity payment) throws NoResultException;
    
    public void updateQuantity(FulfillmentEntity fulfillmentToUpdate, PaymentEntity payment) throws NoResultException;
    
    public void rejectFulfillment(Long fulfillmentId) throws NoResultException;
    
    public void acceptFulfillment(Long fulfillmentId) throws NoResultException;

    public PaymentEntity endSubscription(Long fulfillmentId) throws NoResultException;
    
    public void deleteFulfillment(Long fulfillmentId) throws NoResultException;
    
    public List<FulfillmentEntity> getListOfFulfillmentsByUserAndProject(Long userId, Long projectId) throws NoResultException;

    public List<FulfillmentEntity> getListOfFulfillmentsByProject(Long projectId) throws NoResultException;

    public void updateFulfillment(FulfillmentEntity fulfillmentToUpdate) throws NoResultException;
}
