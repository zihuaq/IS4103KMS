/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.TaskEntity;
import java.util.List;

/**
 *
 * @author chai
 */
public interface TaskSessionBeanRemote {
    public List<TaskEntity> getTasksByProject(Long projectId) throws NoResultException;
    
    public TaskEntity getTaskById(Long taskId) throws NoResultException;

    public Long createNewTask(TaskEntity newTask, Long projectId) throws NoResultException;

    public void updateTask(TaskEntity taskToUpdate) throws NoResultException;

    public void deleteTask(Long taskId) throws NoResultException;
}
