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
import entity.PostEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
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
    public Long createNewPostInProjectFeed(PostEntity newPost, Long projectId, Long userId) throws NoResultException {
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

    @Override
    public PostEntity createPost(PostEntity post) throws UserNotFoundException, NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(post.getPostOwner().getUserId());

        if (user != null) {
            em.persist(post);
            em.flush();
            user.getPosts().add(post);
            return post;
        } else {
            throw new UserNotFoundException("User does not exist.");
        }
    }

    @Override
    public PostEntity getPostById(Long postId) {
        PostEntity post = em.find(PostEntity.class, postId);
        return post;
    }

    @Override
    public List<PostEntity> getPostForUserNewsfeed(Long userId) throws UserNotFoundException, NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);

        if (user != null) {
            List<PostEntity> posts = user.getPosts();
            for (int i = 0; i < user.getFollowing().size(); i++) {
                posts.addAll(user.getFollowing().get(i).getPosts());
            }
            return posts;
        } else {
            throw new UserNotFoundException("User does not exist.");
        }
    }

    @Override
    public void updatePost(PostEntity postToUpdate) {
        em.merge(postToUpdate);
        em.flush();
    }

    @Override
    public void likePost(Long postId, Long userId) throws NoResultException, DuplicateLikeException {
        PostEntity post = em.find(PostEntity.class, postId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (post != null && user != null) {
            if (!user.getLikedPosts().contains(post) && !post.getLikers().contains(user)) {
                user.getLikedPosts().add(post);
                post.getLikers().add(user);
            } else {
                throw new DuplicateLikeException("User already liked this post");
            }
        } else {
            throw new NoResultException("Post or user not found");
        }
    }

    @Override
    public void removeLikeForPost(Long postId, Long userId) throws NoResultException, LikeNotFoundException {
        PostEntity post = em.find(PostEntity.class, postId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (post != null && user != null) {
            if (user.getLikedPosts().contains(post) && post.getLikers().contains(user)) {
                user.getLikedPosts().remove(post);
                post.getLikers().remove(user);
            } else {
                throw new LikeNotFoundException("User has not liked this post");
            }
        } else {
            throw new NoResultException("Post is not found");
        }
    }

    @Override
    public void deletePostById(Long postId) throws NoResultException {
        PostEntity post = em.find(PostEntity.class, postId);

        if (post != null) {
            post.getPostOwner().getPosts().remove(post);
            post.setPostOwner(null);
            if (post.getProject() != null) {
                post.getProject().getPosts().remove(post);
                post.setProject(null);
            }
            em.remove(post);
        } else {
            throw new NoResultException("Post is not found");
        }
    }

    @Override
    public void deletePostInProjectFeed(Long postId) {
        PostEntity postToDelete = getPostById(postId);

        postToDelete.getPostOwner().getPosts().remove(postToDelete);
        postToDelete.setPostOwner(null);

        postToDelete.getProject().getPosts().remove(postToDelete);
        postToDelete.setProject(null);

        em.remove(postToDelete);
    }
}
