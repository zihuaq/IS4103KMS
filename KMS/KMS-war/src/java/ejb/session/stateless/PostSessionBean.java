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
import entity.GroupEntity;
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
import ws.restful.model.SharePostToProjectOrGroupsReq;

/**
 *
 * @author chai
 */
@Stateless
public class PostSessionBean implements PostSessionBeanLocal {

    @EJB
    private GroupSessionBeanLocal groupSessionBean;

    @EJB
    private ProjectSessionBeanLocal projectSessionBean;

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
            if (post.getProject() != null) {
                ProjectEntity project = projectSessionBeanLocal.getProjectById(post.getProject().getProjectId());
                if (project != null) {
                    em.persist(post);
                    em.flush();
                    user.getPosts().add(post);
                    project.getPosts().add(post);
                } else {
                    throw new NoResultException("Project does not exist.");
                }
            } else if (post.getGroup() != null) {
                GroupEntity group = groupSessionBean.getGroupById(post.getGroup().getGroupId());
                if (group != null) {
                    em.persist(post);
                    em.flush();
                    user.getPosts().add(post);
                    group.getPosts().add(post);
                } else {
                    throw new NoResultException("Group does not exist.");
                }
            } else {
                em.persist(post);
                em.flush();
                user.getPosts().add(post);
            }
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
        List<PostEntity> postForUserNewsFeed = new ArrayList<>();
        if (user != null) {
            postForUserNewsFeed.addAll(user.getPosts());
            for (int i = 0; i < user.getFollowing().size(); i++) {
                for (int j = 0; j < user.getFollowing().get(i).getPosts().size(); j++) {
                    if (user.getFollowing().get(i).getPosts().get(j).getProject() == null) {
                        postForUserNewsFeed.add(user.getFollowing().get(i).getPosts().get(j));
                    }
                }
            }
            for (int i = 0; i < user.getProjectsJoined().size(); i++) {
                for (int j = 0; j < user.getProjectsJoined().get(i).getPosts().size(); j++) {
                    if (user.getProjectsJoined().get(i).getPosts().get(j).getPostOwner() != user) {
                        postForUserNewsFeed.add(user.getProjectsJoined().get(i).getPosts().get(j));
                    }
                }
            }

            Collections.sort(postForUserNewsFeed, (PostEntity p1, PostEntity p2) -> p1.getPostDate().compareTo(p2.getPostDate()));
            Collections.reverse(postForUserNewsFeed);
            return postForUserNewsFeed;
        } else {
            throw new UserNotFoundException("User does not exist.");
        }
    }

    @Override
    public List<PostEntity> getPostForProjectNewsfeed(Long projectId) throws NoResultException {
        ProjectEntity project = projectSessionBean.getProjectById(projectId);

        if (project != null) {
            List<PostEntity> postForProjectNewsFeed = project.getPosts();

            Collections.sort(postForProjectNewsFeed, (PostEntity p1, PostEntity p2) -> p1.getPostDate().compareTo(p2.getPostDate()));
            Collections.reverse(postForProjectNewsFeed);
            return postForProjectNewsFeed;
        } else {
            throw new NoResultException("Project does not exist.");
        }
    }

    @Override
    public List<PostEntity> getPostForGroupNewsfeed(Long groupId) throws NoResultException {
        GroupEntity group = groupSessionBean.getGroupById(groupId);

        if (group != null) {
            List<PostEntity> postForGroupNewsFeed = group.getPosts();

            Collections.sort(postForGroupNewsFeed, (PostEntity p1, PostEntity p2) -> p1.getPostDate().compareTo(p2.getPostDate()));
            Collections.reverse(postForGroupNewsFeed);
            return postForGroupNewsFeed;
        } else {
            throw new NoResultException("Project does not exist.");
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
    public void sharePostToProjects(Long postToShareId, Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq) throws NoResultException {
        List<Long> projectIds = sharePostToProjectOrGroupsReq.getProjectsOrGroupsIds();
        PostEntity postToShare = em.find(PostEntity.class, postToShareId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (postToShare != null && user != null) {
            for (int i = 0; i < projectIds.size(); i++) {
                ProjectEntity project = em.find(ProjectEntity.class, projectIds.get(i));
                if (project != null) {
                    PostEntity post = new PostEntity();
                    post.setText(sharePostToProjectOrGroupsReq.getText());
                    post.setPostDate(sharePostToProjectOrGroupsReq.getPostDate());
                    post.setPostOwner(user);
                    if (postToShare.getOriginalPost() == null) {
                        post.setOriginalPost(postToShare);
                    } else {
                        post.setOriginalPost(postToShare.getOriginalPost());
                    }
                    post.setProject(project);
                    em.persist(post);
                    em.flush();
                    postToShare.getSharedPosts().add(post);
                    user.getPosts().add(post);
                    project.getPosts().add(post);
                } else {
                    throw new NoResultException("Project not found");
                }
            }

        } else {
            throw new NoResultException("Post or comment owner not found");
        }
    }

    @Override
    public void sharePostToGroups(Long postToShareId, Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq) throws NoResultException {
        List<Long> groupIds = sharePostToProjectOrGroupsReq.getProjectsOrGroupsIds();
        PostEntity postToShare = em.find(PostEntity.class, postToShareId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (postToShare != null && user != null) {
            for (int i = 0; i < groupIds.size(); i++) {
                GroupEntity group = em.find(GroupEntity.class, groupIds.get(i));
                if (group != null) {
                    PostEntity post = new PostEntity();
                    post.setText(sharePostToProjectOrGroupsReq.getText());
                    post.setPostDate(sharePostToProjectOrGroupsReq.getPostDate());
                    post.setPostOwner(user);
                    if (postToShare.getOriginalPost() == null) {
                        post.setOriginalPost(postToShare);
                    } else {
                        post.setOriginalPost(postToShare.getOriginalPost());
                    }
                    post.setGroup(group);
                    em.persist(post);
                    em.flush();
                    postToShare.getSharedPosts().add(post);
                    user.getPosts().add(post);
                    group.getPosts().add(post);
                } else {
                    throw new NoResultException("Project not found");
                }
            }

        } else {
            throw new NoResultException("Post or comment owner not found");
        }
    }

    @Override
    public void shareGroupToProjects(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long groupId) throws NoResultException {
        List<Long> projectIds = sharePostToProjectOrGroupsReq.getProjectsOrGroupsIds();
        GroupEntity groupToShare = em.find(GroupEntity.class, groupId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (groupToShare != null && user != null) {
            for (int i = 0; i < projectIds.size(); i++) {
                ProjectEntity project = em.find(ProjectEntity.class, projectIds.get(i));
                if (project != null) {
                    PostEntity post = new PostEntity();
                    post.setText(sharePostToProjectOrGroupsReq.getText());
                    post.setPostDate(sharePostToProjectOrGroupsReq.getPostDate());
                    post.setPostOwner(user);
                    post.setPicture(groupToShare.getProfilePicture());
                    post.setSharedGroupId(groupToShare.getGroupId().toString());
                    post.setSharedGroupOrProjectDescription(groupToShare.getDescription());
                    post.setSharedGroupOrProjectName(groupToShare.getName());
                    post.setProject(project);
                    em.persist(post);
                    em.flush();
                    user.getPosts().add(post);
                    project.getPosts().add(post);
                } else {
                    throw new NoResultException("Project not found");
                }
            }

        } else {
            throw new NoResultException("Group or user not found");
        }
    }

    @Override
    public void shareGroupToGroups(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long groupId) throws NoResultException {
        List<Long> groupIds = sharePostToProjectOrGroupsReq.getProjectsOrGroupsIds();
        GroupEntity groupToShare = em.find(GroupEntity.class, groupId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (groupToShare != null && user != null) {
            for (int i = 0; i < groupIds.size(); i++) {
                GroupEntity group = em.find(GroupEntity.class, groupIds.get(i));
                if (group != null) {
                    PostEntity post = new PostEntity();
                    post.setText(sharePostToProjectOrGroupsReq.getText());
                    post.setPostDate(sharePostToProjectOrGroupsReq.getPostDate());
                    post.setPostOwner(user);
                    post.setPicture(groupToShare.getProfilePicture());
                    post.setSharedGroupId(groupToShare.getGroupId().toString());
                    post.setSharedGroupOrProjectDescription(groupToShare.getDescription());
                    post.setSharedGroupOrProjectName(groupToShare.getName());
                    post.setGroup(group);
                    em.persist(post);
                    em.flush();
                    user.getPosts().add(post);
                    group.getPosts().add(post);
                } else {
                    throw new NoResultException("Group not found");
                }
            }
        } else {
            throw new NoResultException("Group or user not found");
        }
    }

    @Override
    public void shareGroupToFollowers(Long userId, PostEntity post, Long groupId) throws NoResultException {
        GroupEntity groupToShare = em.find(GroupEntity.class, groupId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (groupToShare != null && user != null) {
            post.setPostOwner(user);
            post.setPicture(groupToShare.getProfilePicture());
            post.setSharedGroupId(groupToShare.getGroupId().toString());
            post.setSharedGroupOrProjectDescription(groupToShare.getDescription());
            post.setSharedGroupOrProjectName(groupToShare.getName());
            em.persist(post);
            em.flush();
            user.getPosts().add(post);
        } else {
            throw new NoResultException("Group or user not found");
        }
    }

    @Override
    public void shareProjectToProjects(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long projectId) throws NoResultException {
        List<Long> projectIds = sharePostToProjectOrGroupsReq.getProjectsOrGroupsIds();
        ProjectEntity projectToShare = em.find(ProjectEntity.class, projectId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (projectToShare != null && user != null) {
            for (int i = 0; i < projectIds.size(); i++) {
                ProjectEntity project = em.find(ProjectEntity.class, projectIds.get(i));
                if (project != null) {
                    PostEntity post = new PostEntity();
                    post.setText(sharePostToProjectOrGroupsReq.getText());
                    post.setPostDate(sharePostToProjectOrGroupsReq.getPostDate());
                    post.setPostOwner(user);
                    post.setPicture(projectToShare.getProfilePicture());
                    post.setSharedProjectId(projectToShare.getProjectId().toString());
                    post.setSharedGroupOrProjectDescription(projectToShare.getDescription());
                    post.setSharedGroupOrProjectName(projectToShare.getName());
                    post.setProject(project);
                    em.persist(post);
                    em.flush();
                    user.getPosts().add(post);
                    project.getPosts().add(post);
                } else {
                    throw new NoResultException("Project not found");
                }
            }

        } else {
            throw new NoResultException("Project or user not found");
        }
    }

    @Override
    public void shareProjectToGroups(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long projectId) throws NoResultException {
        List<Long> groupIds = sharePostToProjectOrGroupsReq.getProjectsOrGroupsIds();
        ProjectEntity projectToShare = em.find(ProjectEntity.class, projectId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (projectToShare != null && user != null) {
            for (int i = 0; i < groupIds.size(); i++) {
                GroupEntity group = em.find(GroupEntity.class, groupIds.get(i));
                if (group != null) {
                    PostEntity post = new PostEntity();
                    post.setText(sharePostToProjectOrGroupsReq.getText());
                    post.setPostDate(sharePostToProjectOrGroupsReq.getPostDate());
                    post.setPostOwner(user);
                    post.setPicture(projectToShare.getProfilePicture());
                    post.setSharedProjectId(projectToShare.getProjectId().toString());
                    post.setSharedGroupOrProjectDescription(projectToShare.getDescription());
                    post.setSharedGroupOrProjectName(projectToShare.getName());
                    post.setGroup(group);
                    em.persist(post);
                    em.flush();
                    user.getPosts().add(post);
                    group.getPosts().add(post);
                } else {
                    throw new NoResultException("Group not found");
                }
            }
        } else {
            throw new NoResultException("Group or user not found");
        }
    }

    @Override
    public void shareProjectToFollowers(Long userId, PostEntity post, Long projectId) throws NoResultException {
        ProjectEntity projectToShare = em.find(ProjectEntity.class, projectId);
        UserEntity user = em.find(UserEntity.class, userId);

        if (projectToShare != null && user != null) {
            post.setPostOwner(user);
            post.setPicture(projectToShare.getProfilePicture());
            post.setSharedProjectId(projectToShare.getProjectId().toString());
            post.setSharedGroupOrProjectDescription(projectToShare.getDescription());
            post.setSharedGroupOrProjectName(projectToShare.getName());
            em.persist(post);
            em.flush();
            user.getPosts().add(post);
        } else {
            throw new NoResultException("Group or user not found");
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
            } else if (post.getGroup() != null) {
                post.getGroup().getPosts().remove(post);
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
