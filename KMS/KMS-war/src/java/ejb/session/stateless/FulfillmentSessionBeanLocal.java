/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.FulfillmentEntity;
import javax.ejb.Local;

/**
 *
 * @author zihua
 */
@Local
public interface FulfillmentSessionBeanLocal {

    public Long createFulfillment(FulfillmentEntity newFulfillment, Long ownerId, Long postingId, Long mraId) throws NoResultException;

    public FulfillmentEntity getFulfillmentById(Long fulfillmentId) throws NoResultException;

    public void updateFulfillment(FulfillmentEntity fulfillmentToUpdate) throws NoResultException;
    
}
