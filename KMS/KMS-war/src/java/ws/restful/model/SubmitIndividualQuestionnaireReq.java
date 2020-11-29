/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.IndividualQuestionnaireEntity;
import entity.TagEntity;
import java.util.List;

/**
 *
 * @author zeplh
 */
public class SubmitIndividualQuestionnaireReq {
    
    private Long userId;
    private IndividualQuestionnaireEntity individualQuestionnaire;
    private List<TagEntity> sdgs;

    public SubmitIndividualQuestionnaireReq() {
    }

    public SubmitIndividualQuestionnaireReq(Long userId, IndividualQuestionnaireEntity individualQuestionnaire, List<TagEntity> sdgs) {
        this.userId = userId;
        this.individualQuestionnaire = individualQuestionnaire;
        this.sdgs = sdgs;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public IndividualQuestionnaireEntity getIndividualQuestionnaire() {
        return individualQuestionnaire;
    }

    public void setIndividualQuestionnaire(IndividualQuestionnaireEntity individualQuestionnaire) {
        this.individualQuestionnaire = individualQuestionnaire;
    }

    public List<TagEntity> getSdgs() {
        return sdgs;
    }

    public void setSdgs(List<TagEntity> sdgs) {
        this.sdgs = sdgs;
    }
    
    
    
}
