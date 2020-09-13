/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.Post;
import entity.Project;
import entity.User;
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
    public Long createNewPost(Post newPost, Long projectId, Long userId) throws NoResultException {
        Project project = projectSessionBeanLocal.getProjectById(projectId);
        User user = userSessionBeanLocal.getUserById(userId);
        em.persist(newPost);
        em.flush();
        
        project.getPosts().add(newPost);
        newPost.setProject(project);
        user.getPosts().add(newPost);
        newPost.setPostOwner(user);
        
        return newPost.getPostId();
    }
    
    public Post getPostById(Long postId) {
        Post post = em.find(Post.class, postId);
        return post;
    }
    
    @Override
    public void updatePost(Post postToUpdate) {
        em.merge(postToUpdate);
        em.flush();
    }
    
    @Override
    public void deletePost(Long postId) {
        Post postToDelete = getPostById(postId);
        
        postToDelete.getPostOwner().getPosts().remove(postToDelete);
        postToDelete.setPostOwner(null);
        
        postToDelete.getProject().getPosts().remove(postToDelete);
        postToDelete.setProject(null);
        
        em.remove(postToDelete);
    }
}
