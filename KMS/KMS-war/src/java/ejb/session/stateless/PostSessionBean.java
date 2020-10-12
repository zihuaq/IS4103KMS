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
    public void addCommentForPost(Long postId, PostCommentEntity comment) throws NoResultException {
        PostEntity post = em.find(PostEntity.class, postId);
        UserEntity user = em.find(UserEntity.class, comment.getCommentOwner().getUserId());

        if (post != null && user != null) {
            comment.setPost(post);
            em.persist(comment);
            em.flush();
            post.getComments().add(comment);
        } else {
            throw new NoResultException("Post or comment owner not found");
        }
    }

    @Override
    public void likeComment(Long commentId, Long userId) throws DuplicateLikeException, NoResultException {
        PostCommentEntity comment = em.find(PostCommentEntity.class, commentId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (comment != null && user != null) {
            if (!comment.getLikers().contains(user)) {
                comment.getLikers().add(user);
            } else {
                throw new DuplicateLikeException("User already liked this comment");
            }
        } else {
            throw new NoResultException("Comment or user not found");
        }
    }

    @Override
    public void removeLikeForComment(Long commentId, Long userId) throws NoResultException, LikeNotFoundException {
        PostCommentEntity comment = em.find(PostCommentEntity.class, commentId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (comment != null && user != null) {
            if (comment.getLikers().contains(user)) {
                comment.getLikers().remove(user);
            } else {
                throw new LikeNotFoundException("User has not liked this post");
            }
        } else {
            throw new NoResultException("Comment or user not found");
        }
    }

    @Override
    public void deleteComment(Long commentId) throws NoResultException {
        PostCommentEntity comment = em.find(PostCommentEntity.class, commentId);

        if (comment != null) {
            PostEntity post = em.find(PostEntity.class, comment.getPost().getPostId());
            if (post != null) {
                post.getComments().remove(comment);
                em.remove(comment);
            } else {
                throw new NoResultException("Post is not found");
            }
        } else {
            throw new NoResultException("Comment is not found");
        }
    }

    @Override
    public void updateComment(PostCommentEntity comment) throws NoResultException {
        PostCommentEntity commentToUpdate = em.find(PostCommentEntity.class, comment.getPostCommentId());

        if (commentToUpdate != null) {
            commentToUpdate.setComment(comment.getComment());
            em.merge(commentToUpdate);
        } else {
            throw new NoResultException("Comment is not found");
        }
    }

    @Override
    public void deletePostById(Long postId) throws NoResultException {
        PostEntity post = em.find(PostEntity.class, postId);

        if (post != null) {
            post.getPostOwner().getPosts().remove(post);
            if (post.getProject() != null) {
                post.getProject().getPosts().remove(post);
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
