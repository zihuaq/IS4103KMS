/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

/**
 *
 * @author zihua
 */
@Entity
public class LinkEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(nullable=false)
    private Long source;
    
    @NotNull
    @Column(nullable=false)
    private Long target;
    
    @NotNull
    @Column(nullable=false)
    private Integer type;
    
    @ManyToOne
    private TaskEntity sourceTask;
    
    @ManyToOne
    private TaskEntity targetTask;

    public LinkEntity() {
    }

    public LinkEntity(Long source, Long target, Integer type) {
        this.source = source;
        this.target = target;
        this.type = type;
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
        if (!(object instanceof LinkEntity)) {
            return false;
        }
        LinkEntity other = (LinkEntity) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.DependencyEntity[ id=" + id + " ]";
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getSource() {
        return source;
    }

    public void setSource(Long source) {
        this.source = source;
    }

    public Long getTarget() {
        return target;
    }

    public void setTarget(Long target) {
        this.target = target;
    }

    public TaskEntity getSourceTask() {
        return sourceTask;
    }

    public void setSourceTask(TaskEntity sourceTask) {
        this.sourceTask = sourceTask;
    }

    public TaskEntity getTargetTask() {
        return targetTask;
    }

    public void setTargetTask(TaskEntity targetTask) {
        this.targetTask = targetTask;
    }
    
}
