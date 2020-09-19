/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.AffiliatedUserExistException;
import Exception.DuplicateEmailException;
import Exception.DuplicateFollowRequestException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.InvalidUUIDException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.FollowRequestEntity;
import entity.MaterialResourceAvailableEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.ArrayList;
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
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import ws.restful.model.ErrorRsp;
import ws.restful.model.UpdateUserPasswordReq;

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

    @GET
    @Path("/affiliated/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getAffiliatedUsers(@PathParam("userId") Long userId) {
        try {
            List<UserEntity> affiliatedUsers = userSessionBeanLocal.getAffiliatedUsers(userId);
            return Response.status(200).entity(affiliatedUsers).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/addaffiliated/{userId}/{affiliatedToAddUserIdId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addAffiliatedUser(@PathParam("userId") Long userId, @PathParam("affiliatedToAddUserIdId") Long affiliatedToAddUserId) {
        try {
            userSessionBeanLocal.addAffiliatedUser(userId, affiliatedToAddUserId);
            return Response.status(204).build();
        } catch (AffiliatedUserExistException | UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/removeaffiliated/{userId}/{affiliatedToRemoveUserId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeAffiliatedUser(@PathParam("userId") Long userId, @PathParam("affiliatedToRemoveUserId") Long affiliatedToRemoveUserId) {
        try {
            userSessionBeanLocal.removeAffiliatedUser(userId, affiliatedToRemoveUserId);
            return Response.status(204).build();
        } catch (NoResultException | UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getSDG/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getSDGsForProfile(@PathParam("userId") Long userId) {
        try {
            List<TagEntity> SDGs = userSessionBeanLocal.getSDGsForProfile(userId);
            return Response.status(200).entity(SDGs).build();
        } catch (UserNotFoundException ex) {
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
    @Path("/mra")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createMaterialResourceAvailable(MaterialResourceAvailableEntity mra) {
        try {
            List<MaterialResourceAvailableEntity> mras = materialResourceAvailableSessionBeanLocal.createMaterialResourceAvailable(mra);
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
    public Response getMaterialResourceAvailable(@PathParam("userId") Long userId) {
        try {
            List<MaterialResourceAvailableEntity> mras = materialResourceAvailableSessionBeanLocal.getMaterialResourceAvailableForUser(userId);
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
            users = getUsersResponseWithFollowersAndFollowing(users);

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
        System.out.println("reached user resource");
        try {
            newUser = userSessionBeanLocal.createNewUser(user);
            userSessionBeanLocal.sendVerificationEmail(newUser.getEmail(), newUser.getVerificationCode());
        } catch (DuplicateEmailException ex) {
            return Response.status(Response.Status.BAD_REQUEST).entity(ex.getMessage()).build();
        }
        return Response.status(Response.Status.OK).entity(newUser).build();
    }

    @Path("resetPassword")
    @POST
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response forgotPassword(@QueryParam("email") String email) {
        try {
            System.out.println("forgot password for " + email);
            UserEntity user = userSessionBeanLocal.retrieveUserByEmail(email);
            userSessionBeanLocal.resetPassword(email);
        } catch (UserNotFoundException ex) {
            return Response.status(Response.Status.BAD_REQUEST).entity(ex.getMessage()).build();
        }
        return Response.status(Response.Status.OK).build();
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
    @Path("deleteUser/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteUser(@PathParam("userId") Long userId) {
        try {
            userSessionBeanLocal.deleteUser(userId);
            return Response.status(204).build();
        } catch (UserNotFoundException ex) {
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
            FollowRequestEntity followRequestEntity = userSessionBeanLocal.followUser(toUserId, fromUserId);
            if (followRequestEntity != null) {
                UserEntity to = new UserEntity();
                to.setUserId(followRequestEntity.getTo().getUserId());
                to.setFirstName(followRequestEntity.getTo().getFirstName());
                to.setLastName(followRequestEntity.getTo().getLastName());
                to.setProfilePicture(followRequestEntity.getTo().getProfilePicture());
                UserEntity from = new UserEntity();
                from.setUserId(followRequestEntity.getFrom().getUserId());
                from.setFirstName(followRequestEntity.getFrom().getFirstName());
                from.setLastName(followRequestEntity.getFrom().getLastName());
                from.setProfilePicture(followRequestEntity.getFrom().getProfilePicture());
                FollowRequestEntity followRequestEntityResponse = new FollowRequestEntity();
                followRequestEntityResponse.setId(followRequestEntity.getId());
                followRequestEntityResponse.setTo(to);
                followRequestEntityResponse.setFrom(from);
                return Response.status(200).entity(followRequestEntityResponse).build();
            } else {
                return Response.status(204).build();
            }
        } catch (UserNotFoundException | DuplicateFollowRequestException ex) {
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
    @Path("/rejectfollow/{toUserId}/{fromUserId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response rejectFollow(@PathParam("toUserId") Long toUserId, @PathParam("fromUserId") Long fromUserId) {
        try {
            userSessionBeanLocal.rejectFollowRequest(toUserId, fromUserId);
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
        } catch (InvalidUUIDException ex) {
            return Response.status(Response.Status.BAD_REQUEST).entity(ex.getMessage()).build();
        }
    }

    @GET
    @Path("/followrequestreceived/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowRequestReceived(@PathParam("userId") Long userId) {
        try {
            List<FollowRequestEntity> followRequestsReceived = userSessionBeanLocal.getFollowRequestReceived(userId);
            List<FollowRequestEntity> followRequestsResponse = getFollowRequestsResponse(followRequestsReceived);
            return Response.status(200).entity(followRequestsResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/followrequestmade/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowRequestMade(@PathParam("userId") Long userId) {
        try {
            List<FollowRequestEntity> followRequestsMade = userSessionBeanLocal.getFollowRequestMade(userId);
            List<FollowRequestEntity> followRequestsResponse = getFollowRequestsResponse(followRequestsMade);
            return Response.status(200).entity(followRequestsResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
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
            user.getFollowRequestMade().clear();
            user.getFollowRequestReceived().clear();
            user.setPassword("");
            return Response.status(200).entity(user).build();
        } catch (UserNotFoundException | NoResultException ex) {
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
            List<UserEntity> followersResponse = getUsersResponseWithFollowersAndFollowing(followers);
            System.out.println(followersResponse);
            return Response.status(200).entity(followersResponse).build();
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
            List<UserEntity> followingResponse = getUsersResponseWithFollowersAndFollowing(following);
            System.out.println(followingResponse);
            return Response.status(200).entity(followingResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private List<UserEntity> getUsersResponse(List<UserEntity> users) {
        List<UserEntity> usersResponse = new ArrayList<>();
        for (UserEntity user : users) {
            UserEntity temp = new UserEntity();
            temp.setUserId(user.getUserId());
            temp.setFirstName(user.getFirstName());
            temp.setLastName(user.getLastName());
            temp.setEmail(user.getEmail());
            temp.setDob(user.getDob());
            temp.setGender(user.getGender());
            temp.setJoinedDate(user.getJoinedDate());
            temp.setProfilePicture(user.getProfilePicture());
            temp.setSkills(user.getSkills());
            temp.setSdgs(user.getSdgs());
            temp.setUserType(user.getUserType());
            temp.setFollowRequestReceived(getFollowRequestsResponse(user.getFollowRequestReceived()));
            temp.setFollowRequestMade(getFollowRequestsResponse(user.getFollowRequestMade()));
            usersResponse.add(temp);
        }
        return usersResponse;
    }

    private List<UserEntity> getUsersResponseWithFollowersAndFollowing(List<UserEntity> users) {
        List<UserEntity> usersResponse = new ArrayList<>();
        for (UserEntity user : users) {
            UserEntity temp = new UserEntity();
            temp.setUserId(user.getUserId());
            temp.setFirstName(user.getFirstName());
            temp.setLastName(user.getLastName());
            temp.setEmail(user.getEmail());
            temp.setDob(user.getDob());
            temp.setGender(user.getGender());
            temp.setJoinedDate(user.getJoinedDate());
            temp.setProfilePicture(user.getProfilePicture());
            temp.setSkills(user.getSkills());
            temp.setSdgs(user.getSdgs());
            temp.setUserType(user.getUserType());
            temp.setFollowers(getUsersResponse(user.getFollowers()));
            temp.setFollowing(getUsersResponse(user.getFollowing()));
            temp.setFollowRequestReceived(getFollowRequestsResponse(user.getFollowRequestReceived()));
            temp.setFollowRequestMade(getFollowRequestsResponse(user.getFollowRequestMade()));
            usersResponse.add(temp);
        }
        return usersResponse;
    }

    private List<FollowRequestEntity> getFollowRequestsResponse(List<FollowRequestEntity> followRequests) {
        List<FollowRequestEntity> followRequestsResponse = new ArrayList<>();
        for (FollowRequestEntity followRequestEntity : followRequests) {
            UserEntity to = new UserEntity();
            to.setUserId(followRequestEntity.getTo().getUserId());
            to.setFirstName(followRequestEntity.getTo().getFirstName());
            to.setLastName(followRequestEntity.getTo().getLastName());
            to.setProfilePicture(followRequestEntity.getTo().getProfilePicture());
            UserEntity from = new UserEntity();
            from.setUserId(followRequestEntity.getFrom().getUserId());
            from.setFirstName(followRequestEntity.getFrom().getFirstName());
            from.setLastName(followRequestEntity.getFrom().getLastName());
            from.setProfilePicture(followRequestEntity.getFrom().getProfilePicture());
            FollowRequestEntity temp = new FollowRequestEntity();
            temp.setId(followRequestEntity.getId());
            temp.setTo(to);
            temp.setFrom(from);
            followRequestsResponse.add(temp);
        }
        return followRequestsResponse;
    }
    @Path("updateUserPassword")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateCustomerPassword(UpdateUserPasswordReq updateUserPasswordReq) {
        try {
            //UserEntity userToUpdate = userSessionBeanLocal.retrieveUserByEmail(updateUserPasswordReq.getEmail());
            userSessionBeanLocal.changePassword(updateUserPasswordReq.getEmail(), updateUserPasswordReq.getOldPassword(), updateUserPasswordReq.getNewPassword());
            return Response.status(Status.OK).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    //    @POST
//    @Path("ResetPassword")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response changePassword(@PathParam("password") String password) {
////            try {
////                userSessionBeanLocal.customerLogin(changePasswordReq.getUsername(), changePasswordReq.getPassword());
////                
////                userSessionBeanLocal.changePassword(changePasswordReq.getUsername(), changePasswordReq.getOldPassword(), changePasswordReq.getNewPassword());
////                
////                return Response.status(Response.Status.OK).build();
////            } catch (InvalidLoginCredentialException | ChangePasswordException ex) {
////                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
////
////                return Response.status(Response.Status.UNAUTHORIZED).entity(errorRsp).build();
////            } catch (Exception ex) {
////                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
////
////                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
////            }
//    }

}
