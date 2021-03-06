/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ElectionApplicationEntity;
import entity.ElectionEntity;
import entity.PostEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.UserTypeEnum;
import Exception.DuplicateApplicationException;
import java.util.ArrayList;
import java.util.Date;

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
            PostEntity post = new PostEntity();
            post.setPostOwner(election.getElectionOwner());
            post.setIsPinnedPost(Boolean.TRUE);
            post.setIsElectionPost(true);
            post.setPostDate(election.getStartDate());
            post.setElection(election);
            em.persist(post);
            em.flush();
        } else {
            throw new NoResultException("No Valid Election Owner Found.");
        }
    }
    
    @Override
    public void updateElection(ElectionEntity electionToUpdate) throws NoResultException {
        ElectionEntity oldElectionEntity = em.find(ElectionEntity.class, electionToUpdate.getId());
        if (oldElectionEntity != null) {
            oldElectionEntity.setName(electionToUpdate.getName());
            oldElectionEntity.setDescription(electionToUpdate.getDescription());
            oldElectionEntity.setNumSlots(electionToUpdate.getNumSlots());
            oldElectionEntity.setMinRepPointsRequired(electionToUpdate.getMinRepPointsRequired());
            em.flush();
        } else {
            throw new NoResultException("Election not found");
        }
    }
    
    @Override
    public void endElection(ElectionEntity election) throws NoResultException {
        ElectionEntity electionToEnd = em.find(ElectionEntity.class, election.getId());
        if (electionToEnd != null && electionToEnd.isIsActive()) {
            electionToEnd.setIsActive(false);
            em.flush();
        } else {
            throw new NoResultException("No Active Election Found");
        }
    }
    
    @Override
    public List<ElectionApplicationEntity> getElectionApplicationsForElection(Long electionId) throws NoResultException {
        ElectionEntity election = em.find(ElectionEntity.class, electionId);
        
        if (election != null) {
            List<ElectionApplicationEntity> activeApplications = new ArrayList<>();
            for (int i = 0; i < election.getElectionApplications().size(); i++) {
                if (!election.getElectionApplications().get(i).isIsEndorsed()) {
                    activeApplications.add(election.getElectionApplications().get(i));
                }
            }
            return activeApplications;
        } else {
            throw new NoResultException("Election Not Found.");
        }
    }
    
    @Override
    public void createElectionApplication(ElectionApplicationEntity application) throws NoResultException, DuplicateApplicationException {
        UserEntity user = em.find(UserEntity.class, application.getApplicationOwner().getUserId());
        ElectionEntity election = em.find(ElectionEntity.class, application.getElection().getId());
        
        if (user != null && election != null) {
            List<ElectionApplicationEntity> applications = election.getElectionApplications();
            for (int i = 0; i < applications.size(); i++) {
                if (applications.get(i).getApplicationOwner() == user) {
                    throw new DuplicateApplicationException("User has already applied for this election.");
                }
            }
            em.persist(application);
            em.flush();
            election.getElectionApplications().add(application);
        } else {
            throw new NoResultException("User  Or Election Not Found.");
        }
    }
    
    @Override
    public void rejectElectionApplication(Long applicationId) throws NoResultException {
        ElectionApplicationEntity electionApplication = em.find(ElectionApplicationEntity.class, applicationId);
        
        if (electionApplication != null) {
            electionApplication.getElection().getElectionApplications().remove(electionApplication);
            em.remove(electionApplication);
        } else {
            throw new NoResultException("User  Or Election Not Found.");
        }
    }
    
    @Override
    public void endorseElectionApplication(Long electionApplicationId, Long endorserId) throws NoResultException {
        UserEntity endorser = em.find(UserEntity.class, endorserId);
        ElectionApplicationEntity electionApplication = em.find(ElectionApplicationEntity.class, electionApplicationId);
        
        if (endorser != null && endorser.getUserType() == UserTypeEnum.ADMIN && electionApplication != null && !electionApplication.isIsEndorsed()) {
            electionApplication.setIsEndorsed(true);
            PostEntity post = new PostEntity();
            post.setPostOwner(electionApplication.getApplicationOwner());
            post.setIsElectionPost(true);
            post.setPostDate(new Date());
            post.setElectionApplication(electionApplication);
            post.setEndorser(endorser);
            em.persist(post);
            em.flush();
            electionApplication.getElection().getElectionPosts().add(post);
        } else {
            throw new NoResultException("No Valid Endorser Or Application Found.");
        }
    }
}
