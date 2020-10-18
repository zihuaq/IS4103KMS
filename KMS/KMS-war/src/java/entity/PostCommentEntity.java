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
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class PostCommentEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postCommentId;
    
    @NotNull
    @Column(nullable=false)
    private String comment;
    
    @NotNull
    @Column(nullable=false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateTime;
    
    @NotNull
    @JoinColumn(nullable=false)
    @OneToOne
    private PostEntity post;
    
    @NotNull
    @JoinColumn(nullable=false)
    @ManyToOne
    private UserEntity commentOwner;
    
    @ManyToMany
    private List<UserEntity> likers;

    public PostCommentEntity() {
        this.likers = new ArrayList<>();
    }

    public PostCommentEntity(String comment, Date dateTime) {
        this();
        this.comment = comment;
        this.dateTime = dateTime;
    }
    
    public Long getPostCommentId() {
        return postCommentId;
    }

    public void setPostCommentId(Long postCommentId) {
        this.postCommentId = postCommentId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (postCommentId != null ? postCommentId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the postCommentId fields are not set
        if (!(object instanceof PostCommentEntity)) {
            return false;
        }
        PostCommentEntity other = (PostCommentEntity) object;
        if ((this.postCommentId == null && other.postCommentId != null) || (this.postCommentId != null && !this.postCommentId.equals(other.postCommentId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.PostComment[ id=" + postCommentId + " ]";
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getDateTime() {
        return dateTime;
    }

    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }

    public PostEntity getPost() {
        return post;
    }

    public void setPost(PostEntity post) {
        this.post = post;
    }

    public UserEntity getCommentOwner() {
        return commentOwner;
    }

    public void setCommentOwner(UserEntity commentOwner) {
        this.commentOwner = commentOwner;
    }

    public void setLikers(List<UserEntity> likers) {
        this.likers = likers;
    }

    public List<UserEntity> getLikers() {
        return likers;
    }
    
}
