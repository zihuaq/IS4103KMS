/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.DuplicateApplicationException;
import Exception.NoResultException;
import ejb.session.stateless.ElectionSessionBeanLocal;
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
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Cassie
 */
@Path("election")
public class ElectionResource {

    ElectionSessionBeanLocal electionSessionBean = lookupElectionSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ElectionResource
     */
    public ElectionResource() {
    }

    @GET
    @Path("/hasActiveElection")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHasActiveElection() {
        return Response.status(200).entity(electionSessionBean.hasActiveElection()).build();
    }

    @GET
    @Path("/activeElection")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getActiveElection() {
        try {
            ElectionEntity election = electionSessionBean.getActiveElection();
            election = processElection(election);
            return Response.status(200).entity(election).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/createElection")
    public Response createElection(ElectionEntity election) {
        try {
            electionSessionBean.createElection(election);
            return Response.status(200).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/createElectionApplication")
    public Response createElectionApplication(ElectionApplicationEntity electionApplication) {
        try {
            electionSessionBean.createElectionApplication(electionApplication);
            return Response.status(200).build();
        } catch (NoResultException | DuplicateApplicationException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private ElectionEntity processElection(ElectionEntity electionToProcess) {
        ElectionEntity temp = new ElectionEntity();
        temp.setId(electionToProcess.getId());
        temp.setName(electionToProcess.getName());
        temp.setDescription(electionToProcess.getDescription());
        temp.setIsActive(electionToProcess.isIsActive());
        temp.setStartDate(electionToProcess.getStartDate());
        temp.setEndDate(electionToProcess.getEndDate());
        UserEntity u = new UserEntity();
        u.setUserId(electionToProcess.getElectionOwner().getUserId());
        u.setFirstName(electionToProcess.getElectionOwner().getFirstName());
        u.setLastName(electionToProcess.getElectionOwner().getLastName());
        temp.setElectionOwner(u);
        temp.setElectionPosts(getPostsResponse(electionToProcess.getElectionPosts()));
        temp.setElectionApplications(processElectionApplicationEntities(electionToProcess.getElectionApplications()));
        temp.setNumSlots(electionToProcess.getNumSlots());
        temp.setMinRepPointsRequired(electionToProcess.getMinRepPointsRequired());
        return temp;
    }

    private List<ElectionApplicationEntity> processElectionApplicationEntities(List<ElectionApplicationEntity> electionApplicationsToProcess) {
        List<ElectionApplicationEntity> result = new ArrayList<>();
        for (int i = 0; i < electionApplicationsToProcess.size(); i++) {
            ElectionApplicationEntity application = processElectionApplicationEntity(electionApplicationsToProcess.get(i));
            result.add(application);
        }
        return result;
    }

    private ElectionApplicationEntity processElectionApplicationEntity(ElectionApplicationEntity electionApplicationToProcess) {
        ElectionApplicationEntity temp = new ElectionApplicationEntity();
        temp.setId(electionApplicationToProcess.getId());
        temp.setContributions(electionApplicationToProcess.getContributions());
        temp.setReasons(electionApplicationToProcess.getReasons());
        temp.setApplicationDate(electionApplicationToProcess.getApplicationDate());
        temp.setApplicationOwner(processUser(electionApplicationToProcess.getApplicationOwner()));
        return temp;
    }

    private UserEntity processUser(UserEntity userToProcess) {
        UserEntity temp = new UserEntity();
        temp.setUserId(userToProcess.getUserId());
        temp.setFirstName(userToProcess.getFirstName());
        temp.setLastName(userToProcess.getLastName());
        temp.setEmail(userToProcess.getEmail());
        temp.setJoinedDate(userToProcess.getJoinedDate());
        temp.setProfilePicture(userToProcess.getProfilePicture());
        temp.setSkills(userToProcess.getSkills());
        temp.setSdgs(userToProcess.getSdgs());
        temp.setUserType(userToProcess.getUserType());
        temp.setReputationPoints(userToProcess.getReputationPoints());
        return temp;
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

    private ElectionSessionBeanLocal lookupElectionSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (ElectionSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/ElectionSessionBean!ejb.session.stateless.ElectionSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
