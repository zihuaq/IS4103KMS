/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.FulfillmentEntity;
import entity.MaterialResourceAvailableEntity;
import entity.MaterialResourcePostingEntity;
import entity.UserEntity;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author zihua
 */
@Stateless
public class FulfillmentSessionBean implements FulfillmentSessionBeanLocal {

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
        
        newFulfillment.setReceivedQuantity(0.0);
        newFulfillment.setUnreceivedQuantity(newFulfillment.getTotalPledgedQuantity());
        mra.setQuantity(newFulfillment.getMra().getQuantity());
        posting.setLackingQuantity(newFulfillment.getPosting().getLackingQuantity());
        posting.setObtainedQuantity(newFulfillment.getPosting().getObtainedQuantity());
        
        newFulfillment.setFulfillmentOwner(fulfillmentOwner);
        fulfillmentOwner.getFulfillments().add(newFulfillment);
        newFulfillment.setPosting(posting);
        posting.getFulfillments().add(newFulfillment);
        newFulfillment.setMra(mra);
        
        em.persist(newFulfillment);
        
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
    public void updateFulfillment(FulfillmentEntity fulfillmentToUpdate) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentToUpdate.getFulfillmentId());
        
        fulfillment.setTotalPledgedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity());
        fulfillment.setReceivedQuantity(fulfillmentToUpdate.getReceivedQuantity());
        fulfillment.setUnreceivedQuantity(fulfillmentToUpdate.getUnreceivedQuantity());
        fulfillment.setStatus(fulfillmentToUpdate.getStatus());
    }
    
    @Override
    public void deleteFulfillment(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillmentToDelete = getFulfillmentById(fulfillmentId);
        
        if (fulfillmentToDelete.getFulfillmentOwner()!= null) {
            fulfillmentToDelete.getFulfillmentOwner().getFulfillments().remove(fulfillmentToDelete);
            fulfillmentToDelete.setFulfillmentOwner(null);
        }
        
        if (fulfillmentToDelete.getPosting()!= null) {
            fulfillmentToDelete.getPosting().getFulfillments().remove(fulfillmentToDelete);
            fulfillmentToDelete.setPosting(null);
        }
        
        if (fulfillmentToDelete.getMra()!= null) {
            fulfillmentToDelete.setMra(null);
        }
        em.remove(fulfillmentToDelete);
    }
}
