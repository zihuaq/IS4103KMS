/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class BadgeEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long badgeId;
    
    @NotNull
    @Column(nullable=false)
    private String name;
    
    @NotNull
    @Column(nullable=false)
    private String description;
    
    @NotNull
    @Column(nullable=false)
    private Integer tierOneRequirement;
    
    @NotNull
    @Column(nullable=false)
    private Integer tierTwoRequirement;
    
    @NotNull
    @Column(nullable=false)
    private Integer tierThreeRequirement;
    
    @Lob
    @Column
    private String tierZeroPicture;
    
    @Lob
    @Column
    private String tierOnePicture;
    
    @Lob
    @Column
    private String tierTwoPicture;
    
    @Lob
    @Column
    private String tierThreePicture;
    
    

    public BadgeEntity() {
    }

    public BadgeEntity(String name, String description) {
        this();
        this.name = name;
        this.description = description;
    }

//    public BadgeEntity(Long badgeId, String name, String description, Integer tierOneRequirement, Integer tierTwoRequirement, Integer tierThreeRequirement) {
//        this.badgeId = badgeId;
//        this.name = name;
//        this.description = description;
//        this.tierOneRequirement = tierOneRequirement;
//        this.tierTwoRequirement = tierTwoRequirement;
//        this.tierThreeRequirement = tierThreeRequirement;
//    }

    public BadgeEntity(Long badgeId, String name, String description, Integer tierOneRequirement, Integer tierTwoRequirement, Integer tierThreeRequirement, String tierZeroPicture, String tierOnePicture, String tierTwoPicture, String tierThreePicture) {
        this.badgeId = badgeId;
        this.name = name;
        this.description = description;
        this.tierOneRequirement = tierOneRequirement;
        this.tierTwoRequirement = tierTwoRequirement;
        this.tierThreeRequirement = tierThreeRequirement;
        this.tierZeroPicture = tierZeroPicture;
        this.tierOnePicture = tierOnePicture;
        this.tierTwoPicture = tierTwoPicture;
        this.tierThreePicture = tierThreePicture;
    }
    
    
    
    public Long getBadgeId() {
        return badgeId;
    }

    public void setBadgeId(Long badgeId) {
        this.badgeId = badgeId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (badgeId != null ? badgeId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the badgeId fields are not set
        if (!(object instanceof BadgeEntity)) {
            return false;
        }
        BadgeEntity other = (BadgeEntity) object;
        if ((this.badgeId == null && other.badgeId != null) || (this.badgeId != null && !this.badgeId.equals(other.badgeId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Badge[ id=" + badgeId + " ]";
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

    public Integer getTierOneRequirement() {
        return tierOneRequirement;
    }

    public void setTierOneRequirement(Integer tierOneRequirement) {
        this.tierOneRequirement = tierOneRequirement;
    }

    public Integer getTierTwoRequirement() {
        return tierTwoRequirement;
    }

    public void setTierTwoRequirement(Integer tierTwoRequirement) {
        this.tierTwoRequirement = tierTwoRequirement;
    }

    public Integer getTierThreeRequirement() {
        return tierThreeRequirement;
    }

    public void setTierThreeRequirement(Integer tierThreeRequirement) {
        this.tierThreeRequirement = tierThreeRequirement;
    }

    public String getTierZeroPicture() {
        return tierZeroPicture;
    }

    public void setTierZeroPicture(String tierZeroPicture) {
        this.tierZeroPicture = tierZeroPicture;
    }

    public String getTierOnePicture() {
        return tierOnePicture;
    }

    public void setTierOnePicture(String tierOnePicture) {
        this.tierOnePicture = tierOnePicture;
    }

    public String getTierTwoPicture() {
        return tierTwoPicture;
    }

    public void setTierTwoPicture(String tierTwoPicture) {
        this.tierTwoPicture = tierTwoPicture;
    }

    public String getTierThreePicture() {
        return tierThreePicture;
    }

    public void setTierThreePicture(String tierThreePicture) {
        this.tierThreePicture = tierThreePicture;
    }


    
}
