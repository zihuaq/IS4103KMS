/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.DuplicateLikeException;
import Exception.LikeNotFoundException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import entity.PostCommentEntity;
import entity.PostEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author chai
 */
@Local
public interface PostSessionBeanLocal {

    public Long createNewPostInProjectFeed(PostEntity newPost, Long projectId, Long userId) throws NoResultException;

    public PostEntity createPost(PostEntity post) throws UserNotFoundException, NoResultException;
    
    public PostEntity getPostById(Long postId);
    
    public List<PostEntity> getPostForUserNewsfeed(Long userId) throws UserNotFoundException, NoResultException;
    
    public void updatePost(PostEntity postToUpdate);
    
    public void likePost(Long postId, Long userId) throws NoResultException, DuplicateLikeException;
    
    public void removeLikeForPost(Long postId, Long userId) throws NoResultException, LikeNotFoundException;
    
    public void addCommentForPost(Long postId, PostCommentEntity comment) throws NoResultException;
    
    public void likeComment(Long commentId, Long userId) throws DuplicateLikeException, NoResultException;
    
    public void removeLikeForComment(Long commentId, Long userId) throws NoResultException, LikeNotFoundException;
    
    public void deleteComment(Long commentId) throws NoResultException;
    
    public void deletePostById(Long postId) throws NoResultException;

    public void deletePostInProjectFeed(Long postId);

}
