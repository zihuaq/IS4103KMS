/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.MaterialResourceAvailableEntity;

/**
 *
 * @author Cassie
 */
public class MrpMatchesRsp {
    
    private MaterialResourceAvailableEntity mraToRecommend;
    
    private double percentageMatch;

    public MrpMatchesRsp() {
    }

    public MaterialResourceAvailableEntity getMraToRecommend() {
        return mraToRecommend;
    }

    public void setMraToRecommend(MaterialResourceAvailableEntity mraToRecommend) {
        this.mraToRecommend = mraToRecommend;
    }

    public double getPercentageMatch() {
        return percentageMatch;
    }

    public void setPercentageMatch(double percentageMatch) {
        this.percentageMatch = percentageMatch;
    }
}
