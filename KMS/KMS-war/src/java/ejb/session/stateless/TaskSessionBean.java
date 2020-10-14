/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ProjectEntity;
import entity.TaskEntity;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author zihua
 */
@Stateless
public class TaskSessionBean implements TaskSessionBeanLocal {

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public TaskEntity getTaskById(Long taskId) throws NoResultException {
        TaskEntity task = em.find(TaskEntity.class, taskId);
        
        if (task != null) {
            return task;
        } else {
            throw new NoResultException("Task does not exist");
        }
    }
    
    @Override
    public Long createNewTask(TaskEntity newTask, Long projectId) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        
        newTask.setProject(project);
        project.getTasks().add(newTask);
        
        if (newTask.getParent().getTaskId() != 0l) {
            TaskEntity parent = this.getTaskById(newTask.getParent().getTaskId());
            newTask.setParent(parent);  
        }
        
        em.persist(newTask);
        em.flush();
        
        return newTask.getTaskId();
    }
    
    @Override
    public void updateTask(TaskEntity taskToUpdate) throws NoResultException {
        TaskEntity task = this.getTaskById(taskToUpdate.getTaskId());
        
        task.setTitle(taskToUpdate.getTitle());
        task.setStartDate(taskToUpdate.getStartDate());
        task.setEndDate(taskToUpdate.getEndDate());
        task.setProgress(taskToUpdate.getProgress());       
    }
    
    @Override
    public void deleteTask(Long taskId) throws NoResultException {
        TaskEntity taskToDelete = this.getTaskById(taskId);
        
        taskToDelete.getProject().getTasks().remove(taskToDelete);
        taskToDelete.setProject(null);
        
        taskToDelete.setParent(null);
        
        em.remove(taskToDelete);
    }
    
}
