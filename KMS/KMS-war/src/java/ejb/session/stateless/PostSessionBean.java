/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author chai
 */
@Stateless
public class PostSessionBean implements PostSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;
    
    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;

    @Override
    public Long createNewPost(PostEntity newPost, Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        em.persist(newPost);
        em.flush();
        
        project.getPosts().add(newPost);
        newPost.setProject(project);
        user.getPosts().add(newPost);
        newPost.setPostOwner(user);
        
        return newPost.getPostId();
    }
    
    public PostEntity getPostById(Long postId) {
        PostEntity post = em.find(PostEntity.class, postId);
        return post;
    }
    
    @Override
    public void updatePost(PostEntity postToUpdate) {
        em.merge(postToUpdate);
        em.flush();
    }
    
    @Override
    public void deletePost(Long postId) {
        PostEntity postToDelete = getPostById(postId);
        
        postToDelete.getPostOwner().getPosts().remove(postToDelete);
        postToDelete.setPostOwner(null);
        
        postToDelete.getProject().getPosts().remove(postToDelete);
        postToDelete.setProject(null);
        
        em.remove(postToDelete);
    }
}
