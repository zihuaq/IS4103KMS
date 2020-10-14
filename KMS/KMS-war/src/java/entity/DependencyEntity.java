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
public class DependencyEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dependencyId;
    
    @NotNull
    @Column(nullable=false)
    private Integer type;
    
    @ManyToOne
    private TaskEntity predecessor;
    
    @ManyToOne
    private TaskEntity successor;

    public DependencyEntity() {
    }

    public DependencyEntity(Integer type) {
        this.type = type;
    }

    public Long getDependencyId() {
        return dependencyId;
    }

    public void setDependencyId(Long dependencyId) {
        this.dependencyId = dependencyId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (dependencyId != null ? dependencyId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the dependencyId fields are not set
        if (!(object instanceof DependencyEntity)) {
            return false;
        }
        DependencyEntity other = (DependencyEntity) object;
        if ((this.dependencyId == null && other.dependencyId != null) || (this.dependencyId != null && !this.dependencyId.equals(other.dependencyId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.DependencyEntity[ id=" + dependencyId + " ]";
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public TaskEntity getPredecessor() {
        return predecessor;
    }

    public void setPredecessor(TaskEntity predecessor) {
        this.predecessor = predecessor;
    }

    public TaskEntity getSuccessor() {
        return successor;
    }

    public void setSuccessor(TaskEntity successor) {
        this.successor = successor;
    }
    
}
