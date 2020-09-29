/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.HumanResourcePostingEntity;
import entity.ProjectEntity;
import entity.TagEntity;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author chai
 */
@Stateless
public class HumanResourcePostingSessionBean implements HumanResourcePostingSessionBeanLocal {

    @EJB(name = "TagSessionBeanLocal")
    private TagSessionBeanLocal tagSessionBeanLocal;

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
           
    @Override
    public Long createHumanResourcePostingEntity(HumanResourcePostingEntity newHrp, Long projectId, List<Long> tagIds) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        em.persist(newHrp);
        em.flush();
        
        project.getHumanResourcePostings().add(newHrp);
        newHrp.setProject(project);
        
        for (Long id : tagIds) {
            TagEntity tag = tagSessionBeanLocal.getTagById(id);
            newHrp.getTags().add(tag);
        }
        
        return newHrp.getHumanResourcePostingId();
    }
    
    @Override
    public HumanResourcePostingEntity getHrpById(Long mrpId) throws NoResultException {
        HumanResourcePostingEntity mrp = em.find(HumanResourcePostingEntity.class, mrpId);
        if (mrp != null) {
            return mrp;
        } else {
            throw new NoResultException("Material Resource Posting does not exists.");
        }
    }
    
    @Override
    public List<HumanResourcePostingEntity> getListOfHumanResourcePostingByProjectId(Long projectId) {
        Query query = em.createQuery("SELECT hrp FROM HumanResourcePostingEntity hrp WHERE hrp.project.projectId = :inProjectId");
        query.setParameter("inProjectId", projectId);
        
        return query.getResultList();
    }
    
    @Override
    public void updateHumanResourcePosting(HumanResourcePostingEntity hrpToUpdate) throws NoResultException {
        HumanResourcePostingEntity hrp = getHrpById(hrpToUpdate.getHumanResourcePostingId());
        hrp.setName(hrpToUpdate.getName());
        hrp.setDescription(hrpToUpdate.getDescription());
        hrp.setStartDate(hrpToUpdate.getStartDate());
        hrp.setEndDate(hrpToUpdate.getEndDate());
        hrp.setTotalSlots(hrpToUpdate.getTotalSlots());
        hrp.setLatitude(hrpToUpdate.getLatitude());
        hrp.setLongitude(hrpToUpdate.getLongitude());
        hrp.getTags().clear();
        for (TagEntity tagToUpdate: hrpToUpdate.getTags()) {
            TagEntity tag = tagSessionBeanLocal.getTagById(tagToUpdate.getTagId());
            hrp.getTags().add(tag);
        }
    }
    
    @Override
    public void deleteHumanResourcePosting(Long hrpId) throws NoResultException {
        HumanResourcePostingEntity hrp = getHrpById(hrpId);
        
//        hrp.getActivity().getHumanResourcePostings().remove(hrp);
//        hrp.setActivity(null);
        hrp.getProject().getHumanResourcePostings().remove(hrp);
        hrp.setProject(null);
        
        em.remove(hrp);
    }

    
}
