/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ActivityEntity;
import entity.MaterialResourcePostingEntity;
import entity.ProjectEntity;
import entity.TagEntity;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Local;
import javax.ejb.Remote;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.MrpStatusEnum;

/**
 *
 * @author chai
 */
@Stateless
@Local(MaterialResourcePostingSessionBeanLocal.class)
@Remote(MaterialResourcePostingSessionBeanRemote.class)
public class MaterialResourcePostingSessionBean implements MaterialResourcePostingSessionBeanLocal, MaterialResourcePostingSessionBeanRemote {

    @EJB(name = "ActivitySessionBeanLocal")
    private ActivitySessionBeanLocal activitySessionBeanLocal;

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
        
        newMrp.setLackingQuantity(newMrp.getTotalQuantity());
        newMrp.setObtainedQuantity(0.0);
        
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
            mrp.getTags().size();
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
        LocalDate today = LocalDate.now();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        LocalDate startDate = LocalDate.parse(sdf.format(mrp.getStartDate()));
        
        if (mrp.getLackingQuantity() == 0.0 || !today.isBefore(startDate)) {
            mrp.setStatus(MrpStatusEnum.CLOSED);
        } else {
            mrp.setStatus(MrpStatusEnum.OPEN);
        }
    }
    
    @Override
    public void deleteMaterialResourcePosting(Long mrpId) throws NoResultException {
        MaterialResourcePostingEntity mrp = getMrpById(mrpId);
        if (mrp.getActivity() != null) {
            mrp.getActivity().getMaterialResourcePostings().remove(mrp);
            mrp.setActivity(null);
        }
        if (mrp.getProject() != null) {
            mrp.getProject().getMaterialResourcePostings().remove(mrp);
            mrp.setProject(null);
        }
        em.remove(mrp);
    }
    
    @Override
    public List<MaterialResourcePostingEntity> getListOfAvailableMrp(Long projectId, Long activityId) throws NoResultException {
        
        ActivityEntity activity = activitySessionBeanLocal.getActivityById(activityId);

        Query query = em.createQuery("SELECT mrp FROM MaterialResourcePostingEntity mrp WHERE mrp.project.projectId = :inProjectId AND mrp.startDate <= :inStartDate AND (mrp.endDate >= :inEndDate OR mrp.endDate IS NULL) AND mrp.activity IS NULL");
        query.setParameter("inProjectId", projectId);
        query.setParameter("inStartDate", activity.getStartDate());
        query.setParameter("inEndDate", activity.getEndDate());
        
        return query.getResultList();
    }
}
