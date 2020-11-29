/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 *
 * @author zeplh
 */
@Entity
public class IndividualQuestionnaireEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long individualQuestionnaireId;
    
    private String awareOfSDG;
    
    private List<String> passionateSDG;
    
    private List<String> passionateTargets;
    
    private Boolean firstTimeOnSDG;
    
    private List<String> partOfSocialImpactNetwork;

    public Long getIndividualQuestionnaireId() {
        return individualQuestionnaireId;
    }

    public IndividualQuestionnaireEntity(Long individualQuestionnaireId, String awareOfSDG, List<String> passionateSDG, List<String> passionateTargets, Boolean firstTimeOnSDG, List<String> partOfSocialImpactNetwork) {
        this.individualQuestionnaireId = individualQuestionnaireId;
        this.awareOfSDG = awareOfSDG;
        this.passionateSDG = passionateSDG;
        this.passionateTargets = passionateTargets;
        this.firstTimeOnSDG = firstTimeOnSDG;
        this.partOfSocialImpactNetwork = partOfSocialImpactNetwork;
    }

    public IndividualQuestionnaireEntity() {
    }

    public void setIndividualQuestionnaireId(Long individualQuestionnaireId) {
        this.individualQuestionnaireId = individualQuestionnaireId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (individualQuestionnaireId != null ? individualQuestionnaireId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the individualQuestionnaireId fields are not set
        if (!(object instanceof IndividualQuestionnaireEntity)) {
            return false;
        }
        IndividualQuestionnaireEntity other = (IndividualQuestionnaireEntity) object;
        if ((this.individualQuestionnaireId == null && other.individualQuestionnaireId != null) || (this.individualQuestionnaireId != null && !this.individualQuestionnaireId.equals(other.individualQuestionnaireId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.IndividualQuestionnaireEntity[ id=" + individualQuestionnaireId + " ]";
    }

    public String getAwareOfSDG() {
        return awareOfSDG;
    }

    public void setAwareOfSDG(String awareOfSDG) {
        this.awareOfSDG = awareOfSDG;
    }

    public List<String> getPassionateSDG() {
        return passionateSDG;
    }

    public void setPassionateSDG(List<String> passionateSDG) {
        this.passionateSDG = passionateSDG;
    }

    public Boolean getFirstTimeOnSDG() {
        return firstTimeOnSDG;
    }

    public void setFirstTimeOnSDG(Boolean firstTimeOnSDG) {
        this.firstTimeOnSDG = firstTimeOnSDG;
    }

    public List<String> getPartOfSocialImpactNetwork() {
        return partOfSocialImpactNetwork;
    }

    public void setPartOfSocialImpactNetwork(List<String> partOfSocialImpactNetwork) {
        this.partOfSocialImpactNetwork = partOfSocialImpactNetwork;
    }

    public List<String> getPassionateTargets() {
        return passionateTargets;
    }

    public void setPassionateTargets(List<String> passionateTargets) {
        this.passionateTargets = passionateTargets;
    }
    
    
    
}
