/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ElectionEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.UserTypeEnum;

/**
 *
 * @author Cassie
 */
@Stateless
public class ElectionSessionBean implements ElectionSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public boolean hasActiveElection() {
        Query q = em.createQuery("SELECT e FROM ElectionEntity e WHERE e.isActive = true");
        List<ElectionEntity> activeElections = q.getResultList();

        if (activeElections.size() > 0) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public ElectionEntity getActiveElection() throws NoResultException {
        Query q = em.createQuery("SELECT e FROM ElectionEntity e WHERE e.isActive = true");
        List<ElectionEntity> activeElections = q.getResultList();

        if (activeElections.size() == 0) {
            throw new NoResultException("No Active Election.");
        }
        return activeElections.get(0);
    }

    @Override
    public void createElection(ElectionEntity election) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, election.getElectionOwner().getUserId());
        if (user != null && user.getUserType() == UserTypeEnum.ADMIN) {
            em.persist(election);
            em.flush();
        } else {
            throw new NoResultException("No Valid Election Owner Found.");
        }
    }
}
