/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

/**
 *
 * @author zeplh
 */
public class CreateAwardRsp {
    
    Long awardId;

    public CreateAwardRsp() {
    }

    public CreateAwardRsp(Long awardId) {
        this.awardId = awardId;
    }

    public Long getAwardId() {
        return awardId;
    }

    public void setAwardId(Long awardId) {
        this.awardId = awardId;
    }
}
