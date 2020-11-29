/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.OrganisationQuestionnaireEntity;
import entity.TagEntity;
import java.util.List;

/**
 *
 * @author zeplh
 */
public class SubmitOrganisationQuestionnaireReq {
     private Long userId;
    private OrganisationQuestionnaireEntity organisationQuestionnaire;
    private List<TagEntity> sdgs;

    public SubmitOrganisationQuestionnaireReq() {
    }

    public SubmitOrganisationQuestionnaireReq(Long userId, OrganisationQuestionnaireEntity organisationQuestionnaire, List<TagEntity> sdgs) {
        this.userId = userId;
        this.organisationQuestionnaire = organisationQuestionnaire;
        this.sdgs = sdgs;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public OrganisationQuestionnaireEntity getOrganisationQuestionnaire() {
        return organisationQuestionnaire;
    }

    public void setOrganisationQuestionnaire(OrganisationQuestionnaireEntity organisationQuestionnaire) {
        this.organisationQuestionnaire = organisationQuestionnaire;
    }

    public List<TagEntity> getSdgs() {
        return sdgs;
    }

    public void setSdgs(List<TagEntity> sdgs) {
        this.sdgs = sdgs;
    }
    
    
}
