/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.DuplicateEmailException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.FollowRequestEntity;
import entity.GroupEntity;
import entity.MaterialResourceAvailableEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.ReviewEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

/**
 * REST Web Service
 *
 * @author cassie
 */
@Path("user")
public class UserResource {

    UserSessionBeanLocal userSessionBeanLocal = lookupUserSessionBeanLocal();

    TagSessionBeanLocal tagSessionBeanLocal = lookupTagSessionBeanLocal();

    MaterialResourceAvailableSessionBeanLocal materialResourceAvailableSessionBeanLocal = lookupMaterialResourceAvailableSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of UserResource
     */
    public UserResource() {
    }

    private MaterialResourceAvailableSessionBeanLocal lookupMaterialResourceAvailableSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (MaterialResourceAvailableSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/MaterialResourceAvailableSessionBean!ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    private TagSessionBeanLocal lookupTagSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (TagSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/TagSessionBean!ejb.session.stateless.TagSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    private UserSessionBeanLocal lookupUserSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (UserSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/UserSessionBean!ejb.session.stateless.UserSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    @PUT
    @Path("/addskills/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addSkillsToProfile(@PathParam("userId") Long userId, List<TagEntity> tags) {
        try {
            List<TagEntity> updatedSkills = userSessionBeanLocal.addSkillsToProfile(userId, tags);
            return Response.status(200).entity(updatedSkills).build();

        } catch (NoResultException | DuplicateTagInProfileException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @PUT
    @Path("/addskill/{userId}/{tagId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addSkillToProfile(@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
        try {
            userSessionBeanLocal.addSkillToProfile(userId, tagId);
            return Response.status(204).build();

        } catch (NoResultException | DuplicateTagInProfileException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(400).entity(exception).build();
        }
    }

    @DELETE
    @Path("/removeskill/{userId}/{tagId}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeSkillFromProfile(@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
        try {
            List<TagEntity> updatedSkills = userSessionBeanLocal.removeSkillFromProfile(userId, tagId);
            return Response.status(200).entity(updatedSkills).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/addSDG/{userId}/{tagId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addSDGToProfile(@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
        try {
            userSessionBeanLocal.addSDGToProfile(userId, tagId);
            return Response.status(204).build();
        } catch (NoResultException | DuplicateTagInProfileException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/removeSDG/{userId}/{tagId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeSDGFromProfile(@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
        try {
            userSessionBeanLocal.removeSDGFromProfile(userId, tagId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/mra/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createMaterialResourceAvailable(@PathParam("userId") Long userId, MaterialResourceAvailableEntity mra) {
        try {
            materialResourceAvailableSessionBeanLocal.createMaterialResourceAvailable(mra, userId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @DELETE
    @Path("/mra/{userId}/{mraId}")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMaterialRequestFromProfile(@PathParam("userId") Long userId, @PathParam("mraId") Long mraId) {
        try {
            materialResourceAvailableSessionBeanLocal.deleteMaterialResourceAvailableForUser(userId, mraId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/mra/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMaterialRequestAvailable(@PathParam("userId") Long userId) {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            return Response.status(200).entity(user.getMras()).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUser(@PathParam("userId") Long userId) {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            System.out.println("following" + user.getFollowing());
            for (int i = 0; i < user.getFollowRequestMade().size(); i++) {
                user.getFollowRequestMade().get(i).getFrom().getFollowRequestMade().clear();
                user.getFollowRequestMade().get(i).getFrom().getFollowRequestReceived().clear();
                user.getFollowRequestMade().get(i).getFrom().getFollowers().clear();
                user.getFollowRequestMade().get(i).getFrom().getFollowing().clear();
                user.getFollowRequestMade().get(i).getFrom().getGroups().clear();
                user.getFollowRequestMade().get(i).getFrom().getGroupsOwned().clear();
                user.getFollowRequestMade().get(i).getFrom().getMras().clear();
                user.getFollowRequestMade().get(i).getFrom().getPosts().clear();
                user.getFollowRequestMade().get(i).getFrom().getProjectAdmins().clear();
                user.getFollowRequestMade().get(i).getFrom().getProjectsContributed().clear();
                user.getFollowRequestMade().get(i).getFrom().getProjectsOwned().clear();
                user.getFollowRequestMade().get(i).getFrom().getReviewsGiven().clear();
                user.getFollowRequestMade().get(i).getTo().getFollowRequestMade().clear();
                user.getFollowRequestMade().get(i).getTo().getFollowRequestReceived().clear();
                user.getFollowRequestMade().get(i).getTo().getFollowers().clear();
                user.getFollowRequestMade().get(i).getTo().getFollowing().clear();
                user.getFollowRequestMade().get(i).getTo().getGroups().clear();
                user.getFollowRequestMade().get(i).getTo().getGroupsOwned().clear();
                user.getFollowRequestMade().get(i).getTo().getMras().clear();
                user.getFollowRequestMade().get(i).getTo().getPosts().clear();
                user.getFollowRequestMade().get(i).getTo().getProjectAdmins().clear();
                user.getFollowRequestMade().get(i).getTo().getProjectsContributed().clear();
                user.getFollowRequestMade().get(i).getTo().getProjectsOwned().clear();
                user.getFollowRequestMade().get(i).getTo().getReviewsGiven().clear();
            }
            for (int i = 0; i < user.getFollowRequestReceived().size(); i++) {
                user.getFollowRequestReceived().get(i).getFrom().getFollowRequestMade().clear();
                user.getFollowRequestReceived().get(i).getFrom().getFollowRequestReceived().clear();
                user.getFollowRequestReceived().get(i).getFrom().getFollowers().clear();
                user.getFollowRequestReceived().get(i).getFrom().getFollowing().clear();
                user.getFollowRequestReceived().get(i).getFrom().getGroups().clear();
                user.getFollowRequestReceived().get(i).getFrom().getGroupsOwned().clear();
                user.getFollowRequestReceived().get(i).getFrom().getMras().clear();
                user.getFollowRequestReceived().get(i).getFrom().getPosts().clear();
                user.getFollowRequestReceived().get(i).getFrom().getProjectAdmins().clear();
                user.getFollowRequestReceived().get(i).getFrom().getProjectsContributed().clear();
                user.getFollowRequestReceived().get(i).getFrom().getProjectsOwned().clear();
                user.getFollowRequestReceived().get(i).getFrom().getReviewsGiven().clear();
                user.getFollowRequestReceived().get(i).getTo().getFollowRequestMade().clear();
                user.getFollowRequestReceived().get(i).getTo().getFollowRequestReceived().clear();
                user.getFollowRequestReceived().get(i).getTo().getFollowers().clear();
                user.getFollowRequestReceived().get(i).getTo().getFollowing().clear();
                user.getFollowRequestReceived().get(i).getTo().getGroups().clear();
                user.getFollowRequestReceived().get(i).getTo().getGroupsOwned().clear();
                user.getFollowRequestReceived().get(i).getTo().getMras().clear();
                user.getFollowRequestReceived().get(i).getTo().getPosts().clear();
                user.getFollowRequestReceived().get(i).getTo().getProjectAdmins().clear();
                user.getFollowRequestReceived().get(i).getTo().getProjectsContributed().clear();
                user.getFollowRequestReceived().get(i).getTo().getProjectsOwned().clear();
                user.getFollowRequestReceived().get(i).getTo().getReviewsGiven().clear();
            }
            for (int i = 0; i < user.getFollowers().size(); i++) {
                user.getFollowers().get(i).getFollowRequestMade().clear();
                user.getFollowers().get(i).getFollowRequestReceived().clear();
                user.getFollowers().get(i).getFollowers().clear();
                user.getFollowers().get(i).getFollowing().clear();
                user.getFollowers().get(i).getGroups().clear();
                user.getFollowers().get(i).getGroupsOwned().clear();
                user.getFollowers().get(i).getMras().clear();
                user.getFollowers().get(i).getPosts().clear();
                user.getFollowers().get(i).getProjectAdmins().clear();
                user.getFollowers().get(i).getProjectsContributed().clear();
                user.getFollowers().get(i).getProjectsOwned().clear();
                user.getFollowers().get(i).getReviewsGiven().clear();
            }
            for (int i = 0; i < user.getFollowing().size(); i++) {
                user.getFollowing().get(i).getFollowRequestMade().clear();
                user.getFollowing().get(i).getFollowRequestReceived().clear();
                user.getFollowing().get(i).getFollowers().clear();
                user.getFollowing().get(i).getFollowing().clear();
                user.getFollowing().get(i).getGroups().clear();
                user.getFollowing().get(i).getGroupsOwned().clear();
                user.getFollowing().get(i).getMras().clear();
                user.getFollowing().get(i).getPosts().clear();
                user.getFollowing().get(i).getProjectAdmins().clear();
                user.getFollowing().get(i).getProjectsContributed().clear();
                user.getFollowing().get(i).getProjectsOwned().clear();
                user.getFollowing().get(i).getReviewsGiven().clear();
            }
            for (int i = 0; i < user.getGroups().size(); i++) {
                user.getGroups().get(i).setGroupOwner(null);
                user.getGroups().get(i).getUsers().clear();
            }
            for (int i = 0; i < user.getGroupsOwned().size(); i++) {
                user.getGroupsOwned().get(i).setGroupOwner(null);
                user.getGroupsOwned().get(i).getUsers().clear();
            }
            for (int i = 0; i < user.getMras().size(); i++) {
                user.getMras().get(i).setMaterialResourceAvailableOwner(null);
            }
            for (int i = 0; i < user.getPosts().size(); i++) {
                user.getPosts().get(i).setPostOwner(null);
                user.getPosts().get(i).setProject(null);
            }
            for (int i = 0; i < user.getProjectAdmins().size(); i++) {
                user.getProjectAdmins().get(i).getActivities().clear();
                user.getProjectAdmins().get(i).getAdmins().clear();
                user.getProjectAdmins().get(i).getGroupMembers().clear();
                user.getProjectAdmins().get(i).getHumanResourcePostings().clear();
                user.getProjectAdmins().get(i).getMaterialResourcePostings().clear();
                user.getProjectAdmins().get(i).getPosts().clear();
                user.getProjectAdmins().get(i).setOwner(null);
                user.getProjectAdmins().get(i).getTasks().clear();
            }
            for (int i = 0; i < user.getProjectsContributed().size(); i++) {
                user.getProjectsContributed().get(i).getActivities().clear();
                user.getProjectsContributed().get(i).getAdmins().clear();
                user.getProjectsContributed().get(i).getGroupMembers().clear();
                user.getProjectsContributed().get(i).getHumanResourcePostings().clear();
                user.getProjectsContributed().get(i).getMaterialResourcePostings().clear();
                user.getProjectsContributed().get(i).getPosts().clear();
                user.getProjectsContributed().get(i).setOwner(null);
                user.getProjectsContributed().get(i).getTasks().clear();
            }
            for (int i = 0; i < user.getProjectsOwned().size(); i++) {
                user.getProjectsOwned().get(i).getActivities().clear();
                user.getProjectsOwned().get(i).getAdmins().clear();
                user.getProjectsOwned().get(i).getGroupMembers().clear();
                user.getProjectsOwned().get(i).getHumanResourcePostings().clear();
                user.getProjectsOwned().get(i).getMaterialResourcePostings().clear();
                user.getProjectsOwned().get(i).getPosts().clear();
                user.getProjectsOwned().get(i).setOwner(null);
                user.getProjectsOwned().get(i).getTasks().clear();
            }
            for (int i = 0; i < user.getReviewsGiven().size(); i++) {
                user.getReviewsGiven().get(i).setFrom(null);
                user.getReviewsGiven().get(i).setTo(null);
            }
            for (int i = 0; i < user.getReviewsReceived().size(); i++) {
                user.getReviewsReceived().get(i).setFrom(null);
                user.getReviewsReceived().get(i).setTo(null);
            }
            return Response.status(200).entity(user).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @Path("userRegistration")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response userRegistration(UserEntity user) {
        UserEntity newUser;
        try {
            newUser = userSessionBeanLocal.createNewUser(user);
            userSessionBeanLocal.sendVerificationEmail(newUser.getEmail());
        } catch (DuplicateEmailException ex) {
            return Response.status(Response.Status.BAD_REQUEST).entity(ex.getMessage()).build();
        }
        return Response.status(Response.Status.OK).entity(newUser).build();
    }

    @Path("userLogin")
    @GET
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response userLogin(@QueryParam("email") String email, @QueryParam("password") String password) {
        try {
            UserEntity user = this.userSessionBeanLocal.userLogin(email, password);
            System.out.println("here");
            user.getGroups().clear();
            user.getGroupsOwned().clear();
            user.getPosts().clear();
            user.getProjectAdmins().clear();
            user.getProjectsContributed().clear();
            user.getProjectsOwned().clear();
            user.getReviewsGiven().clear();
            user.getSdgs().clear();
            user.getSkills().clear();
            user.getBadges().clear();
            user.getFollowers().clear();
            user.getFollowing().clear();
            System.out.println("here");
            return Response.status(Response.Status.OK).entity(user).build();
        } catch (InvalidLoginCredentialException ex) {
            return Response.status(Response.Status.UNAUTHORIZED).entity(ex.getMessage()).build();
        } catch (StackOverflowError ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
        } catch (Exception ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
        }

    }

    @DELETE
    @Path("deleteUser")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("userId") Long userId, UserEntity user) {
        try {
            userSessionBeanLocal.deleteUser(userId, user);

            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/follow/{toUserId}/{fromUserId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response followUser(@PathParam("toUserId") Long toUserId, @PathParam("fromUserId") Long fromUserId) {
        try {
            userSessionBeanLocal.followUser(toUserId, fromUserId);
            return Response.status(204).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/acceptfollow/{toUserId}/{fromUserId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response acceptFollow(@PathParam("toUserId") Long toUserId, @PathParam("fromUserId") Long fromUserId) {
        try {
            userSessionBeanLocal.acceptFollowRequest(toUserId, fromUserId);
            return Response.status(204).build();
        } catch (NoResultException | UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/unfollow/{toUserId}/{fromUserId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response unfollowUser(@PathParam("toUserId") Long toUserId, @PathParam("fromUserId") Long fromUserId) {
        try {
            userSessionBeanLocal.unfollowUser(toUserId, fromUserId);
            return Response.status(204).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

}
