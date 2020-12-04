/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.enumeration.AccountPrivacySettingEnum;
import util.enumeration.UserTypeEnum;
import util.security.CryptographicHelper;

/**
 *
 * @author Jeremy
 */
@Entity
public class UserEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @NotNull
    @Column(nullable = false)
    private String firstName;
    //@NotNull
    //@Column(nullable = false)
    private String lastName;
    //@NotNull
    //@Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dob;
    //@NotNull
    //@Column(nullable = false)
    private String gender;
    @NotNull
    @Column(nullable = false, unique = true)
    private String email;
    @NotNull
    @Column(nullable = false)
    private String password;
    private String salt;
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date joinedDate;
    @Temporal(TemporalType.DATE)
    private Date adminStartDate;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserTypeEnum userType;
    @Lob
    @Column
    private String profilePicture;
    
    private Integer reputationPoints;

    private String verificationCode;

    private Boolean isVerified;

    private Boolean isActive;
    
    private Boolean completedQuestionnaire;
    
    @OneToOne
    private IndividualQuestionnaireEntity individualQuestionnaire;
    
    @OneToOne
    private OrganisationQuestionnaireEntity organisationQuestionnaire;
    

    @OneToMany(mappedBy = "from")
    private List<ReviewEntity> reviewsGiven;
    @OneToMany(mappedBy = "to")
    private List<ReviewEntity> reviewsReceived;
    @OneToMany(mappedBy = "projectOwner")
    private List<ProjectEntity> projectsOwned;
    @JoinTable(name = "projectMembers")
    @ManyToMany
    private List<ProjectEntity> projectsJoined;
    @JoinTable(name = "projectAdmins")
    @ManyToMany
    private List<ProjectEntity> projectsManaged;
    @ManyToMany
    private List<GroupEntity> groupsManaged;
    @OneToMany(mappedBy = "postOwner")
    private List<PostEntity> posts;
    @OneToMany(mappedBy = "groupOwner")
    private List<GroupEntity> groupsOwned;
    @JoinTable(name = "groupMembers")
    @ManyToMany
    private List<GroupEntity> groupsJoined;
    @JoinTable(name = "groupAdmins")
    @ManyToMany
    private List<GroupEntity> groupAdmins;
    @OneToMany
    private List<BadgeEntity> badges;
    @OneToMany(mappedBy = "materialResourceAvailableOwner")
    private List<MaterialResourceAvailableEntity> mras;
    @JoinTable(name = "user_skills")
    @OneToMany
    private List<TagEntity> skills;
    @JoinTable(name = "following")
    @OneToMany
    private List<UserEntity> following;
    @JoinTable(name = "followers")
    @OneToMany
    private List<UserEntity> followers;
    @JoinTable(name = "user_sdgs")
    @OneToMany
    private List<TagEntity> sdgs;
    @OneToMany(mappedBy = "from")
    private List<FollowRequestEntity> followRequestMade;
    @OneToMany(mappedBy = "to")
    private List<FollowRequestEntity> followRequestReceived;
    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountPrivacySettingEnum accountPrivacySetting;

    @JoinTable(name = "affiliatedUsers")
    @OneToMany
    private List<UserEntity> affiliatedUsers;

    @OneToMany(mappedBy = "from")
    private List<AffiliationRequestEntity> affiliationRequestMade;
    @OneToMany(mappedBy = "to")
    private List<AffiliationRequestEntity> affiliationRequestReceived;

    @JoinTable(name = "humanResourcePostingApplied")
    @ManyToMany
    private List<HumanResourcePostingEntity> hrpApplied;

    @OneToMany(mappedBy = "fulfillmentOwner")
    private List<FulfillmentEntity> fulfillments;

    @JoinTable(name = "activityJoined")
    @ManyToMany
    private List<ActivityEntity> activityJoined;

    @OneToMany
    private List<DonationEntity> donations;

    

    @JoinTable(name = "receivedAwards")
    @ManyToMany
    private List<AwardEntity> receivedAwards;
    
    //counters for badges
    private Integer countOfGroupsJoined;
    
    private Integer countOfProjectsJoined;
    
    private Integer countOfProjectsCreated;
    
    private Integer countOfGroupsCreated;
    
    private Integer countOfActivitiesCompleted;
    
    private Integer countOfPostCreated;
    
    private Integer countOfCommentsCreated;
    
    private Integer countOfReviewsCreated;
    

    @OneToMany 
    private List<NotificationEntity> notifications;


    @OneToMany(mappedBy = "userEntity")
    private List<ProfileEntity> profiles;

    @OneToMany(mappedBy = "user")
    private List<ClaimProfileRequestEntity> claimProfileRequestMade;


    public UserEntity() {
        this.reviewsGiven = new ArrayList<>();
        this.reviewsReceived = new ArrayList<>();
        this.projectsOwned = new ArrayList<>();
        this.groupsJoined = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.groupsOwned = new ArrayList<>();
        this.groupAdmins = new ArrayList<>();
        this.badges = new ArrayList<>();
        this.mras = new ArrayList<>();
        this.skills = new ArrayList<>();
        this.projectsManaged = new ArrayList<>();
        this.projectsJoined = new ArrayList<>();
        this.following = new ArrayList<>();
        this.followers = new ArrayList<>();
        this.sdgs = new ArrayList<>();
        this.followRequestMade = new ArrayList<>();
        this.followRequestReceived = new ArrayList<>();
        this.salt = CryptographicHelper.getInstance().generateRandomString(32);
        this.userType = UserTypeEnum.INDIVIDUAL;
        this.accountPrivacySetting = AccountPrivacySettingEnum.PUBLIC;
        this.isActive = true;
        this.affiliatedUsers = new ArrayList<>();
        this.affiliationRequestMade = new ArrayList<>();
        this.affiliationRequestReceived = new ArrayList<>();
        this.hrpApplied = new ArrayList<>();
        this.fulfillments = new ArrayList<>();
        this.activityJoined = new ArrayList<>();
        this.donations = new ArrayList<>();
        this.receivedAwards = new ArrayList<>();
        this.countOfGroupsJoined = 0;
        this.countOfProjectsJoined = 0;
        this.countOfProjectsCreated = 0;
        this.countOfGroupsCreated = 0;
        this.countOfActivitiesCompleted = 0;
        this.countOfPostCreated = 0;
        this.countOfCommentsCreated = 0;
        this.countOfReviewsCreated = 0;
        this.notifications = new ArrayList<>();
        this.profiles = new ArrayList<>();
        this.claimProfileRequestMade = new ArrayList<>();
        this.reputationPoints = 0;

    }

    public UserEntity(String firstName, String lastName, Date dob, String gender, String email, String password, UserTypeEnum usertype) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.setPassword(password);
        this.joinedDate = new Date();
        this.userType = usertype;

        this.countOfGroupsJoined = 0;
        this.countOfProjectsJoined = 0;
        this.countOfProjectsCreated = 0;
        this.countOfGroupsCreated = 0;
        this.countOfActivitiesCompleted = 0;
        this.countOfPostCreated = 0;
        this.countOfCommentsCreated = 0;
        this.countOfReviewsCreated = 0;
        this.reputationPoints = 0;
        this.reputationPoints = 0;

    }

    public UserEntity(String firstName, String lastName, Date dob, String gender, String email, String password, Date adminStartDate, UserTypeEnum userType) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.setPassword(password);
        this.joinedDate = new Date();
        this.adminStartDate = adminStartDate;
        this.userType = userType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (userId != null ? userId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the userId fields are not set
        if (!(object instanceof UserEntity)) {
            return false;
        }
        UserEntity other = (UserEntity) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "UserEntity{" + "userId=" + userId + ", firstName=" + firstName + ", lastName=" + lastName + ", dob=" + dob + ", gender=" + gender + ", email=" + email + ", password=" + password + ", salt=" + salt + ", joinedDate=" + joinedDate + ", userType=" + userType + ", adminStartDate=" + adminStartDate + ", reputationPoints=" + reputationPoints + ", accountPrivacySetting=" + accountPrivacySetting + '}';
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        if (password != null) {
            this.password = CryptographicHelper.getInstance().byteArrayToHexString(CryptographicHelper.getInstance().doMD5Hashing(password + this.salt));
        } else {
            this.password = null;
        }
    }

    public String getSalt() {
        return salt;
    }

    public void setSalt(String salt) {
        this.salt = salt;
    }

    public Date getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(Date joinedDate) {
        this.joinedDate = joinedDate;
    }

    public Date getAdminStartDate() {
        return adminStartDate;
    }

    public void setAdminStartDate(Date adminStartDate) {
        this.adminStartDate = adminStartDate;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public List<ReviewEntity> getReviewsGiven() {
        return reviewsGiven;
    }

    public void setReviewsGiven(List<ReviewEntity> reviewsGiven) {
        this.reviewsGiven = reviewsGiven;
    }

    public List<ProjectEntity> getProjectsOwned() {
        return projectsOwned;
    }

    public void setProjectsOwned(List<ProjectEntity> projectsOwned) {
        this.projectsOwned = projectsOwned;
    }

    public List<GroupEntity> getGroupsJoined() {
        return groupsJoined;
    }

    public void setGroupsJoined(List<GroupEntity> groupsJoined) {
        this.groupsJoined = groupsJoined;
    }

    public List<PostEntity> getPosts() {
        return posts;
    }

    public void setPosts(List<PostEntity> posts) {
        this.posts = posts;
    }

    public List<GroupEntity> getGroupsOwned() {
        return groupsOwned;
    }

    public void setGroupsOwned(List<GroupEntity> groupsOwned) {
        this.groupsOwned = groupsOwned;
    }

    public List<GroupEntity> getGroupAdmins() {
        return groupAdmins;
    }

    public void setGroupAdmins(List<GroupEntity> groupAdmins) {
        this.groupAdmins = groupAdmins;
    }

    public List<BadgeEntity> getBadges() {
        return badges;
    }

    public void setBadges(List<BadgeEntity> badges) {
        this.badges = badges;
    }

    public List<MaterialResourceAvailableEntity> getMras() {
        return mras;
    }

    public void setMras(List<MaterialResourceAvailableEntity> mras) {
        this.mras = mras;
    }

    public List<TagEntity> getSkills() {
        return skills;
    }

    public void setSkills(List<TagEntity> skills) {
        this.skills = skills;
    }

    public List<ProjectEntity> getProjectsJoined() {
        return projectsJoined;
    }

    public void setProjectsJoined(List<ProjectEntity> projectsJoined) {
        this.projectsJoined = projectsJoined;
    }

    public List<ProjectEntity> getProjectsManaged() {
        return projectsManaged;
    }

    public List<GroupEntity> getGroupsManaged() {
        return groupsManaged;
    }

    public void setProjectsManaged(List<ProjectEntity> projectsManaged) {
        this.projectsManaged = projectsManaged;
    }

    public List<UserEntity> getFollowing() {
        return following;
    }

    public void setFollowing(List<UserEntity> following) {
        this.following = following;
    }

    public List<UserEntity> getFollowers() {
        return followers;
    }

    public void setFollowers(List<UserEntity> followers) {
        this.followers = followers;
    }

    public Integer getReputationPoints() {
        return reputationPoints;
    }

    public void setReputationPoints(Integer reputationPoints) {
        this.reputationPoints = reputationPoints;
    }

    public List<TagEntity> getSdgs() {
        return sdgs;
    }

    public void setSdgs(List<TagEntity> sdgs) {
        this.sdgs = sdgs;
    }

    public AccountPrivacySettingEnum getAccountPrivacySetting() {
        return accountPrivacySetting;
    }

    public void setAccountPrivacySetting(AccountPrivacySettingEnum accountPrivacySetting) {
        this.accountPrivacySetting = accountPrivacySetting;
    }

    public List<FollowRequestEntity> getFollowRequestMade() {
        return followRequestMade;
    }

    public void setFollowRequestMade(List<FollowRequestEntity> followRequestMade) {
        this.followRequestMade = followRequestMade;
    }

    public List<FollowRequestEntity> getFollowRequestReceived() {
        return followRequestReceived;
    }

    public void setFollowRequestReceived(List<FollowRequestEntity> followRequestReceived) {
        this.followRequestReceived = followRequestReceived;
    }

    public List<ReviewEntity> getReviewsReceived() {
        return reviewsReceived;
    }

    public void setReviewsReceived(List<ReviewEntity> reviewsReceived) {
        this.reviewsReceived = reviewsReceived;
    }

    public UserTypeEnum getUserType() {
        return userType;
    }

    public void setUserType(UserTypeEnum userType) {
        this.userType = userType;
    }

    public List<UserEntity> getAffiliatedUsers() {
        return affiliatedUsers;
    }

    public void setAffiliatedUsers(List<UserEntity> affiliatedUsers) {
        this.affiliatedUsers = affiliatedUsers;
    }

    public List<AffiliationRequestEntity> getAffiliationRequestMade() {
        return affiliationRequestMade;
    }

    public void setAffiliationRequestMade(List<AffiliationRequestEntity> affiliationRequestMade) {
        this.affiliationRequestMade = affiliationRequestMade;
    }

    public List<AffiliationRequestEntity> getAffiliationRequestReceived() {
        return affiliationRequestReceived;
    }

    public void setAffiliationRequestReceived(List<AffiliationRequestEntity> affiliationRequestReceived) {
        this.affiliationRequestReceived = affiliationRequestReceived;
    }

    public List<HumanResourcePostingEntity> getHrpApplied() {
        return hrpApplied;
    }

    public void setHrpApplied(List<HumanResourcePostingEntity> hrpApplied) {
        this.hrpApplied = hrpApplied;
    }

    public List<FulfillmentEntity> getFulfillments() {
        return fulfillments;
    }

    public void setFulfillments(List<FulfillmentEntity> fulfillments) {
        this.fulfillments = fulfillments;
    }

    public List<ActivityEntity> getActivityJoined() {
        return activityJoined;
    }

    public void setActivityJoined(List<ActivityEntity> activityJoined) {
        this.activityJoined = activityJoined;
    }

    public List<DonationEntity> getDonations() {
        return donations;
    }

    public void setDonations(List<DonationEntity> donations) {
        this.donations = donations;
    }

    public void setGroupsManaged(List<GroupEntity> groupsManaged) {
        this.groupsManaged = groupsManaged;
    }


    public List<AwardEntity> getReceivedAwards() {
        return receivedAwards;
    }

    public void setReceivedAwards(List<AwardEntity> receivedAwards) {
        this.receivedAwards = receivedAwards;
    }

    public Integer getCountOfGroupsJoined() {
        return countOfGroupsJoined;
    }

    public void setCountOfGroupsJoined(Integer countOfGroupsJoined) {
        this.countOfGroupsJoined = countOfGroupsJoined;
    }

    public Integer getCountOfProjectsJoined() {
        return countOfProjectsJoined;
    }

    public void setCountOfProjectsJoined(Integer countOfProjectsJoined) {
        this.countOfProjectsJoined = countOfProjectsJoined;
    }

    public Integer getCountOfProjectsCreated() {
        return countOfProjectsCreated;
    }

    public void setCountOfProjectsCreated(Integer countOfProjectsCreated) {
        this.countOfProjectsCreated = countOfProjectsCreated;
    }

    public Integer getCountOfGroupsCreated() {
        return countOfGroupsCreated;
    }

    public void setCountOfGroupsCreated(Integer countOfGroupsCreated) {
        this.countOfGroupsCreated = countOfGroupsCreated;
    }

    public Integer getCountOfActivitiesCompleted() {
        return countOfActivitiesCompleted;
    }

    public void setCountOfActivitiesCompleted(Integer countOfActivitiesCompleted) {
        this.countOfActivitiesCompleted = countOfActivitiesCompleted;
    }

    public Integer getCountOfPostCreated() {
        return countOfPostCreated;
    }

    public void setCountOfPostCreated(Integer countOfPostCreated) {
        this.countOfPostCreated = countOfPostCreated;
    }

    public Integer getCountOfCommentsCreated() {
        return countOfCommentsCreated;
    }

    public void setCountOfCommentsCreated(Integer countOfCommentsCreated) {
        this.countOfCommentsCreated = countOfCommentsCreated;
    }

    public Integer getCountOfReviewsCreated() {
        return countOfReviewsCreated;
    }

    public void setCountOfReviewsCreated(Integer countOfReviewsCreated) {
        this.countOfReviewsCreated = countOfReviewsCreated;
    }

    
    
    public List<NotificationEntity> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<NotificationEntity> notifications) {
        this.notifications = notifications;
    }

    public List<ProfileEntity> getProfiles() {
        return profiles;
    }

    public void setProfiles(List<ProfileEntity> profiles) {
        this.profiles = profiles;
    }

    public List<ClaimProfileRequestEntity> getClaimProfileRequestMade() {
        return claimProfileRequestMade;
    }

    public void setClaimProfileRequestMade(List<ClaimProfileRequestEntity> claimProfileRequestMade) {
        this.claimProfileRequestMade = claimProfileRequestMade;
    }

    public Boolean getCompletedQuestionnaire() {
        return completedQuestionnaire;
    }

    public void setCompletedQuestionnaire(Boolean completedQuestionnaire) {
        this.completedQuestionnaire = completedQuestionnaire;
    }

    public IndividualQuestionnaireEntity getIndividualQuestionnaire() {
        return individualQuestionnaire;
    }

    public void setIndividualQuestionnaire(IndividualQuestionnaireEntity individualQuestionnaire) {
        this.individualQuestionnaire = individualQuestionnaire;
    }

    public OrganisationQuestionnaireEntity getOrganisationQuestionnaire() {
        return organisationQuestionnaire;
    }

    public void setOrganisationQuestionnaire(OrganisationQuestionnaireEntity organisationQuestionnaire) {
        this.organisationQuestionnaire = organisationQuestionnaire;
    }
    
    
}
