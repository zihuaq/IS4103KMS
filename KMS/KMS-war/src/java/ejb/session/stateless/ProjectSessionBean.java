/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateProjectException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import entity.ActivityEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.TagEntity;
import entity.TaskEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.ProjectStatusEnum;

/**
 *
 * @author chai
 */
@Stateless
public class ProjectSessionBean implements ProjectSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;
    
    @EJB(name = "PostSessionBeanLocal")
    private PostSessionBeanLocal postSessionBeanLocal;
    
    @EJB(name = "TagSessionBeanLocal")
    private TagSessionBeanLocal tagSessionBeanLocal;

    @Override
    public Long createNewProject(ProjectEntity newProject, Long userId, List<Long> tagIds) throws CreateProjectException {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            em.persist(newProject);
            em.flush();
            
            user.getProjectsOwned().add(newProject);
            newProject.setProjectOwner(user);
            newProject.getProjectAdmins().add(user);
            user.getProjectAdmins().add(newProject);
            newProject.getProjectMembers().add(user);
            user.getProjectsJoined().add(newProject);
            
            for (Long tagId : tagIds) {
                TagEntity tag = tagSessionBeanLocal.getTagById(tagId);
                newProject.getSdgs().add(tag);
            }
            
            return newProject.getProjectId();
        } catch (NoResultException ex) {
            throw new CreateProjectException("User not found");
        }
    }
    
    @Override
    public List<ProjectEntity> retrieveAllProject() {
        Query query = em.createQuery("SELECT p FROM ProjectEntity p");
        
        return query.getResultList();
    }
    
    @Override
    public List<ProjectEntity> retrieveProjectByStatus(ProjectStatusEnum status) {
        Query query = em.createQuery("SELECT p from ProjectEntity p WHERE p.status = :inStatus");
        query.setParameter("inStatus", status);
        
        return query.getResultList();
    }
    
    @Override
    public ProjectEntity getProjectById(Long projectId) {
        ProjectEntity project = em.find(ProjectEntity.class, projectId);
        
        return project;
    }
    
    //User join project
    @Override
    public void joinProject(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        user.getProjectsJoined().add(project);
        project.getProjectMembers().add(user); 

    }
    
    //Admin/Member leave project or Admin remove Admin/Member from project
    @Override
    public void removeMember(Long projectId, Long userId) throws NoResultException, InvalidRoleException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        if (project.getProjectOwner().getUserId().equals(userId)) {
            throw new InvalidRoleException("Owner cannot leave the project");
            
        } else {
            if (project.getProjectAdmins().contains(user)) {
                project.getProjectAdmins().remove(user);
            }
            user.getProjectsJoined().remove(project);
            project.getProjectMembers().remove(user);
        }
        
    }
    
    @Override
    public void updateProject(ProjectEntity projectToUpdate) throws NoResultException {
        ProjectEntity project = getProjectById(projectToUpdate.getProjectId());
        
        project.setName(projectToUpdate.getName());
        project.setDescription(projectToUpdate.getDescription());
        project.setCountry(projectToUpdate.getCountry());
        project.setStartDate(projectToUpdate.getStartDate());
        project.setEndDate(projectToUpdate.getEndDate());
        for (int i = 0; i < projectToUpdate.getSdgs().size(); i++) {
            TagEntity tag = em.find(TagEntity.class, projectToUpdate.getSdgs().get(i).getTagId());
           if (tag == null) {
               throw new NoResultException("SDG tag not found.");
           }
        }
        project.setSdgs(projectToUpdate.getSdgs());
        
    }
    
    //Change project status
    @Override
    public void updateStatus(Long projectId, String status) {
        ProjectEntity project = getProjectById(projectId);

        project.setStatus(ProjectStatusEnum.valueOf(status));
    }
    
    //Promote Member to Admin
    @Override
    public void addAdmin(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getProjectAdmins().add(user);
        user.getProjectAdmins().add(project);
    }
    
    //Demote Admin to Member
    @Override
    public void removeAdmin(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getProjectAdmins().remove(user);
        user.getProjectAdmins().remove(project);
    }
    
    //Pass Owner status to Admin
    @Override
    public void changeOwner(Long projectId, Long newOwnerId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(newOwnerId);
        
        project.getProjectOwner().getProjectsOwned().remove(project);
        project.setProjectOwner(user);
        user.getProjectsOwned().add(project);
    }
    
    @Override
    public void deleteProject(Long projectId) {
        ProjectEntity projectToDelete = getProjectById(projectId);
        
        projectToDelete.getProjectOwner().getProjectsOwned().remove(projectToDelete);
        projectToDelete.setProjectOwner(null);
        
        for (UserEntity user : projectToDelete.getProjectAdmins()) {
            user.getProjectAdmins().remove(projectToDelete);
        }
        projectToDelete.getProjectAdmins().clear();
        
        for (UserEntity user : projectToDelete.getProjectMembers()) {
            user.getProjectsJoined().remove(projectToDelete);
        }
        projectToDelete.getProjectMembers().clear();
        
        for (ActivityEntity activity : projectToDelete.getActivities()) {
            activity.setProject(null);
        }
        projectToDelete.getActivities().clear();
        
        for (HumanResourcePostingEntity hrp : projectToDelete.getHumanResourcePostings()) {
            hrp.setProject(null);
            // Delete hrp here
        }
        projectToDelete.getHumanResourcePostings().clear();
        
        for (MaterialResourcePostingEntity mrp : projectToDelete.getMaterialResourcePostings()) {
            mrp.setProject(null);
            // Delete mrp here
        }
        projectToDelete.getMaterialResourcePostings().clear();
        
        for (TaskEntity task : projectToDelete.getTasks()) {
            task.setProject(null);
            // Delete task here
        }
        projectToDelete.getTasks().clear();
        
        for (PostEntity post : projectToDelete.getPosts()) {
            postSessionBeanLocal.deletePost(post.getPostId());
        }
        projectToDelete.getPosts().clear();
        
        em.remove(projectToDelete);
    }
}
