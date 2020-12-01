/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author zeplh
 */
@Entity
public class TaskEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(nullable=false)
    private String text;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date start_date;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date end_date;
    
    @NotNull
    @Column(nullable=false)
    private Double progress;
    
    @NotNull
    @Column(nullable=false)
    private Long parent;
    
    @ManyToOne
    private ProjectEntity project;
    
    @ManyToOne
    private TaskEntity parentTask;

    public TaskEntity() {
    }

    public TaskEntity(String name, Date startDate, Date endDate, Double progress, Long parent) {
        this();
        this.text = name;
        this.start_date = startDate;
        this.end_date = endDate;
        this.progress = progress;
        this.parent = parent;
    } 

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof TaskEntity)) {
            return false;
        }
        TaskEntity other = (TaskEntity) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Task[ id=" + id + " ]";
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getStart_date() {
        return start_date;
    }

    public void setStart_date(Date start_date) {
        this.start_date = start_date;
    }

    public Date getEnd_date() {
        return end_date;
    }

    public void setEnd_date(Date end_date) {
        this.end_date = end_date;
    }
    
    public Double getProgress() {
        return progress;
    }

    public void setProgress(Double progress) {
        this.progress = progress;
    }

    public Long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }
    
    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public TaskEntity getParentTask() {
        return parentTask;
    }

    public void setParentTask(TaskEntity parentTask) {
        this.parentTask = parentTask;
    }
    
}
