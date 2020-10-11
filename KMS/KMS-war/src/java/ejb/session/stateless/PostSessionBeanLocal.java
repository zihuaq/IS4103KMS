/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import Exception.UserNotFoundException;
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

    public void deletePostInProjectFeed(Long postId);

}
