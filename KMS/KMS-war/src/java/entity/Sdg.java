/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

/**
 *
 * @author chai
 */
@Entity
public class Sdg implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sdgId;
    
    private String description;
    
    @OneToMany
    private List<Project> projects;

    public Sdg() {
        this.projects = new ArrayList<>();
    }

    public Sdg(String description) {
        this();
        this.description = description;
    }
    
    public Long getSdgId() {
        return sdgId;
    }

    public void setSdgId(Long sdgId) {
        this.sdgId = sdgId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (sdgId != null ? sdgId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the sdgId fields are not set
        if (!(object instanceof Sdg)) {
            return false;
        }
        Sdg other = (Sdg) object;
        if ((this.sdgId == null && other.sdgId != null) || (this.sdgId != null && !this.sdgId.equals(other.sdgId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Sdg[ id=" + sdgId + " ]";
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
    
}
