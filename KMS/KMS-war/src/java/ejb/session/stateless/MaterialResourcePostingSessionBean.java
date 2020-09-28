/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourcePostingEntity;
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
public class MaterialResourcePostingSessionBean implements MaterialResourcePostingSessionBeanLocal {

    @EJB(name = "TagSessionBeanLocal")
    private TagSessionBeanLocal tagSessionBeanLocal;

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public Long createMaterialResourcePosting(MaterialResourcePostingEntity newMrp, Long projectId, List<Long> tagIds) throws NoResultException {
        System.out.println("******** MrpSessionBean: createMrp()");
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        
        em.persist(newMrp);
        em.flush();
        
        project.getMaterialResourcePostings().add(newMrp);
        newMrp.setProject(project);
        for (Long id : tagIds) {
            TagEntity tag = tagSessionBeanLocal.getTagById(id);
            newMrp.getTags().add(tag);
        }
        
        return newMrp.getMaterialResourcePostingId();
    }
    
    @Override
    public MaterialResourcePostingEntity getMrpById(Long mrpId) throws NoResultException {
        MaterialResourcePostingEntity mrp = em.find(MaterialResourcePostingEntity.class, mrpId);
        if (mrp != null) {
            return mrp;
        } else {
            throw new NoResultException("Material Resource Posting does not exists.");
        }
    }
    
    @Override
    public List<MaterialResourcePostingEntity> getListOfMaterialResourcePostingByProjectId(Long projectId) {
        Query query = em.createQuery("SELECT mrp FROM MaterialResourcePostingEntity mrp WHERE mrp.project.projectId = :inProjectId");
        query.setParameter("inProjectId", projectId);
        
        return query.getResultList();
    }
    
    @Override
    public void updateMaterialResourcePosting(MaterialResourcePostingEntity mrpToUpdate) throws NoResultException {
        MaterialResourcePostingEntity mrp = getMrpById(mrpToUpdate.getMaterialResourcePostingId());
        mrp.setName(mrpToUpdate.getName());
        mrp.setDescription(mrpToUpdate.getDescription());
        mrp.setStartDate(mrpToUpdate.getStartDate());
        mrp.setEndDate(mrpToUpdate.getEndDate());
        mrp.setTotalQuantity(mrpToUpdate.getTotalQuantity());
        mrp.setLackingQuantity(mrpToUpdate.getLackingQuantity());
        mrp.setUnit(mrpToUpdate.getUnit());
        mrp.setLatitude(mrpToUpdate.getLatitude());
        mrp.setLongitude(mrpToUpdate.getLongitude());
        mrp.getTags().clear();
        for (TagEntity tagToUpdate: mrpToUpdate.getTags()) {
            TagEntity tag = tagSessionBeanLocal.getTagById(tagToUpdate.getTagId());
            mrp.getTags().add(tag);
        }
    }
    
    @Override
    public void deleteMaterialResourcePosting(Long mrpId) throws NoResultException {
        MaterialResourcePostingEntity mrp = getMrpById(mrpId);
        
        mrp.getActivity().getMaterialResourcePostings().remove(mrp);
        mrp.setActivity(null);
        mrp.getProject().getMaterialResourcePostings().remove(mrp);
        mrp.setProject(null);
        
        em.remove(mrp);
    }
}
