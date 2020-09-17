/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.DuplicateEmailException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.InvalidUUIDException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.MaterialResourceAvailableEntity;
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
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
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

    @GET
    @Path("/skills/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSkillsForProfile(@PathParam("userId") Long userId) {
        try {
            List<TagEntity> skills = userSessionBeanLocal.getSkillsForProfile(userId);
            return Response.status(200).entity(skills).build();

        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
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
            List<MaterialResourceAvailableEntity> mras = materialResourceAvailableSessionBeanLocal.createMaterialResourceAvailable(mra, userId);
            for (int i = 0; i < mras.size(); i++) {
                mras.get(i).setMaterialResourceAvailableOwner(null);
            }
            return Response.status(200).entity(mras).build();
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
            List<MaterialResourceAvailableEntity> mras = materialResourceAvailableSessionBeanLocal.deleteMaterialResourceAvailableForUser(userId, mraId);
            for (int i = 0; i < mras.size(); i++) {
                mras.get(i).setMaterialResourceAvailableOwner(null);
            }
            return Response.status(200).entity(mras).build();
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
            List<MaterialResourceAvailableEntity> mras = userSessionBeanLocal.getMaterialRequestAvailable(userId);
            for (int i = 0; i < mras.size(); i++) {
                mras.get(i).setMaterialResourceAvailableOwner(null);
            }
            return Response.status(200).entity(mras).build();
        } catch (UserNotFoundException ex) {
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

            user.getReviewsGiven().clear();
            user.getReviewsReceived().clear();
            user.getProjectsOwned().clear();
            user.getProjectsJoined().clear();
            user.getProjectAdmins().clear();
            user.getGroupsJoined().clear();
            user.getGroupAdmins().clear();
            user.getGroupsOwned().clear();
            user.getPosts().clear();
            user.getBadges().clear();
            user.getMras().clear();
            user.getSkills().clear();
            user.getFollowing().clear();
            user.getFollowers().clear();
            user.getSdgs().clear();
            user.getFollowRequestMade().clear();
            user.getFollowRequestReceived().clear();
            user.setPassword("");

            return Response.status(200).entity(user).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @GET
    @Path("/allusers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        try {
            List<UserEntity> users = userSessionBeanLocal.getAllUsers();
            for (int i = 0; i < users.size(); i++) {
                users.get(i).getFollowRequestMade().clear();
                users.get(i).getFollowRequestReceived().clear();
                users.get(i).getFollowers().clear();
                users.get(i).getFollowing().clear();
                users.get(i).getGroupsJoined().clear();
                users.get(i).getGroupsOwned().clear();
                users.get(i).getGroupAdmins().clear();
                users.get(i).getMras().clear();
                users.get(i).getSkills().clear();
                users.get(i).getPosts().clear();
                users.get(i).getProjectAdmins();
                users.get(i).getProjectsJoined().clear();
                users.get(i).getProjectsOwned().clear();
                users.get(i).getReviewsGiven().clear();
                users.get(i).getReviewsReceived().clear();
                users.get(i).getBadges().clear();
                users.get(i).getSdgs().clear();
            }
            return Response.status(200).entity(users).build();
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
            userSessionBeanLocal.sendVerificationEmail(newUser.getEmail(), newUser.getVerificationCode());
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


            user.getReviewsGiven().clear();
            user.getReviewsReceived().clear();
            user.getProjectsOwned().clear();
            user.getProjectsJoined().clear();
            user.getProjectAdmins().clear();
            user.getGroupsJoined().clear();
            user.getGroupAdmins().clear();
            user.getPosts().clear();
            user.getGroupsOwned().clear();
            user.getBadges().clear();
            user.getMras().clear();
            user.getSkills().clear();
            user.getFollowing().clear();
            user.getFollowers().clear();
            user.getSdgs().clear();
            user.getFollowRequestMade().clear();
            user.getFollowRequestReceived().clear();
            user.setPassword("");

            return Response.status(Response.Status.OK).entity(user).build();
        } catch (InvalidLoginCredentialException ex) {
            System.out.println(ex.getMessage());
            return Response.status(Response.Status.UNAUTHORIZED).entity(ex.getMessage()).build();
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
    
    @GET
    @Path("verifyEmail")
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response verifyEmail(@QueryParam("email") String email, @QueryParam("uuid") String uuid) {
        try {
            Boolean isVerified = userSessionBeanLocal.verifyEmail(email, uuid);
            return Response.status(Response.Status.OK).entity(isVerified).build();
        } catch (UserNotFoundException ex) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
        } catch (InvalidUUIDException ex){
            return Response.status(Response.Status.BAD_REQUEST).entity(ex.getMessage()).build();
        }
    }

    @POST
    @Path("/update")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateUser(UserEntity updatedUser) {
        try {
            UserEntity user = userSessionBeanLocal.updateUser(updatedUser);
            user.getReviewsGiven().clear();
            user.getReviewsReceived().clear();
            user.getProjectsOwned().clear();
            user.getProjectsJoined().clear();
            user.getProjectAdmins().clear();
            user.getGroupsJoined().clear();
            user.getGroupAdmins().clear();
            user.getPosts().clear();
            user.getGroupsOwned().clear();
            user.getBadges().clear();
            user.getMras().clear();
            user.getSkills().clear();
            user.getFollowing().clear();
            user.getFollowers().clear();
            user.getSdgs().clear();
            user.getFollowRequestMade().clear();
            user.getFollowRequestReceived().clear();
            user.setPassword("");
            return Response.status(200).entity(user).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        } catch (DuplicateEmailException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(400).entity(exception).build();
        }
    }

    @GET
    @Path("/followers/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowers(@PathParam("userId") Long userId) {
        try {
            List<UserEntity> followers = userSessionBeanLocal.getFollowers(userId);
            for (UserEntity user : followers) {
                user.getReviewsGiven().clear();
                user.getReviewsReceived().clear();
                user.getProjectsOwned().clear();
                user.getProjectsJoined().clear();
                user.getProjectAdmins().clear();
                user.getGroupsJoined().clear();
                user.getGroupAdmins().clear();
                user.getPosts().clear();
                user.getGroupsOwned().clear();
                user.getBadges().clear();
                user.getMras().clear();
                user.getSkills().clear();
                user.getFollowing().clear();
                user.getFollowers().clear();
                user.getSdgs().clear();
                user.getFollowRequestMade().clear();
                user.getFollowRequestReceived().clear();
                user.setPassword("");
            }
            return Response.status(200).entity(followers).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    @GET
    @Path("/following/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowing(@PathParam("userId") Long userId) {
        try {
            List<UserEntity> following = userSessionBeanLocal.getFollowing(userId);
            for (UserEntity user : following) {
                user.getReviewsGiven().clear();
                user.getReviewsReceived().clear();
                user.getProjectsOwned().clear();
                user.getProjectsJoined().clear();
                user.getProjectAdmins().clear();
                user.getGroupsJoined().clear();
                user.getGroupAdmins().clear();
                user.getPosts().clear();
                user.getGroupsOwned().clear();
                user.getBadges().clear();
                user.getMras().clear();
                user.getSkills().clear();
                user.getFollowing().clear();
                user.getFollowers().clear();
                user.getSdgs().clear();
                user.getFollowRequestMade().clear();
                user.getFollowRequestReceived().clear();
                user.setPassword("");
            }
            return Response.status(200).entity(following).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
}
