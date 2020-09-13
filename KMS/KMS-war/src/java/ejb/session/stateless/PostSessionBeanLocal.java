/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.PostEntity;
import javax.ejb.Local;

/**
 *
 * @author chai
 */
@Local
public interface PostSessionBeanLocal {

    public Long createNewPost(PostEntity newPost, Long projectId, Long userId) throws NoResultException;

    public PostEntity getPostById(Long postId);
    
    public void updatePost(PostEntity postToUpdate);

    public void deletePost(Long postId);

}
