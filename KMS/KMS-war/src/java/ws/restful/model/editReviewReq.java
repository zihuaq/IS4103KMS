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
public class editReviewReq {
    private Long reviewId;
    private String title;
    private String message;
    private Integer rating;

    public editReviewReq() {
    }

    public editReviewReq(Long reviewId, String title, String message, Integer rating) {
        this.reviewId = reviewId;
        this.title = title;
        this.message = message;
        this.rating = rating;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    
    
}
