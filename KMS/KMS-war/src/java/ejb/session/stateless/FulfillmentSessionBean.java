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
import java.util.ArrayList;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.FulfillmentStatusEnum;
import util.enumeration.MraTypeEnum;

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
        
        if (mra.getType() == MraTypeEnum.ONETIME) {
            newFulfillment.setReceivedQuantity(0.0);
            newFulfillment.setUnreceivedQuantity(newFulfillment.getTotalPledgedQuantity());
            posting.setLackingQuantity(posting.getLackingQuantity() - newFulfillment.getTotalPledgedQuantity());
        } else {
            newFulfillment.setReceivedQuantity(null);
            newFulfillment.setUnreceivedQuantity(null);
            posting.setObtainedQuantity(null);
            posting.setLackingQuantity(0.0);
        }
        
        //create payment entity
        
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
    
    //only for one-time donations
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
        
        if (fulfillment.getMra().getType() == MraTypeEnum.ONETIME) {
            Double difference = fulfillment.getTotalPledgedQuantity() - fulfillmentToUpdate.getTotalPledgedQuantity();
            fulfillment.getPosting().setLackingQuantity(fulfillment.getPosting().getLackingQuantity() + difference);
            fulfillment.setTotalPledgedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity());
            fulfillment.setUnreceivedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity() - fulfillmentToUpdate.getReceivedQuantity());
            fulfillment.setStatus(fulfillmentToUpdate.getStatus());
        } else {
            fulfillment.setTotalPledgedQuantity(fulfillmentToUpdate.getTotalPledgedQuantity());
            fulfillment.getPosting().setTotalQuantity(fulfillmentToUpdate.getTotalPledgedQuantity());
        }
        
    }
    
    @Override
    public void rejectFulfillment(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentId);
        
        fulfillment.setStatus(FulfillmentStatusEnum.REJECTED);
        fulfillment.getPosting().setLackingQuantity(fulfillment.getPosting().getLackingQuantity() + fulfillment.getTotalPledgedQuantity());
    }
    
    @Override
    public void acceptFulfillment(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillment = getFulfillmentById(fulfillmentId);
        
        fulfillment.setStatus(FulfillmentStatusEnum.ACCEPTED);
    }
    
    @Override
    public void deleteFulfillment(Long fulfillmentId) throws NoResultException {
        FulfillmentEntity fulfillmentToDelete = getFulfillmentById(fulfillmentId);
        
        if (fulfillmentToDelete.getFulfillmentOwner()!= null) {
            fulfillmentToDelete.getFulfillmentOwner().getFulfillments().remove(fulfillmentToDelete);
            fulfillmentToDelete.setFulfillmentOwner(null);
        }
        
        if (fulfillmentToDelete.getPosting()!= null) {
            if (fulfillmentToDelete.getStatus() != FulfillmentStatusEnum.REJECTED) {
                fulfillmentToDelete.getPosting().setLackingQuantity(fulfillmentToDelete.getPosting().getLackingQuantity() + fulfillmentToDelete.getTotalPledgedQuantity());
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
}
