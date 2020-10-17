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
    public List<TaskEntity> getTasksByProject(Long projectId) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        List<TaskEntity> tasks = project.getTasks();
        
        tasks.size();
        return tasks;
    }
    
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
        
        if (newTask.getParent() != 0l) {
            TaskEntity parentTask = this.getTaskById(newTask.getParent());
            newTask.setParentTask(parentTask);  
        }
        
        em.persist(newTask);
        em.flush();
        
        return newTask.getId();
    }
    
    @Override
    public void updateTask(TaskEntity taskToUpdate) throws NoResultException {
        TaskEntity task = this.getTaskById(taskToUpdate.getId());
        
        task.setText(taskToUpdate.getText());
        task.setStart_date(taskToUpdate.getStart_date());
        task.setEnd_date(taskToUpdate.getEnd_date());
        task.setProgress(taskToUpdate.getProgress());   
        task.setParent(taskToUpdate.getParent());
    }
    
    @Override
    public void deleteTask(Long taskId) throws NoResultException {
        TaskEntity taskToDelete = this.getTaskById(taskId);
        
        taskToDelete.getProject().getTasks().remove(taskToDelete);
        taskToDelete.setProject(null);
        
        taskToDelete.setParentTask(null);
        
        em.remove(taskToDelete);
    }
    
}
