/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.TaskEntity;
import java.util.List;

/**
 *
 * @author zihua
 */
public class CreateTaskReq {
    
    private TaskEntity newTask;
    private Long projectId;
    private List<Long> predecessorIds;

    public CreateTaskReq() {
    }

    public CreateTaskReq(TaskEntity newTask, Long projectId, List<Long> predecessorIds) {
        this.newTask = newTask;
        this.projectId = projectId;
        this.predecessorIds = predecessorIds;
    }

    public TaskEntity getNewTask() {
        return newTask;
    }

    public void setNewTask(TaskEntity newTask) {
        this.newTask = newTask;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<Long> getPredecessorIds() {
        return predecessorIds;
    }

    public void setPredecessorIds(List<Long> predecessorIds) {
        this.predecessorIds = predecessorIds;
    }
    
    
    
}
