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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.enumeration.AccountPrivacySettingEnum;
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
    @NotNull
    @Column(nullable = false)
    private String lastName;
    @NotNull
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dob;
    @NotNull
    @Column(nullable = false)
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
    @Column(nullable = false)
    private Boolean isAdmin;
    @Temporal(TemporalType.DATE)
    private Date adminStartDate;

    @Lob
    @Column
    private String profilePicture;

    private int reputationPoints;

    @OneToMany(mappedBy = "from")
    private List<ReviewEntity> reviewsGiven;

    @OneToMany(mappedBy = "to")
    private List<ReviewEntity> reviewsReceived;

    @OneToMany(mappedBy = "owner")
    private List<ProjectEntity> projectsOwned;
    
    @ManyToMany(mappedBy = "groupMembers")

    private List<ProjectEntity> projectsContributed;

    @ManyToMany(mappedBy = "admins")
    private List<ProjectEntity> projectAdmins;

    @ManyToMany(mappedBy = "users")
    private List<GroupEntity> groups;

    @OneToMany(mappedBy = "postOwner")
    private List<PostEntity> posts;

    @OneToMany(mappedBy = "groupOwner")
    private List<GroupEntity> groupsOwned;

    @OneToMany
    private List<BadgeEntity> badges;

    @OneToMany(mappedBy = "materialResourceAvailableOwner")
    private List<MaterialResourceAvailableEntity> mras;

    @JoinTable(name = "skills")
    @OneToMany
    private List<TagEntity> skills;

    @JoinTable(name = "following")
    @OneToMany
    private List<UserEntity> following;

    @JoinTable(name = "followers")
    @OneToMany
    private List<UserEntity> followers;

    @JoinTable(name = "sdgs")
    @OneToMany
    private List<TagEntity> sdgs;

    @JoinTable(name = "followRequestMade")
    @OneToMany(mappedBy = "from")
    private List<FollowRequestEntity> followRequestMade;

    @JoinTable(name = "followRequestReceived")
    @OneToMany(mappedBy = "to")
    private List<FollowRequestEntity> followRequestReceived;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountPrivacySettingEnum accountPrivacySetting;

    public UserEntity() {
        this.reviewsGiven = new ArrayList<>();
        this.reviewsReceived = new ArrayList<>();
        this.projectsOwned = new ArrayList<>();
        this.groups = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.groupsOwned = new ArrayList<>();
        this.badges = new ArrayList<>();
        this.mras = new ArrayList<>();
        this.skills = new ArrayList<>();
        this.projectAdmins = new ArrayList<>();
        this.projectsContributed = new ArrayList<>();
        this.following = new ArrayList<>();
        this.followers = new ArrayList<>();
        this.sdgs = new ArrayList<>();
        this.followRequestMade = new ArrayList<>();
        this.followRequestReceived = new ArrayList<>();
        this.salt = CryptographicHelper.getInstance().generateRandomString(32);
        this.isAdmin = Boolean.FALSE;
        this.accountPrivacySetting = AccountPrivacySettingEnum.PUBLIC;
    }

    public UserEntity(String firstName, String lastName, Date dob, String gender, String email, String password, Date joinedDate, String profilePicture) {
        this();
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.joinedDate = joinedDate;
        this.profilePicture = profilePicture;
    }

    public UserEntity(String firstName, String lastName, Date dob, String gender, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.joinedDate = new Date();
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
        return "UserEntity{" + "userId=" + userId + ", firstName=" + firstName + ", lastName=" + lastName + ", dob=" + dob + ", gender=" + gender + ", email=" + email + ", password=" + password + ", salt=" + salt + ", joinedDate=" + joinedDate + ", isAdmin=" + isAdmin + ", adminStartDate=" + adminStartDate + ", reputationPoints=" + reputationPoints + ", accountPrivacySetting=" + accountPrivacySetting + '}';
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

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
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

    public List<GroupEntity> getGroups() {
        return groups;
    }

    public void setGroups(List<GroupEntity> groups) {
        this.groups = groups;
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

    public List<ProjectEntity> getProjectsContributed() {
        return projectsContributed;
    }

    public void setProjectsContributed(List<ProjectEntity> projectsContributed) {
        this.projectsContributed = projectsContributed;
    }

    public List<ProjectEntity> getProjectAdmins() {
        return projectAdmins;
    }

    public void setProjectAdmins(List<ProjectEntity> projectAdmins) {
        this.projectAdmins = projectAdmins;
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

    public int getReputationPoints() {
        return reputationPoints;
    }

    public void setReputationPoints(int reputationPoints) {
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
}
