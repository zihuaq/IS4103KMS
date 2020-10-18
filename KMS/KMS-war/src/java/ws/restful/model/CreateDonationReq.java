/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.model;

import entity.DonationEntity;

/**
 *
 * @author zihua
 */
public class CreateDonationReq {
    
    private DonationEntity newDonation;
    private Long userId;
    private Long projectId;

    public CreateDonationReq() {
    }

    public CreateDonationReq(DonationEntity newDonation, Long userId, Long projectId) {
        this.newDonation = newDonation;
        this.userId = userId;
        this.projectId = projectId;
    }

    public DonationEntity getNewDonation() {
        return newDonation;
    }

    public void setNewDonation(DonationEntity newDonation) {
        this.newDonation = newDonation;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
    
}
