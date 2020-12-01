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
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

/**
 *
 * @author chai
 */
@Entity
public class ReviewEntity implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;
    @NotNull
    @Column(nullable=false)
    private String title;
    @NotNull
    @Column(nullable=false)
    private String reviewField;
    @NotNull
    @Column(nullable=false)
    private Integer rating;
    
    @ManyToOne
    private ProjectEntity project;
    
    @ManyToOne
    private ActivityEntity madeFromActivity;
    
    @ManyToOne
    private UserEntity to;
    
    @ManyToOne
    private UserEntity from;

    public ReviewEntity() {
    }

    public ReviewEntity(String title, String reviewField, Integer rating) {
        this();
        this.title = title;
        this.reviewField = reviewField;
        this.rating = rating;
    }
    
    

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (reviewId != null ? reviewId.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the reviewId fields are not set
        if (!(object instanceof ReviewEntity)) {
            return false;
        }
        ReviewEntity other = (ReviewEntity) object;
        if ((this.reviewId == null && other.reviewId != null) || (this.reviewId != null && !this.reviewId.equals(other.reviewId))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Review[ id=" + reviewId + " ]";
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReviewField() {
        return reviewField;
    }

    public void setReviewField(String reviewField) {
        this.reviewField = reviewField;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public UserEntity getTo() {
        return to;
    }

    public void setTo(UserEntity to) {
        this.to = to;
    }

    public UserEntity getFrom() {
        return from;
    }

    public void setFrom(UserEntity from) {
        this.from = from;
    }

    public ProjectEntity getProject() {
        return project;
    }

    public void setProject(ProjectEntity project) {
        this.project = project;
    }

    public ActivityEntity getMadeFromActivity() {
        return madeFromActivity;
    }

    public void setMadeFromActivity(ActivityEntity madeFromActivity) {
        this.madeFromActivity = madeFromActivity;
    }
    
    
    
}
