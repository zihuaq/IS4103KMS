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
import entity.UserEntity;
import java.util.Date;
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

    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;

    @EJB(name = "TagSessionBeanLocal")
    private TagSessionBeanLocal tagSessionBeanLocal;

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
           
    @Override
    public Long createHumanResourcePostingEntity(HumanResourcePostingEntity newHrp, Long projectId, List<Long> tagIds) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        newHrp.setObtainedSlots(0);
        newHrp.setLackingSlots(newHrp.getTotalSlots());
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
    public HumanResourcePostingEntity getHrpById(Long hrpId) throws NoResultException {
        HumanResourcePostingEntity hrp = em.find(HumanResourcePostingEntity.class, hrpId);
        if (hrp != null) {
            hrp.getTags().size();
            return hrp;
        } else {
            throw new NoResultException("Huaman Resource Posting does not exists.");
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
        hrp.setLackingSlots(hrp.getTotalSlots() - hrp.getObtainedSlots());
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
        if (hrp.getActivity() != null) {
            hrp.getActivity().getHumanResourcePostings().remove(hrp);
            hrp.setActivity(null);
        }
        if (hrp.getProject() != null) {
            hrp.getProject().getHumanResourcePostings().remove(hrp);
            hrp.setProject(null);
        }
        if (hrp.getAppliedUsers().size() > 0) {
            for (UserEntity user : hrp.getAppliedUsers()) {
                user.getHrpApplied().remove(hrp);           
            }
            hrp.getAppliedUsers().clear();
        }
        em.remove(hrp);
    }
    
    @Override
    public void joinHrp(Long userId, Long hrpId) throws NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        HumanResourcePostingEntity hrp = getHrpById(hrpId);
        
        hrp.getAppliedUsers().add(user);
        user.getHrpApplied().add(hrp);
        
        hrp.setObtainedSlots(hrp.getObtainedSlots() + 1);
        hrp.setLackingSlots(hrp.getLackingSlots() - 1);
    }
    
    @Override
    public void leaveHrp(Long userId, Long hrpId) throws NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        HumanResourcePostingEntity hrp = getHrpById(hrpId);
        
        hrp.getAppliedUsers().remove(user);
        user.getHrpApplied().remove(hrp);
        
        hrp.setObtainedSlots(hrp.getObtainedSlots() - 1);
        hrp.setLackingSlots(hrp.getLackingSlots() + 1);
    }
    
    @Override
    public List<HumanResourcePostingEntity> availableHrp(Long projectId, Date startDate, Date endDate) {
        Query query = em.createQuery("SELECT hrp FROM HumanResourcePostingEntity hrp WHERE hrp.project.projectId = :inProjectId AND hrp.activity IS NULL AND hrp.startDate <= :inStartDate AND hrp.endDate >= :inEndDate");
        query.setParameter("inProjectId", projectId);
        query.setParameter("inStartDate", startDate);
        query.setParameter("inEndDate", endDate);
        
        return query.getResultList();
    }
    
    @Override
    public List<HumanResourcePostingEntity> getHrpByActivityId(Long activityId) {
        Query query = em.createQuery("SELECT hrp FROM HumanResourcePostingEntity hrp WHERE hrp.activity.activityId = :inActivityId");
        query.setParameter("inActivityId", activityId);
        
        return query.getResultList();
    }
    
}
