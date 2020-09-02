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
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author zeplh
 */
@Entity
public class HumanResourcePosting implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long humanResourcePostingId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @NotNull
    @Column(nullable=false)
    private Integer totalSlots;
    
    @NotNull
    @Column(nullable=false)
    private Integer obtainedSlots;
    
    @NotNull
    @Column(nullable=false)
    private Integer lackingSlots;
    
    @NotNull
    @Column(nullable=false)
    private String description;
    
     @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date startDate;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date endDate;
    
    @NotNull
    @Column(nullable=false)
    private Double latitude;
    
    @NotNull
    @Column(nullable=false)
    private Double lontitude;
    
    @ManyToOne
    private Activity activity;
    
    @ManyToOne
    @JoinColumn
    private Project project;
    
    

    public Long getHumanResourcePostingId() {
        return humanResourcePostingId;
    }

    public void setHumanResourcePostingId(Long humanResourcePostingId) {
        this.humanResourcePostingId = humanResourcePostingId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (humanResourcePostingId != null ? humanResourcePostingId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the humanResourcePostingId fields are not set
        if (!(object instanceof HumanResourcePosting)) {
            return false;
        }
        HumanResourcePosting other = (HumanResourcePosting) object;
        if ((this.humanResourcePostingId == null && other.humanResourcePostingId != null) || (this.humanResourcePostingId != null && !this.humanResourcePostingId.equals(other.humanResourcePostingId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.HumanResourcePosting[ id=" + humanResourcePostingId + " ]";
    }
    
}
