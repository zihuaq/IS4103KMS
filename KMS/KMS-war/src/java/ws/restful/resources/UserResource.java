/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.AffiliatedUserExistException;
import Exception.DuplicateAffiliationRequestException;
import Exception.DuplicateEmailException;
import Exception.DuplicateFollowRequestException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.InvalidUUIDException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.AffiliationRequestEntity;
import entity.FollowRequestEntity;
import entity.GroupEntity;
import entity.HumanResourcePostingEntity;
import entity.ProjectEntity;
import entity.ReviewEntity;
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
import javax.persistence.EntityManager;
import javax.transaction.UserTransaction;
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
import ws.restful.model.editReviewReq;
import ws.restful.model.editReviewRsp;

/**
 * REST Web Service
 *
 * @author cassie
 */
@Path("user")
public class UserResource {

    UserSessionBeanLocal userSessionBeanLocal = lookupUserSessionBeanLocal();

    TagSessionBeanLocal tagSessionBeanLocal = lookupTagSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of UserResource
     */
    public UserResource() {
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
            List<UserEntity> affiliatedUsersResponse = getUsersResponseWithAffiliatedIndividualsOrInstitutes(affiliatedUsers);
            return Response.status(200).entity(affiliatedUsersResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/affiliated/{userId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response makeAffiliationRequests(@PathParam("userId") Long userId, List<Long> toUserIds) {
        try {
            userSessionBeanLocal.makeAffiliationRequest(userId, toUserIds);
            return Response.status(204).build();
        } catch (UserNotFoundException | DuplicateAffiliationRequestException | AffiliatedUserExistException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/addaffiliated/{userId}/{affiliatedToAddUserIdId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response sendAffiliateReqToUser(@PathParam("userId") Long userId, @PathParam("affiliatedToAddUserIdId") Long affiliatedToAddUserId) {
        try {
            AffiliationRequestEntity req = userSessionBeanLocal.sendAffiliateReqToUser(userId, affiliatedToAddUserId);
            AffiliationRequestEntity reqResponse = getAffiliationRequestResponse(req);
            return Response.status(200).entity(reqResponse).build();
        } catch (AffiliatedUserExistException | UserNotFoundException | DuplicateAffiliationRequestException ex) {
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
    @Path("/affiliationrequestmade/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAffiliationRequestMade(@PathParam("userId") Long userId) {
        try {
            List<AffiliationRequestEntity> affiliationRequestsMade = userSessionBeanLocal.getAffiliationRequestsMade(userId);
            List<AffiliationRequestEntity> affiliationRequestsResponse = getAffiliationRequestsResponse(affiliationRequestsMade);
            return Response.status(200).entity(affiliationRequestsResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/affiliationrequestreceived/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAffiliationRequestReceived(@PathParam("userId") Long userId) {
        try {
            List<AffiliationRequestEntity> affiliationRequestsReceived = userSessionBeanLocal.getAffiliationRequestsReceived(userId);
            List<AffiliationRequestEntity> affiliationRequestsResponse = getAffiliationRequestsResponse(affiliationRequestsReceived);
            return Response.status(200).entity(affiliationRequestsResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/acceptaffiliation/{toUserId}/{fromUserId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response acceptAffiliation(@PathParam("toUserId") Long toUserId, @PathParam("fromUserId") Long fromUserId) {
        try {
            userSessionBeanLocal.acceptAffiliationRequest(toUserId, fromUserId);
            return Response.status(204).build();
        } catch (NoResultException | UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/rejectaffiliation/{toUserId}/{fromUserId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response rejectAffiliation(@PathParam("toUserId") Long toUserId, @PathParam("fromUserId") Long fromUserId) {
        try {
            userSessionBeanLocal.rejectAffiliationRequest(toUserId, fromUserId);
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
    @Path("/addSDGs/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response addSDGsToProfile(@PathParam("userId") Long userId, List<TagEntity> tags) {
        try {
            List<TagEntity> updatedSDGs = userSessionBeanLocal.addSDGsToProfile(userId, tags);
            return Response.status(200).entity(updatedSDGs).build();
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
            List<TagEntity> updatedSDGs = userSessionBeanLocal.removeSDGFromProfile(userId, tagId);
            return Response.status(200).entity(updatedSDGs).build();
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

            user.getReviewsGiven().clear();
            user.getReviewsReceived().clear();
            user.getProjectsOwned().clear();
            user.getProjectsManaged().clear();
            user.getGroupsManaged().clear();
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
            user.getAffiliationRequestMade().clear();
            user.getAffiliationRequestReceived().clear();
            user.getAffiliatedUsers().clear();
            user.getHrpApplied().clear();
            user.getFulfillments().clear();
            user.setPassword("");
            user.getActivityJoined().clear();
            user.getDonations().clear();
            for (HumanResourcePostingEntity hrp : user.getHrpApplied()) {
                hrp.setActivity(null);
                hrp.getAppliedUsers().clear();
                if (hrp.getProject() != null) {
                    hrp.getProject().setProjectOwner(null);
                    hrp.getProject().getProjectMembers().clear();
                    hrp.getProject().getProjectAdmins().clear();
                    hrp.getProject().getActivities().clear();
                    hrp.getProject().getHumanResourcePostings().clear();
                    hrp.getProject().getMaterialResourcePostings().clear();
                    hrp.getProject().getTasks().clear();
                    hrp.getProject().getPosts().clear();
                    hrp.getProject().getSdgs().clear();
                }
            }
            List<ProjectEntity> projects = new ArrayList<ProjectEntity>();
            for (int i = 0; i < user.getProjectsJoined().size(); i++) {
                ProjectEntity project = new ProjectEntity();
                project.setProjectId(user.getProjectsJoined().get(i).getProjectId());
                project.setName(user.getProjectsJoined().get(i).getName());
                projects.add(project);
            }
            user.setProjectsJoined(projects);
            user.getActivityJoined().clear();
            user.getDonations().clear();
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
            user.getProjectsManaged().clear();
            user.getGroupsManaged().clear();
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
            user.getAffiliationRequestMade().clear();
            user.getAffiliationRequestReceived().clear();
            user.getAffiliatedUsers().clear();
            user.getHrpApplied().clear();
            user.getFulfillments().clear();
            user.setPassword("");
            user.getActivityJoined().clear();
            user.getDonations().clear();

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
            System.out.println("reached update user");
            UserEntity user = userSessionBeanLocal.updateUser(updatedUser);

            System.out.println("got user");
            UserEntity userResponse = new UserEntity();
            userResponse.setFirstName(user.getFirstName());
            userResponse.setLastName(user.getLastName());
            userResponse.setGender(user.getGender());
            userResponse.setIsActive(user.getIsActive());
            userResponse.setDob(user.getDob());
            userResponse.setJoinedDate(user.getJoinedDate());
            userResponse.setAdminStartDate(user.getAdminStartDate());
            userResponse.setEmail(user.getEmail());
            userResponse.setProfilePicture(user.getProfilePicture());
            userResponse.setSdgs(user.getSdgs());
            userResponse.setAccountPrivacySetting(user.getAccountPrivacySetting());
            System.out.println("userResponse: " + userResponse);
            return Response.status(200).entity(userResponse).build();

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
            List<ProjectEntity> projects = new ArrayList<ProjectEntity>();
            for (int i = 0; i < user.getProjectsJoined().size(); i++) {
                ProjectEntity project = new ProjectEntity();
                project.setProjectId(user.getProjectsJoined().get(i).getProjectId());
                project.setName(user.getProjectsJoined().get(i).getName());
                projects.add(project);
            }
            temp.setProjectsJoined(projects);
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
            for (HumanResourcePostingEntity hrp : user.getHrpApplied()) {
                hrp.setActivity(null);
                hrp.setProject(null);
                hrp.getAppliedUsers().clear();
            }
            temp.setHrpApplied(user.getHrpApplied());
            usersResponse.add(temp);
        }
        return usersResponse;
    }

    private List<UserEntity> getUsersResponseWithAffiliatedIndividualsOrInstitutes(List<UserEntity> users) {
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
            temp.setAffiliatedUsers(getUsersResponse(user.getAffiliatedUsers()));
            temp.setFollowRequestReceived(getFollowRequestsResponse(user.getFollowRequestReceived()));
            temp.setFollowRequestMade(getFollowRequestsResponse(user.getFollowRequestMade()));
            // temp.setHrpApplied(user.getHrpApplied());
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

    private List<AffiliationRequestEntity> getAffiliationRequestsResponse(List<AffiliationRequestEntity> affiliationRequests) {
        List<AffiliationRequestEntity> affiliationRequestsResponse = new ArrayList<>();
        for (AffiliationRequestEntity affiliationRequestEntity : affiliationRequests) {
            UserEntity to = new UserEntity();
            to.setUserId(affiliationRequestEntity.getTo().getUserId());
            to.setFirstName(affiliationRequestEntity.getTo().getFirstName());
            to.setLastName(affiliationRequestEntity.getTo().getLastName());
            to.setProfilePicture(affiliationRequestEntity.getTo().getProfilePicture());
            UserEntity from = new UserEntity();
            from.setUserId(affiliationRequestEntity.getFrom().getUserId());
            from.setFirstName(affiliationRequestEntity.getFrom().getFirstName());
            from.setLastName(affiliationRequestEntity.getFrom().getLastName());
            from.setProfilePicture(affiliationRequestEntity.getFrom().getProfilePicture());
            AffiliationRequestEntity temp = new AffiliationRequestEntity();
            temp.setId(affiliationRequestEntity.getId());
            temp.setTo(to);
            temp.setFrom(from);
            affiliationRequestsResponse.add(temp);
        }
        return affiliationRequestsResponse;
    }

    private AffiliationRequestEntity getAffiliationRequestResponse(AffiliationRequestEntity affiliationRequestEntity) {
        UserEntity to = new UserEntity();
        to.setUserId(affiliationRequestEntity.getTo().getUserId());
        to.setFirstName(affiliationRequestEntity.getTo().getFirstName());
        to.setLastName(affiliationRequestEntity.getTo().getLastName());
        to.setProfilePicture(affiliationRequestEntity.getTo().getProfilePicture());
        UserEntity from = new UserEntity();
        from.setUserId(affiliationRequestEntity.getFrom().getUserId());
        from.setFirstName(affiliationRequestEntity.getFrom().getFirstName());
        from.setLastName(affiliationRequestEntity.getFrom().getLastName());
        from.setProfilePicture(affiliationRequestEntity.getFrom().getProfilePicture());
        AffiliationRequestEntity temp = new AffiliationRequestEntity();
        temp.setId(affiliationRequestEntity.getId());
        temp.setTo(to);
        temp.setFrom(from);

        return temp;
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

    @GET
    @Path("/writtenreviews/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWrittenReviews(@PathParam("userId") Long userId) {
        try {
            List<ReviewEntity> reviews = userSessionBeanLocal.getUserWrittenReviews(userId);
            List<ReviewEntity> reviewsWrittenResponse = getWrittenReviewsResponse(reviews);
            System.out.println(reviewsWrittenResponse);
            return Response.status(200).entity(reviewsWrittenResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private List<ReviewEntity> getWrittenReviewsResponse(List<ReviewEntity> reviews) {
        List<ReviewEntity> writtenReviewsResponse = new ArrayList<>();
        ReviewEntity temp = new ReviewEntity();
        for (ReviewEntity reviewEntity : reviews) {
            UserEntity to = new UserEntity();
            if (reviewEntity.getTo() != null) {
                to.setUserId(reviewEntity.getTo().getUserId());
                to.setFirstName(reviewEntity.getTo().getFirstName());
                to.setLastName(reviewEntity.getTo().getLastName());
                to.setProfilePicture(reviewEntity.getTo().getProfilePicture());
                temp.setTo(to);
            }
            UserEntity from = new UserEntity();
            from.setUserId(reviewEntity.getFrom().getUserId());
            from.setFirstName(reviewEntity.getFrom().getFirstName());
            from.setLastName(reviewEntity.getFrom().getLastName());
            from.setProfilePicture(reviewEntity.getFrom().getProfilePicture());
            ProjectEntity project = new ProjectEntity();
            project.setProjectId(reviewEntity.getProject().getProjectId());
            project.setName(reviewEntity.getProject().getName());
            temp.setReviewId(reviewEntity.getReviewId());
            temp.setTitle(reviewEntity.getTitle());
            temp.setReviewField(reviewEntity.getReviewField());
            temp.setRating(reviewEntity.getRating());
            temp.setFrom(from);
            temp.setProject(project);
            writtenReviewsResponse.add(temp);
        }
        return writtenReviewsResponse;
    }

    @GET
    @Path("/receivedreviews/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRecievedReviews(@PathParam("userId") Long userId) {
        try {
            List<ReviewEntity> reviews = userSessionBeanLocal.getUserRecievedReviews(userId);
            List<ReviewEntity> reviewsRecievedResponse = getRecievedReviewsResponse(reviews);
            System.out.println(reviewsRecievedResponse);
            return Response.status(200).entity(reviewsRecievedResponse).build();
        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private List<ReviewEntity> getRecievedReviewsResponse(List<ReviewEntity> reviews) {
        List<ReviewEntity> recievedReviewsResponse = new ArrayList<>();
        for (ReviewEntity reviewEntity : reviews) {
            UserEntity to = new UserEntity();
            to.setUserId(reviewEntity.getTo().getUserId());
            to.setFirstName(reviewEntity.getTo().getFirstName());
            to.setLastName(reviewEntity.getTo().getLastName());
            to.setProfilePicture(reviewEntity.getTo().getProfilePicture());
            UserEntity from = new UserEntity();
            from.setUserId(reviewEntity.getFrom().getUserId());
            from.setFirstName(reviewEntity.getFrom().getFirstName());
            from.setLastName(reviewEntity.getFrom().getLastName());
            from.setProfilePicture(reviewEntity.getFrom().getProfilePicture());
            ReviewEntity temp = new ReviewEntity();
            ProjectEntity project = new ProjectEntity();
            project.setProjectId(reviewEntity.getProject().getProjectId());
            project.setName(reviewEntity.getProject().getName());
            temp.setReviewId(reviewEntity.getReviewId());
            temp.setTitle(reviewEntity.getTitle());
            temp.setReviewField(reviewEntity.getReviewField());
            temp.setRating(reviewEntity.getRating());
            temp.setTo(to);
            temp.setFrom(from);
            temp.setProject(project);
            recievedReviewsResponse.add(temp);
        }
        return recievedReviewsResponse;
    }

    @POST
    @Path("/editReview")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editReview(editReviewReq edit) {
        try {
            Long reviewId = userSessionBeanLocal.editReview(edit.getReviewId(), edit.getTitle(), edit.getMessage(), edit.getRating());
            editReviewRsp editReviewRsp = new editReviewRsp(reviewId);
            return Response.status(200).entity(editReviewRsp).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
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

    @Path("/projectsOwned/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectsOwned(@PathParam("userId") Long userId) {
        System.out.println("******** UserResource: getProjectsOwned()");
        try {
            List<ProjectEntity> projectsOwned = userSessionBeanLocal.getProjectsOwned(userId);
            for (ProjectEntity p : projectsOwned) {
                p.setProjectOwner(null);
                p.getProjectMembers().clear();
                p.getProjectAdmins().clear();
                p.getActivities().clear();
                p.getHumanResourcePostings().clear();
                p.getMaterialResourcePostings().clear();
                p.getTasks().clear();
                p.getPosts().clear();
                p.getReviews().clear();
                p.getDonations().clear();
            }
            return Response.status(Status.OK).entity(projectsOwned).build();

        } catch (UserNotFoundException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("/viewOwnProjects/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectsJoined(@PathParam("userId") Long userId) {
        System.out.println("******** UserResource: getProjectsJoined()");
        try {
            List<ProjectEntity> projectsJoined = userSessionBeanLocal.getProjectsJoined(userId);
            for (ProjectEntity p : projectsJoined) {
                p.setProjectOwner(null);
                p.getProjectMembers().clear();
                p.getProjectAdmins().clear();
                p.getActivities().clear();
                p.getHumanResourcePostings().clear();
                p.getMaterialResourcePostings().clear();
                p.getTasks().clear();
                p.getPosts().clear();
                p.getReviews().clear();
                p.getDonations().clear();
            }
            return Response.status(Status.OK).entity(projectsJoined).build();

        } catch (UserNotFoundException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("/projectsManaged/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectsManaged(@PathParam("userId") Long userId) {
        System.out.println("******** UserResource: getProjectsManaged()");
        try {
            List<ProjectEntity> projectsManaged = userSessionBeanLocal.getProjectsManaged(userId);
            for (ProjectEntity p : projectsManaged) {
                p.setProjectOwner(null);
                p.getProjectMembers().clear();
                p.getProjectAdmins().clear();
                p.getActivities().clear();
                p.getHumanResourcePostings().clear();
                p.getMaterialResourcePostings().clear();
                p.getTasks().clear();
                p.getPosts().clear();
                p.getReviews().clear();
                p.getDonations().clear();
            }
            return Response.status(Status.OK).entity(projectsManaged).build();

        } catch (UserNotFoundException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("/groupsOwned/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroupsOwned(@PathParam("userId") Long userId) {
        System.out.println("******** UserResource: getGroupsOwned()");
        try {
            List<GroupEntity> groupsOwned = userSessionBeanLocal.getGroupsOwned(userId);
            for (GroupEntity g : groupsOwned) {
                g.setGroupOwner(null);
                g.getGroupMembers().clear();
                g.getGroupAdmins().clear();
                //g.getPosts().clear();
            }
            return Response.status(Status.OK).entity(groupsOwned).build();

        } catch (UserNotFoundException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("/viewOwnGroups/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroupsJoined(@PathParam("userId") Long userId) {
        System.out.println("******** UserResource: getGroupsJoined()");
        try {
            List<GroupEntity> groupsJoined = userSessionBeanLocal.getGroupsJoined(userId);
            for (GroupEntity g : groupsJoined) {
                g.setGroupOwner(null);
                g.getGroupMembers().clear();
                g.getGroupAdmins().clear();
                //g.getPosts().clear();
            }
            return Response.status(Status.OK).entity(groupsJoined).build();

        } catch (UserNotFoundException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("/groupsManaged/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroupsManaged(@PathParam("userId") Long userId) {
        System.out.println("******** UserResource: getProjectsManaged()");
        try {
            List<GroupEntity> groupsManaged = userSessionBeanLocal.getGroupsManaged(userId);
            for (GroupEntity g : groupsManaged) {
                g.setGroupOwner(null);
                g.getGroupMembers().clear();
                g.getGroupAdmins().clear();
                //g.getPosts().clear();
            }
            return Response.status(Status.OK).entity(groupsManaged).build();

        } catch (UserNotFoundException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    public void persist(Object object) {
        /* Add this to the deployment descriptor of this module (e.g. web.xml, ejb-jar.xml):
         * <persistence-context-ref>
         * <persistence-context-ref-name>persistence/LogicalName</persistence-context-ref-name>
         * <persistence-unit-name>KMS-warPU</persistence-unit-name>
         * </persistence-context-ref>
         * <resource-ref>
         * <res-ref-name>UserTransaction</res-ref-name>
         * <res-type>javax.transaction.UserTransaction</res-type>
         * <res-auth>Container</res-auth>
         * </resource-ref> */
        try {
            javax.naming.Context ctx = new InitialContext();
            UserTransaction utx = (UserTransaction) ctx.lookup("java:comp/env/UserTransaction");
            utx.begin();
            EntityManager em = (EntityManager) ctx.lookup("java:comp/env/persistence/LogicalName");
            em.persist(object);
            utx.commit();
        } catch (Exception e) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", e);
            throw new RuntimeException(e);
        }
    }

}
