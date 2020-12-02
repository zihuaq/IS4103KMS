/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.DuplicateLikeException;
import Exception.LikeNotFoundException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.PostSessionBeanLocal;
import entity.ElectionApplicationEntity;
import entity.ElectionEntity;
import entity.GroupEntity;
import entity.PostCommentEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import ws.restful.model.SharePostToProjectOrGroupsReq;

/**
 * REST Web Service
 *
 * @author Cassie
 */
@Path("post")
public class PostResource {
    
    PostSessionBeanLocal postSessionBean = lookupPostSessionBeanLocal();
    
    @Context
    private UriInfo context;

    /**
     * Creates a new instance of PostResource
     */
    public PostResource() {
    }
    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createPost(PostEntity post) {
        try {
            PostEntity postEntity = postSessionBean.createPost(post);
            postEntity.getComments().clear();
            postEntity.getLikers().clear();
            postEntity.setPostOwner(null);
            postEntity.setProject(null);
            return Response.status(200).entity(postEntity).build();
        } catch (UserNotFoundException | NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updatePost(PostEntity post) {
        try {
            PostEntity postEntity = postSessionBean.updatePost(post);
            postEntity = processPost(postEntity);
            return Response.status(200).entity(postEntity).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/{postId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostById(@PathParam("postId") Long postId) {
        try {
            PostEntity post = postSessionBean.getPostById(postId);
            post = processPost(post);
            return Response.status(200).entity(post).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/userNewsFeed/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostForUserNewsfeed(@PathParam("userId") Long userId) {
        try {
            List<PostEntity> posts = postSessionBean.getPostForUserNewsfeed(userId);
            posts = getPostsResponse(posts);
            return Response.status(200).entity(posts).build();
        } catch (UserNotFoundException | NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/profileNewsFeed/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostForProfileNewsfeed(@PathParam("userId") Long userId) {
        try {
            List<PostEntity> posts = postSessionBean.getPostForProfileNewsfeed(userId);
            posts = getPostsResponse(posts);
            return Response.status(200).entity(posts).build();
        } catch (UserNotFoundException | NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/projectNewsFeed/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostForProjectNewsfeed(@PathParam("projectId") Long projectId) {
        try {
            List<PostEntity> posts = postSessionBean.getPostForProjectNewsfeed(projectId);
            posts = getPostsResponse(posts);
            return Response.status(200).entity(posts).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/groupNewsFeed/{groupId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostForGroupNewsfeed(@PathParam("groupId") Long groupId) {
        try {
            List<PostEntity> posts = postSessionBean.getPostForGroupNewsfeed(groupId);
            posts = getPostsResponse(posts);
            return Response.status(200).entity(posts).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/election/{electionId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostForElection(@PathParam("electionId") Long electionId) {
        try {
            List<PostEntity> posts = postSessionBean.getPostForElection(electionId);
            posts = getPostsResponse(posts);
            return Response.status(200).entity(posts).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/likePost/{userId}/{postId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response likePost(@PathParam("userId") Long userId, @PathParam("postId") Long postId) {
        try {
            postSessionBean.likePost(postId, userId);
            return Response.status(204).build();
        } catch (NoResultException | DuplicateLikeException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/removeLikeForPost/{userId}/{postId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeLikeForPost(@PathParam("userId") Long userId, @PathParam("postId") Long postId) {
        try {
            postSessionBean.removeLikeForPost(postId, userId);
            return Response.status(204).build();
        } catch (NoResultException | LikeNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/addComment/{postId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addCommentForPost(@PathParam("postId") Long postId, PostCommentEntity comment) {
        try {
            List<PostCommentEntity> postComments = postSessionBean.addCommentForPost(postId, comment);
            List<PostCommentEntity> comments = new ArrayList<>();
            for (int j = 0; j < postComments.size(); j++) {
                PostCommentEntity postComment = processComment(postComments.get(j));
                comments.add(postComment);
            }
            return Response.status(200).entity(comments).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/likeComment/{userId}/{commentId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response likeComment(@PathParam("userId") Long userId, @PathParam("commentId") Long commentId) {
        try {
            postSessionBean.likeComment(commentId, userId);
            return Response.status(204).build();
        } catch (NoResultException | DuplicateLikeException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/removeLikeForComment/{userId}/{commentId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeLikeForComment(@PathParam("userId") Long userId, @PathParam("commentId") Long commentId) {
        try {
            postSessionBean.removeLikeForComment(commentId, userId);
            return Response.status(204).build();
        } catch (NoResultException | LikeNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @DELETE
    @Path("/comment/{commentId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteComment(@PathParam("commentId") Long commentId) {
        try {
            postSessionBean.deleteComment(commentId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/updateComment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateComment(PostCommentEntity comment) {
        try {
            postSessionBean.updateComment(comment);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/postComments/{postId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommentsForPost(@PathParam("postId") Long postId) {
        try {
            List<PostCommentEntity> postComments = postSessionBean.getCommentsForPost(postId);
            List<PostCommentEntity> comments = new ArrayList<>();
            for (int j = 0; j < postComments.size(); j++) {
                PostCommentEntity comment = processComment(postComments.get(j));
                comments.add(comment);
            }
            return Response.status(200).entity(comments).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/sharePost/{postToShareId}/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response sharePost(@PathParam("postToShareId") Long postToShareId, @PathParam("userId") Long userId, PostEntity post) {
        try {
            postSessionBean.sharePost(postToShareId, userId, post);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/sharePostToProjects/{postToShareId}/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response sharePostToProjects(@PathParam("postToShareId") Long postToShareId, @PathParam("userId") Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq) {
        try {
            postSessionBean.sharePostToProjects(postToShareId, userId, sharePostToProjectOrGroupsReq);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/sharePostToGroups/{postToShareId}/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response sharePostToGroups(@PathParam("postToShareId") Long postToShareId, @PathParam("userId") Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq) {
        try {
            postSessionBean.sharePostToGroups(postToShareId, userId, sharePostToProjectOrGroupsReq);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/shareGroupToProjects/{userId}/{groupId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response shareGroupToProjects(@PathParam("userId") Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, @PathParam("groupId") Long groupId) {
        try {
            postSessionBean.shareGroupToProjects(userId, sharePostToProjectOrGroupsReq, groupId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/shareGroupToGroups/{userId}/{groupId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response shareGroupToGroups(@PathParam("userId") Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, @PathParam("groupId") Long groupId) {
        try {
            postSessionBean.shareGroupToGroups(userId, sharePostToProjectOrGroupsReq, groupId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/shareGroupToFollowers/{userId}/{groupId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response shareGroupToFollowers(@PathParam("userId") Long userId, PostEntity post, @PathParam("groupId") Long groupId) {
        try {
            postSessionBean.shareGroupToFollowers(userId, post, groupId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/shareProjectToProjects/{userId}/{projectId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response shareProjectToProjects(@PathParam("userId") Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, @PathParam("projectId") Long projectId) {
        try {
            postSessionBean.shareProjectToProjects(userId, sharePostToProjectOrGroupsReq, projectId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/shareProjectToGroups/{userId}/{projectId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response shareProjectToGroups(@PathParam("userId") Long userId, SharePostToProjectOrGroupsReq sharePostToProjectOrGroupsReq, @PathParam("projectId") Long projectId) {
        try {
            postSessionBean.shareProjectToGroups(userId, sharePostToProjectOrGroupsReq, projectId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/shareProjectToFollowers/{userId}/{projectId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response shareProjectToFollowers(@PathParam("userId") Long userId, PostEntity post, @PathParam("projectId") Long projectId) {
        try {
            postSessionBean.shareProjectToFollowers(userId, post, projectId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @DELETE
    @Path("/post/{postId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deletePost(@PathParam("postId") Long postId) {
        try {
            postSessionBean.deletePostById(postId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/comment/{commentId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostCommentById(@PathParam("commentId") Long commentId) {
        try {
            PostCommentEntity postCommentEntity = postSessionBean.getPostCommentById(commentId);
            postCommentEntity = processComment(postCommentEntity);
            return Response.status(200).entity(postCommentEntity).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    private List<PostEntity> getPostsResponse(List<PostEntity> posts) {
        List<PostEntity> result = new ArrayList<>();
        for (int i = 0; i < posts.size(); i++) {
            PostEntity post = processPost(posts.get(i));
            result.add(post);
        }
        return result;
    }
    
    private PostEntity processPost(PostEntity postToProcess) {
        PostEntity post = new PostEntity();
        post.setPostId(postToProcess.getPostId());
        post.setPostDate(postToProcess.getPostDate());
        post.setText(postToProcess.getText());
        post.setPicture(postToProcess.getPicture());
        post.setSharedGroupId(postToProcess.getSharedGroupId());
        post.setSharedProjectId(postToProcess.getSharedProjectId());
        post.setSharedGroupOrProjectDescription(postToProcess.getSharedGroupOrProjectDescription());
        post.setSharedGroupOrProjectName(postToProcess.getSharedGroupOrProjectName());
        post.setIsPinnedPost(postToProcess.getIsPinnedPost());
        post.setIsElectionPost(postToProcess.getIsElectionPost());
        UserEntity user = new UserEntity();
        user.setUserId(postToProcess.getPostOwner().getUserId());
        user.setFirstName(postToProcess.getPostOwner().getFirstName());
        user.setLastName(postToProcess.getPostOwner().getLastName());
        user.setProfilePicture(postToProcess.getPostOwner().getProfilePicture());
        user.setReputationPoints(postToProcess.getPostOwner().getReputationPoints());
        post.setPostOwner(user);
        List<UserEntity> likers = new ArrayList<UserEntity>();
        for (int j = 0; j < postToProcess.getLikers().size(); j++) {
            UserEntity liker = new UserEntity();
            liker.setUserId(postToProcess.getLikers().get(j).getUserId());
            likers.add(liker);
        }
        post.setLikers(likers);
        List<PostCommentEntity> comments = new ArrayList<>();
        for (int j = 0; j < postToProcess.getComments().size(); j++) {
            PostCommentEntity comment = processComment(postToProcess.getComments().get(j));
            comments.add(comment);
        }
        post.setComments(comments);
        List<PostEntity> sharedPosts = new ArrayList<>();
        for (int j = 0; j < postToProcess.getSharedPosts().size(); j++) {
            PostEntity sharedPost = new PostEntity();
            UserEntity postOwner = new UserEntity();
            postOwner.setUserId(postToProcess.getSharedPosts().get(j).getPostOwner().getUserId());
            sharedPost.setPostOwner(postOwner);
            sharedPosts.add(sharedPost);
        }
        post.setSharedPosts(sharedPosts);
        if (postToProcess.getOriginalPost() != null) {
            PostEntity originalPost = new PostEntity();
            UserEntity originalPostOwner = new UserEntity();
            originalPostOwner.setUserId(postToProcess.getOriginalPost().getPostOwner().getUserId());
            originalPostOwner.setFirstName(postToProcess.getOriginalPost().getPostOwner().getFirstName());
            originalPostOwner.setLastName(postToProcess.getOriginalPost().getPostOwner().getLastName());
            originalPost.setPostOwner(originalPostOwner);
            originalPost.setPicture(postToProcess.getOriginalPost().getPicture());
            originalPost.setText(postToProcess.getOriginalPost().getText());
            originalPost.setPostId(postToProcess.getOriginalPost().getPostId());
            originalPost.setPostDate(postToProcess.getOriginalPost().getPostDate());
            originalPost.setSharedGroupId(postToProcess.getOriginalPost().getSharedGroupId());
            originalPost.setSharedProjectId(postToProcess.getOriginalPost().getSharedProjectId());
            originalPost.setSharedGroupOrProjectDescription(postToProcess.getOriginalPost().getSharedGroupOrProjectDescription());
            originalPost.setSharedGroupOrProjectName(postToProcess.getOriginalPost().getSharedGroupOrProjectName());
            originalPost.setIsElectionPost(postToProcess.getOriginalPost().getIsElectionPost());
            originalPost.setIsPinnedPost(postToProcess.getOriginalPost().getIsPinnedPost());
            if (postToProcess.getOriginalPost().getProject() != null) {
                ProjectEntity project = new ProjectEntity();
                project.setProjectId(postToProcess.getOriginalPost().getProject().getProjectId());
                project.setName(postToProcess.getOriginalPost().getProject().getName());
                originalPost.setProject(project);
            } else if (postToProcess.getOriginalPost().getGroup() != null) {
                GroupEntity group = new GroupEntity();
                group.setGroupId(postToProcess.getOriginalPost().getGroup().getGroupId());
                group.setName(postToProcess.getOriginalPost().getGroup().getName());
                originalPost.setGroup(group);
            } else if (postToProcess.getOriginalPost().getElection() != null) {
                ElectionEntity election = new ElectionEntity();
                election.setName(postToProcess.getOriginalPost().getElection().getName());
                election.setDescription(postToProcess.getOriginalPost().getElection().getDescription());
                election.setNumSlots(postToProcess.getOriginalPost().getElection().getNumSlots());
                election.setMinRepPointsRequired(postToProcess.getOriginalPost().getElection().getMinRepPointsRequired());
                election.setId(postToProcess.getOriginalPost().getElection().getId());
                originalPost.setElection(election);
            } else if (postToProcess.getOriginalPost().getElectionApplication() != null) {
                ElectionApplicationEntity application = new ElectionApplicationEntity();
                application.setId(postToProcess.getOriginalPost().getElectionApplication().getId());
                application.setReasons(postToProcess.getOriginalPost().getElectionApplication().getReasons());
                application.setContributions(postToProcess.getOriginalPost().getElectionApplication().getContributions());
                application.setAdditionalComments(postToProcess.getOriginalPost().getElectionApplication().getAdditionalComments());
                originalPost.setElectionApplication(application);
            }
            if (postToProcess.getOriginalPost().getEndorser() != null) {
                UserEntity endorser = new UserEntity();
                endorser.setUserId(postToProcess.getOriginalPost().getEndorser().getUserId());
                endorser.setFirstName(postToProcess.getOriginalPost().getEndorser().getFirstName());
                endorser.setLastName(postToProcess.getOriginalPost().getEndorser().getLastName());
                originalPost.setEndorser(endorser);
            }
            post.setOriginalPost(originalPost);
        }
        post.setOriginalPostDeleted(postToProcess.isOriginalPostDeleted());
        if (postToProcess.getProject() != null) {
            ProjectEntity project = new ProjectEntity();
            project.setProjectId(postToProcess.getProject().getProjectId());
            project.setName(postToProcess.getProject().getName());
            post.setProject(project);
        } else if (postToProcess.getGroup() != null) {
            GroupEntity group = new GroupEntity();
            group.setGroupId(postToProcess.getGroup().getGroupId());
            group.setName(postToProcess.getGroup().getName());
            post.setGroup(group);
        } else if (postToProcess.getElection() != null) {
            ElectionEntity election = new ElectionEntity();
            election.setName(postToProcess.getElection().getName());
            election.setDescription(postToProcess.getElection().getDescription());
            election.setNumSlots(postToProcess.getElection().getNumSlots());
            election.setMinRepPointsRequired(postToProcess.getElection().getMinRepPointsRequired());
            election.setId(postToProcess.getElection().getId());
            post.setElection(election);
        } else if (postToProcess.getElectionApplication() != null) {
            ElectionApplicationEntity application = new ElectionApplicationEntity();
            application.setId(postToProcess.getElectionApplication().getId());
            application.setReasons(postToProcess.getElectionApplication().getReasons());
            application.setContributions(postToProcess.getElectionApplication().getContributions());
            application.setAdditionalComments(postToProcess.getElectionApplication().getAdditionalComments());
            post.setElectionApplication(application);
        }
        if (postToProcess.getEndorser() != null) {
            UserEntity endorser = new UserEntity();
            endorser.setUserId(postToProcess.getEndorser().getUserId());
            endorser.setFirstName(postToProcess.getEndorser().getFirstName());
            endorser.setLastName(postToProcess.getEndorser().getLastName());
            post.setEndorser(endorser);
        }
        System.out.println(post);
        System.out.println(postToProcess);
        return post;
    }
    
    private PostCommentEntity processComment(PostCommentEntity commentToProcess) {
        PostCommentEntity postComment = new PostCommentEntity();
        postComment.setPostCommentId(commentToProcess.getPostCommentId());
        UserEntity commentOwner = new UserEntity();
        commentOwner.setUserId(commentToProcess.getCommentOwner().getUserId());
        commentOwner.setProfilePicture(commentToProcess.getCommentOwner().getProfilePicture());
        commentOwner.setFirstName(commentToProcess.getCommentOwner().getFirstName());
        commentOwner.setLastName(commentToProcess.getCommentOwner().getLastName());
        postComment.setCommentOwner(commentOwner);
        postComment.setComment(commentToProcess.getComment());
        postComment.setDateTime(commentToProcess.getDateTime());
        List<UserEntity> commentLikers = new ArrayList<>();
        for (int k = 0; k < commentToProcess.getLikers().size(); k++) {
            UserEntity commentLiker = new UserEntity();
            commentLiker.setUserId(commentToProcess.getLikers().get(k).getUserId());
            commentLikers.add(commentLiker);
        }
        postComment.setLikers(commentLikers);
        return postComment;
    }
    
    private PostSessionBeanLocal lookupPostSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (PostSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/PostSessionBean!ejb.session.stateless.PostSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
