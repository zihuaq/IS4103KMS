/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateProjectException;
import Exception.NoResultException;
import entity.Activity;
import entity.HumanResourcePosting;
import entity.MaterialResourcePosting;
import entity.Post;
import entity.Project;
import entity.Task;
import entity.User;
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
    public Long createNewProject(Project newProject, Long userId) throws CreateProjectException {
        try {
            User user = userSessionBeanLocal.getUserById(userId);
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
    public List<Project> retrieveAllProject() {
        Query query = em.createQuery("SELECT p FROM Project p");
        
        return query.getResultList();
    }
    
    @Override
    public List<Project> retrieveProjectByStatus(ProjectStatusEnum status) {
        Query query = em.createQuery("SELECT p from Project p WHERE p.status = :inStatus");
        query.setParameter("inStatus", status);
        
        return query.getResultList();
    }
    
    @Override
    public Project getProjectById(Long projectId) {
        Project project = em.find(Project.class, projectId);
        
        return project;
    }
    
    @Override
    public void addContributor(Long projectId, Long userId) throws NoResultException {
        Project project = getProjectById(projectId);
        
        User user = userSessionBeanLocal.getUserById(userId);
        
        project.getContributors().add(user);
        
    }
    
    @Override
    public void removeContributor(Long projectId, Long userId) throws NoResultException {
        Project project = getProjectById(projectId);
        
        User user = userSessionBeanLocal.getUserById(userId);
        
        project.getContributors().remove(user);
        
    }
    
    @Override
    public void updateProject(Project projectToUpdate) {
        em.merge(projectToUpdate);
        em.flush();
    }
    
    @Override
    public void updateStatus(Long projectId, ProjectStatusEnum status) {
        Project project = getProjectById(projectId);
        
        project.setStatus(status);
    }
    
    @Override
    public void addAdmin(Long projectId, Long userId) throws NoResultException {
        Project project = getProjectById(projectId);
        User user = userSessionBeanLocal.getUserById(userId);
        
        project.getAdmins().add(user);
        user.getProjectAdmins().add(project);
    }
    
    @Override
    public void removeAdmin(Long projectId, Long userId) throws NoResultException {
        Project project = getProjectById(projectId);
        User user = userSessionBeanLocal.getUserById(userId);
        
        project.getAdmins().add(user);
        user.getProjectAdmins().remove(project);
    }
    
    @Override
    public void changeOwner(Long projectId, Long newOwnerId) throws NoResultException {
        Project project = getProjectById(projectId);
        User user = userSessionBeanLocal.getUserById(newOwnerId);
        
        project.getOwner().getProjectsOwned().remove(project);
        project.setOwner(user);
        user.getProjectsOwned().add(project);
    }
    
    public void deleteProject(Long projectId) {
        Project projectToDelete = getProjectById(projectId);
        
        for (User user : projectToDelete.getAdmins()) {
            user.getProjectAdmins().remove(projectToDelete);
        }
        projectToDelete.getAdmins().clear();
        
        for (User user : projectToDelete.getContributors()) {
            user.getProjectsContributed().remove(projectToDelete);
        }
        projectToDelete.getContributors().clear();
        
        for (Activity activity : projectToDelete.getActivities()) {
            activity.setProject(null);
        }
        projectToDelete.getActivities().clear();
        
        for (HumanResourcePosting hrp : projectToDelete.getHumanResourcePostings()) {
            hrp.setProject(null);
            // Delete hrp here
        }
        projectToDelete.getHumanResourcePostings().clear();
        
        for (MaterialResourcePosting mrp : projectToDelete.getMaterialResourcePostings()) {
            mrp.setProject(null);
            // Delete mrp here
        }
        projectToDelete.getMaterialResourcePostings().clear();
        
        for (Task task : projectToDelete.getTasks()) {
            task.setProject(null);
            // Delete task here
        }
        projectToDelete.getTasks().clear();
        
        for (Post post : projectToDelete.getPosts()) {
            postSessionBeanLocal.deletePost(post.getPostId());
        }
        projectToDelete.getPosts().clear();
        
        em.remove(projectToDelete);
    }
}
