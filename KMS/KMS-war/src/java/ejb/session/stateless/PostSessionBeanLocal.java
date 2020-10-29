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
import ws.restful.model.SharePostToProjectOrGroupsReq;

/**
 *
 * @author chai
 */
@Local
public interface PostSessionBeanLocal {

    public Long createNewPostInProjectFeed(PostEntity newPost, Long projectId, Long userId) throws NoResultException;

    public PostEntity createPost(PostEntity post) throws UserNotFoundException, NoResultException;

    public PostEntity getPostById(Long postId) throws NoResultException;

    public List<PostEntity> getPostForUserNewsfeed(Long userId) throws UserNotFoundException, NoResultException;

    public List<PostEntity> getPostForProjectNewsfeed(Long projectId) throws NoResultException;

    public List<PostEntity> getPostForGroupNewsfeed(Long groupId) throws NoResultException;

    public PostEntity updatePost(PostEntity postToUpdate) throws NoResultException;

    public void likePost(Long postId, Long userId) throws NoResultException, DuplicateLikeException;

    public void removeLikeForPost(Long postId, Long userId) throws NoResultException, LikeNotFoundException;

    public List<PostCommentEntity> addCommentForPost(Long postId, PostCommentEntity comment) throws NoResultException;

    public void likeComment(Long commentId, Long userId) throws DuplicateLikeException, NoResultException;

    public void removeLikeForComment(Long commentId, Long userId) throws NoResultException, LikeNotFoundException;

    public void deleteComment(Long commentId) throws NoResultException;

    public void updateComment(PostCommentEntity comment) throws NoResultException;

    public List<PostCommentEntity> getCommentsForPost(Long postId) throws NoResultException;

    public void sharePost(Long postToShareId, Long userId, PostEntity post) throws NoResultException;

    public void sharePostToProjects(Long postToShareId, Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq) throws NoResultException;

    public void sharePostToGroups(Long postToShareId, Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq) throws NoResultException;

    public void shareGroupToProjects(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long groupId) throws NoResultException;

    public void shareGroupToGroups(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long groupId) throws NoResultException;

    public void shareGroupToFollowers(Long userId, PostEntity post, Long groupId) throws NoResultException;

    public void shareProjectToProjects(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long projectId) throws NoResultException;

    public void shareProjectToGroups(Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, Long projectId) throws NoResultException;

    public void shareProjectToFollowers(Long userId, PostEntity post, Long projectId) throws NoResultException;

    public void deletePostById(Long postId) throws NoResultException;

    public void deletePostInProjectFeed(Long postId) throws NoResultException;

    public PostCommentEntity getPostCommentById(Long commentId) throws NoResultException;

}
