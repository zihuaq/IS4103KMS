/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author Cassie
 */
@Entity
public class ElectionEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Temporal(TemporalType.DATE)
    private Date startDate;
    
    @Temporal(TemporalType.DATE)
    private Date endDate;
    
    @NotNull
    private String name;
    
    private String description;
    
    @NotNull
    private boolean isActive;
    
    @NotNull
    private int numSlots;
    
    @NotNull
    private int minRepPointsRequired;
    
    @NotNull
    @JoinColumn(nullable=false)
    @ManyToOne
    private UserEntity electionOwner;
    
    @JoinTable(name = "electionPosts")
    @OneToMany
    private List<PostEntity> electionPosts;
    
    @JoinTable(name = "electionApplications")
    @OneToMany
    private List<ElectionApplicationEntity> electionApplications;

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
        if (!(object instanceof ElectionEntity)) {
            return false;
        }
        ElectionEntity other = (ElectionEntity) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.ElectionEntity[ id=" + id + " ]";
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public UserEntity getElectionOwner() {
        return electionOwner;
    }

    public void setElectionOwner(UserEntity electionOwner) {
        this.electionOwner = electionOwner;
    }

    public List<PostEntity> getElectionPosts() {
        return electionPosts;
    }

    public void setElectionPosts(List<PostEntity> electionPosts) {
        this.electionPosts = electionPosts;
    }

    public List<ElectionApplicationEntity> getElectionApplications() {
        return electionApplications;
    }

    public void setElectionApplications(List<ElectionApplicationEntity> electionApplications) {
        this.electionApplications = electionApplications;
    }

    public int getNumSlots() {
        return numSlots;
    }

    public void setNumSlots(int numSlots) {
        this.numSlots = numSlots;
    }

    public int getMinRepPointsRequired() {
        return minRepPointsRequired;
    }

    public void setMinRepPointsRequired(int minRepPointsRequired) {
        this.minRepPointsRequired = minRepPointsRequired;
    }
}
