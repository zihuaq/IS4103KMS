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
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

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
    public PostEntity getPostById(Long postId) throws NoResultException {
        PostEntity post = em.find(PostEntity.class, postId);
        if (post != null) {
            return post;
        } else {
            throw new NoResultException("Post not found");
        }

    }

    @Override
    public List<PostEntity> getPostForUserNewsfeed(Long userId) throws UserNotFoundException, NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);

        if (user != null) {
            List<PostEntity> posts = user.getPosts();
            for (int i = 0; i < user.getFollowing().size(); i++) {
                posts.addAll(user.getFollowing().get(i).getPosts());
            }
            Collections.sort(posts, (PostEntity p1, PostEntity p2) -> p1.getPostDate().compareTo(p2.getPostDate()));
            Collections.reverse(posts);
            return posts;
        } else {
            throw new UserNotFoundException("User does not exist.");
        }
    }

    @Override
    public PostEntity updatePost(PostEntity postToUpdate) throws NoResultException {
        PostEntity oldPost = em.find(PostEntity.class, postToUpdate.getPostId());
        if (oldPost != null) {
            oldPost.setPicture(postToUpdate.getPicture());
            oldPost.setText(postToUpdate.getText());
            em.flush();
            return oldPost;
        } else {
            throw new NoResultException("Post not found");
        }
    }

    @Override
    public void likePost(Long postId, Long userId) throws NoResultException, DuplicateLikeException {
        PostEntity post = em.find(PostEntity.class, postId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (post != null && user != null) {
            if (!post.getLikers().contains(user)) {
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
            if (post.getLikers().contains(user)) {
                post.getLikers().remove(user);
            } else {
                throw new LikeNotFoundException("User has not liked this post");
            }
        } else {
            throw new NoResultException("Post is not found");
        }
    }

    @Override
    public List<PostCommentEntity> addCommentForPost(Long postId, PostCommentEntity comment) throws NoResultException {
        PostEntity post = em.find(PostEntity.class, postId);
        UserEntity user = em.find(UserEntity.class, comment.getCommentOwner().getUserId());

        if (post != null && user != null) {
            comment.setPost(post);
            comment.setCommentOwner(user);
            em.persist(comment);
            em.flush();
            post.getComments().add(comment);
            post.getComments().size();
            return post.getComments();
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
    public List<PostCommentEntity> getCommentsForPost(Long postId) throws NoResultException {
        PostEntity post = em.find(PostEntity.class, postId);
        if (post != null) {
            post.getComments().size();
            return post.getComments();
        } else {
            throw new NoResultException("Post is not found");
        }
    }

    @Override
    public void sharePost(Long postToShareId, Long userId, PostEntity post) throws NoResultException {
        PostEntity postToShare = em.find(PostEntity.class, postToShareId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (postToShare != null && user != null) {
            post.setPostOwner(user);
            if (postToShare.getOriginalPost() == null) {
                post.setOriginalPost(postToShare);
            } else {
                post.setOriginalPost(postToShare.getOriginalPost());
            }
            em.persist(post);
            em.flush();
            postToShare.getSharedPosts().add(post);
            user.getPosts().add(post);
        } else {
            throw new NoResultException("Post or comment owner not found");
        }
    }

    @Override
    public void deletePostById(Long postId) throws NoResultException {
        PostEntity post = em.find(PostEntity.class, postId);

        if (post != null) {
            Query q = em.createQuery("SELECT p FROM PostEntity AS p WHERE p.originalPost.postId = :pId");
            q.setParameter("pId", postId);
            List<PostEntity> postWithOriginalPostToBeDeleted = q.getResultList();
            for (int i = 0; i < postWithOriginalPostToBeDeleted.size(); i++) {
                postWithOriginalPostToBeDeleted.get(i).setOriginalPostDeleted(true);
                postWithOriginalPostToBeDeleted.get(i).setOriginalPost(null);
            }

            Query q2 = em.createQuery("SELECT p FROM PostEntity p");
            List<PostEntity> allPosts = q2.getResultList();
            for (int i = 0; i < allPosts.size(); i++) {
                if (!Objects.equals(allPosts.get(i).getPostId(), postId)) {
                    if (allPosts.get(i).getSharedPosts().contains(post)) {
                        allPosts.get(i).getSharedPosts().remove(post);
                    }
                }
            }

            post.getPostOwner().getPosts().remove(post);

            for (int i = 0; i < post.getComments().size(); i++) {
                em.remove(post.getComments().get(i));
            }

            if (post.getProject() != null) {
                post.getProject().getPosts().remove(post);
            }
            em.remove(post);
        } else {
            throw new NoResultException("Post is not found");
        }
    }

    @Override
    public void deletePostInProjectFeed(Long postId) throws NoResultException {
        PostEntity postToDelete = getPostById(postId);

        postToDelete.getPostOwner().getPosts().remove(postToDelete);
        postToDelete.setPostOwner(null);

        postToDelete.getProject().getPosts().remove(postToDelete);
        postToDelete.setProject(null);

        em.remove(postToDelete);
    }

    @Override
    public PostCommentEntity getPostCommentById(Long commentId) throws NoResultException {
        PostCommentEntity commentEntity = em.find(PostCommentEntity.class, commentId);
        if (commentEntity != null) {
            return commentEntity;
        } else {
            throw new NoResultException("Comment not found");
        }
    }

}
