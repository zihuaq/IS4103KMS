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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import util.security.CryptographicHelper;

/**
 *
 * @author Jeremy
 */
@Entity
public class User implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @NotNull
    @Column(nullable=false)
    private String firstName;
    @NotNull
    @Column(nullable=false)
    private String lastName;
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date dob;
    @NotNull
    @Column(nullable=false)
    private String gender;
    @NotNull
    @Column(nullable=false, unique = true)
    private String email;
    @NotNull
    @Column(nullable=false)
    private String password;
    private String salt;
    @Column(nullable=false)
    @Temporal(TemporalType.DATE)
    private Date joinedDate;
    @Column(nullable=false)
    private Boolean isAdmin;
    @Temporal(TemporalType.DATE)
    private Date adminStartDate;
    
    private String profilePicture;
    
    @OneToMany(mappedBy = "user")
    private List<Review> reviews;
    
    @OneToMany(mappedBy = "user")
    private List<Project> projects;
    
    @ManyToMany
    private List<Group> groups;
    
    @OneToMany(mappedBy = "postOwner")
    private List<Post> posts;
    
    @OneToMany(mappedBy = "groupOwner")
    private List<Group> groupsOwned;
    
    @OneToMany
    private List<Badge> badges;
    
    @OneToMany(mappedBy = "materialResourceAvailableOwner")
    private List<MaterialResourceAvailable> mras;
    
    @OneToMany
    private List<Tag> skills;

    public User() {
        this.reviews = new ArrayList<>();
        this.projects = new ArrayList<>();
        this.groups = new ArrayList<>();
        this.posts = new ArrayList<>();
        this.groupsOwned = new ArrayList<>();
        this.badges = new ArrayList<>();
        this.mras = new ArrayList<>();
        this.skills = new ArrayList<>();
        this.salt = CryptographicHelper.getInstance().generateRandomString(32);
        this.isAdmin = Boolean.FALSE;
    }

    public User(String firstName, String lastName, Date dob, String gender, String email, String password, Date joinedDate, String profilePicture) {
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
        if (!(object instanceof User)) {
            return false;
        }
        User other = (User) object;
        if ((this.userId == null && other.userId != null) || (this.userId != null && !this.userId.equals(other.userId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.UserEntity[ id=" + userId + " ]";
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
        if(password != null) {
            this.password = CryptographicHelper.getInstance().byteArrayToHexString(CryptographicHelper.getInstance().doMD5Hashing(password + this.salt));
        }
        else {
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

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public List<Group> getGroupsOwned() {
        return groupsOwned;
    }

    public void setGroupsOwned(List<Group> groupsOwned) {
        this.groupsOwned = groupsOwned;
    }

    public List<Badge> getBadges() {
        return badges;
    }

    public void setBadges(List<Badge> badges) {
        this.badges = badges;
    }

    public List<MaterialResourceAvailable> getMras() {
        return mras;
    }

    public void setMras(List<MaterialResourceAvailable> mras) {
        this.mras = mras;
    }

    public List<Tag> getSkills() {
        return skills;
    }

    public void setSkills(List<Tag> skills) {
        this.skills = skills;
    }
    
}
