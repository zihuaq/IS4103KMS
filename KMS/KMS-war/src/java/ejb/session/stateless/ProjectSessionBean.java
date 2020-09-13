/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateProjectException;
import Exception.NoResultException;
import entity.ActivityEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.PostEntity;
import entity.ProjectEntity;
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

    @Override
    public Long createNewProject(ProjectEntity newProject, Long userId) throws CreateProjectException {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            em.persist(newProject);
            em.flush();
            
            user.getProjectsOwned().add(newProject);
            newProject.setOwner(user);
            
            return newProject.getProjectId();
        } catch (NoResultException ex) {
            throw new CreateProjectException("User not found");
        }
    }
    
    @Override
    public List<ProjectEntity> retrieveAllProject() {
        Query query = em.createQuery("SELECT p FROM Project p");
        
        return query.getResultList();
    }
    
    @Override
    public List<ProjectEntity> retrieveProjectByStatus(ProjectStatusEnum status) {
        Query query = em.createQuery("SELECT p from Project p WHERE p.status = :inStatus");
        query.setParameter("inStatus", status);
        
        return query.getResultList();
    }
    
    @Override
    public ProjectEntity getProjectById(Long projectId) {
        ProjectEntity project = em.find(ProjectEntity.class, projectId);
        
        return project;
    }
    
    @Override
    public void addContributor(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getContributors().add(user);
        
    }
    
    @Override
    public void removeContributor(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getContributors().remove(user);
        
    }
    
    @Override
    public void updateProject(ProjectEntity projectToUpdate) {
        em.merge(projectToUpdate);
        em.flush();
    }
    
    @Override
    public void updateStatus(Long projectId, ProjectStatusEnum status) {
        ProjectEntity project = getProjectById(projectId);
        
        project.setStatus(status);
    }
    
    @Override
    public void addAdmin(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getAdmins().add(user);
        user.getProjectAdmins().add(project);
    }
    
    @Override
    public void removeAdmin(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getAdmins().add(user);
        user.getProjectAdmins().remove(project);
    }
    
    @Override
    public void changeOwner(Long projectId, Long newOwnerId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(newOwnerId);
        
        project.getOwner().getProjectsOwned().remove(project);
        project.setOwner(user);
        user.getProjectsOwned().add(project);
    }
    
    public void deleteProject(Long projectId) {
        ProjectEntity projectToDelete = getProjectById(projectId);
        
        for (UserEntity user : projectToDelete.getAdmins()) {
            user.getProjectAdmins().remove(projectToDelete);
        }
        projectToDelete.getAdmins().clear();
        
        for (UserEntity user : projectToDelete.getContributors()) {
            user.getProjectsContributed().remove(projectToDelete);
        }
        projectToDelete.getContributors().clear();
        
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
