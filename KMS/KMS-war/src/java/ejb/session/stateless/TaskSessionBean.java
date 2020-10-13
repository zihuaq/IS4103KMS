/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ProjectEntity;
import entity.TaskEntity;
import java.util.List;
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
    public Long createNewTask(TaskEntity newTask, Long projectId, List<Long> predecessorIds) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        
        newTask.setProject(project);
        project.getTasks().add(newTask);
        
        if (!predecessorIds.isEmpty()) {
            for (Long predecessorId : predecessorIds) {
                TaskEntity predecessor = this.getTaskById(predecessorId);
            
                newTask.getPredecessors().add(predecessor); 
            }   
        }
        
        em.persist(newTask);
        em.flush();
        
        return newTask.getTaskId();
    }
    
    @Override
    public void updateTask(TaskEntity taskToUpdate) throws NoResultException {
        TaskEntity task = this.getTaskById(taskToUpdate.getTaskId());
        
        task.setName(taskToUpdate.getName());
        task.setDescription(taskToUpdate.getDescription());
        task.setStartDate(taskToUpdate.getStartDate());
        task.setEndDate(taskToUpdate.getEndDate());
        for (TaskEntity predecessor: taskToUpdate.getPredecessors()) {
            this.getTaskById(predecessor.getTaskId());
        }
        task.setPredecessors(taskToUpdate.getPredecessors());
        
    }
    
    @Override
    public void deleteTask(Long taskId) throws NoResultException {
        TaskEntity taskToDelete = this.getTaskById(taskId);
        
        taskToDelete.getProject().getTasks().remove(taskToDelete);
        taskToDelete.setProject(null);
        
        taskToDelete.getPredecessors().clear();
    }
    
}
