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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class PostEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
    
    @Temporal(TemporalType.DATE)
    private Date postDate;
    
    private String text;
    
    @Lob
    @Column
    private String picture;
    
    @NotNull
    @JoinColumn(nullable=false)
    @ManyToOne
    private UserEntity postOwner;
    
    @JoinTable(name = "likedPosts")
    private List<UserEntity> likers;
    
    @JoinTable(name = "sharedPosts")
    @OneToMany
    private List<PostEntity> sharedPosts;
    
    @ManyToOne
    private PostEntity originalPost;

    @OneToMany(mappedBy = "post")
    private List<PostCommentEntity> comments;
    
    @ManyToOne
    private ProjectEntity project;
    
    @ManyToOne
    private GroupEntity group;
    
    private boolean originalPostDeleted;
    
    private Boolean isActive;
    
    private String sharedGroupId;
    
    private String sharedProjectId;
    
    private String sharedGroupOrProjectDescription;
    
    private String sharedGroupOrProjectName;

    public PostEntity() {
        this.likers = new ArrayList<>();
        this.sharedPosts = new ArrayList<>();
        this.comments = new ArrayList<>();
        this.originalPostDeleted = false;
    }

    public PostEntity(Date postDate, String text, UserEntity postOwner, PostEntity originalPost) {
        this();
        this.postDate = postDate;
        this.text = text;
        this.postOwner = postOwner;
        this.originalPost = originalPost;
    }
     
    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (postId != null ? postId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the postId fields are not set
        if (!(object instanceof PostEntity)) {
            return false;
        }
        PostEntity other = (PostEntity) object;
        if ((this.postId == null && other.postId != null) || (this.postId != null && !this.postId.equals(other.postId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Post[ id=" + postId + " ]";
    }

    public UserEntity getPostOwner() {
        return postOwner;
    }

    public void setPostOwner(UserEntity postOwner) {
        this.postOwner = postOwner;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public List<UserEntity> getLikers() {
        return likers;
    }

    public void setLikers(List<UserEntity> likers) {
        this.likers = likers;
    }

    public List<PostEntity> getSharedPosts() {
        return sharedPosts;
    }

    public void setSharedPosts(List<PostEntity> sharedPosts) {
        this.sharedPosts = sharedPosts;
    }

    public PostEntity getOriginalPost() {
        return originalPost;
    }

    public void setOriginalPost(PostEntity originalPost) {
        this.originalPost = originalPost;
    }

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
        this.postDate = postDate;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<PostCommentEntity> getComments() {
        return comments;
    }

    public void setComments(List<PostCommentEntity> comments) {
        this.comments = comments;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public boolean isOriginalPostDeleted() {
        return originalPostDeleted;
    }

    public void setOriginalPostDeleted(boolean originalPostDeleted) {
        this.originalPostDeleted = originalPostDeleted;
    }


    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    

    public GroupEntity getGroup() {
        return group;
    }

    public void setGroup(GroupEntity group) {
        this.group = group;
    }

    public String getSharedGroupId() {
        return sharedGroupId;
    }

    public void setSharedGroupId(String sharedGroupId) {
        this.sharedGroupId = sharedGroupId;
    }

    public String getSharedProjectId() {
        return sharedProjectId;
    }

    public void setSharedProjectId(String sharedProjectId) {
        this.sharedProjectId = sharedProjectId;
    }

    public String getSharedGroupOrProjectDescription() {
        return sharedGroupOrProjectDescription;
    }

    public void setSharedGroupOrProjectDescription(String sharedGroupOrProjectDescription) {
        this.sharedGroupOrProjectDescription = sharedGroupOrProjectDescription;
    }

    public String getSharedGroupOrProjectName() {
        return sharedGroupOrProjectName;
    }

    public void setSharedGroupOrProjectName(String sharedGroupOrProjectName) {
        this.sharedGroupOrProjectName = sharedGroupOrProjectName;
    }
}
