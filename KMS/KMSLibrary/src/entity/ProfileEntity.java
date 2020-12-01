/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

/**
 *
 * @author Jeremy
 */
@Entity
public class ProfileEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    private String organization;

    @Lob
    private String productsOrServices;

    @Lob
    private String description;

    @Lob
    private String industry;

    private String website;

    @ManyToMany
    @JoinTable(name = "profile_sdg")
    private List<TagEntity> sdgs;

    @ManyToMany
    @JoinTable(name = "profile_sdgtargets")
    private List<TagEntity> sdgTargets;

    @Lob
    private String targetPopulation;

    private String focusRegions;

    @Lob
    private String region;

    private String country;

    private String cityState;

    private String yearOfEstablishment;

    private String contactDetails;

    @ManyToOne
    private UserEntity userEntity;

    @OneToMany(mappedBy = "profile")
    private List<ClaimProfileRequestEntity> claimProfileRequestMade;

    public ProfileEntity() {
        this.sdgs = new ArrayList<>();
        this.sdgTargets = new ArrayList<>();
    }

    public ProfileEntity(String name, String organization, String productsOrServices, String description, String industry, String website, String targetPopulation, String focusRegions, String region, String country, String cityState, String yearOfEstablishment, String contactDetails) {
        this();
        this.name = name;
        this.organization = organization;
        this.productsOrServices = productsOrServices;
        this.description = description;
        this.industry = industry;
        this.website = website;
        this.targetPopulation = targetPopulation;
        this.focusRegions = focusRegions;
        this.region = region;
        this.country = country;
        this.cityState = cityState;
        this.yearOfEstablishment = yearOfEstablishment;
        this.contactDetails = contactDetails;
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
        if (!(object instanceof ProfileEntity)) {
            return false;
        }
        ProfileEntity other = (ProfileEntity) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.ProfileEntity[ id=" + id + " ]";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getProductsOrServices() {
        return productsOrServices;
    }

    public void setProductsOrServices(String productsOrServices) {
        this.productsOrServices = productsOrServices;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public List<TagEntity> getSdgs() {
        return sdgs;
    }

    public void setSdgs(List<TagEntity> sdgs) {
        this.sdgs = sdgs;
    }

    public List<TagEntity> getSdgTargets() {
        return sdgTargets;
    }

    public void setSdgTargets(List<TagEntity> sdgTargets) {
        this.sdgTargets = sdgTargets;
    }

    public String getTargetPopulation() {
        return targetPopulation;
    }

    public void setTargetPopulation(String targetPopulation) {
        this.targetPopulation = targetPopulation;
    }

    public String getFocusRegions() {
        return focusRegions;
    }

    public void setFocusRegions(String focusRegions) {
        this.focusRegions = focusRegions;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCityState() {
        return cityState;
    }

    public void setCityState(String cityState) {
        this.cityState = cityState;
    }

    public String getYearOfEstablishment() {
        return yearOfEstablishment;
    }

    public void setYearOfEstablishment(String yearOfEstablishment) {
        this.yearOfEstablishment = yearOfEstablishment;
    }

    public String getContactDetails() {
        return contactDetails;
    }

    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public List<ClaimProfileRequestEntity> getClaimProfileRequestMade() {
        return claimProfileRequestMade;
    }

    public void setClaimProfileRequestMade(List<ClaimProfileRequestEntity> claimProfileRequestMade) {
        this.claimProfileRequestMade = claimProfileRequestMade;
    }

}
