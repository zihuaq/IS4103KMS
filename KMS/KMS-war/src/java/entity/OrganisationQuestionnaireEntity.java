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
public class OrganisationQuestionnaireEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long OrganisationQuestionnaireId;
    
     private String awareOfSDG;
     
     private List<String> workingOnSDG;
     
     private List<String> workingOnTargets;
     
     private List<String> partOfSocialImpactNetwork;

    public OrganisationQuestionnaireEntity() {
    }

    public OrganisationQuestionnaireEntity(Long OrganisationQuestionnaireId, String awareOfSDG, List<String> workingOnSDG, List<String> workingOnTargets, List<String> partOfSocialImpactNetwork) {
        this.OrganisationQuestionnaireId = OrganisationQuestionnaireId;
        this.awareOfSDG = awareOfSDG;
        this.workingOnSDG = workingOnSDG;
        this.workingOnTargets = workingOnTargets;
        this.partOfSocialImpactNetwork = partOfSocialImpactNetwork;
    }
     
     

    public Long getOrganisationQuestionnaireId() {
        return OrganisationQuestionnaireId;
    }

    public void setOrganisationQuestionnaireId(Long OrganisationQuestionnaireId) {
        this.OrganisationQuestionnaireId = OrganisationQuestionnaireId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (OrganisationQuestionnaireId != null ? OrganisationQuestionnaireId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the OrganisationQuestionnaireId fields are not set
        if (!(object instanceof OrganisationQuestionnaireEntity)) {
            return false;
        }
        OrganisationQuestionnaireEntity other = (OrganisationQuestionnaireEntity) object;
        if ((this.OrganisationQuestionnaireId == null && other.OrganisationQuestionnaireId != null) || (this.OrganisationQuestionnaireId != null && !this.OrganisationQuestionnaireId.equals(other.OrganisationQuestionnaireId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.OrganisationQuestionnaireEntity[ id=" + OrganisationQuestionnaireId + " ]";
    }

    public String getAwareOfSDG() {
        return awareOfSDG;
    }

    public void setAwareOfSDG(String awareOfSDG) {
        this.awareOfSDG = awareOfSDG;
    }

    public List<String> getWorkingOnSDG() {
        return workingOnSDG;
    }

    public void setWorkingOnSDG(List<String> workingOnSDG) {
        this.workingOnSDG = workingOnSDG;
    }

    public List<String> getWorkingOnTargets() {
        return workingOnTargets;
    }

    public void setWorkingOnTargets(List<String> workingOnTargets) {
        this.workingOnTargets = workingOnTargets;
    }

    public List<String> getPartOfSocialImpactNetwork() {
        return partOfSocialImpactNetwork;
    }

    public void setPartOfSocialImpactNetwork(List<String> partOfSocialImpactNetwork) {
        this.partOfSocialImpactNetwork = partOfSocialImpactNetwork;
    }
    
}
