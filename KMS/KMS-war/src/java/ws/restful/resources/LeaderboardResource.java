/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.UserNotFoundException;
import ejb.session.stateless.LeaderboardSessionBeanLocal;
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
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * REST Web Service
 *
 * @author Jeremy
 */
@Path("leaderboard")
public class LeaderboardResource {

    LeaderboardSessionBeanLocal leaderboardSessionBean = lookupLeaderboardSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of LeaderboardResource
     */
    public LeaderboardResource() {
    }

    @Path("reputationPointLeaderboard")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReputationPointLeaderboard() {
        List<UserEntity> leaderboard = leaderboardSessionBean.getReputationPointLeaderboard();
        for (UserEntity user : leaderboard) {
            user.setReviewsGiven(new ArrayList<>());
            user.setReviewsReceived(new ArrayList<>());
            user.setProjectsOwned(new ArrayList<>());
            user.setProjectsManaged(new ArrayList<>());
            user.setGroupsManaged(new ArrayList<>());
            user.setPosts(new ArrayList<>());
            user.setGroupsOwned(new ArrayList<>());
            user.setGroupAdmins(new ArrayList<>());
            user.setBadges(new ArrayList<>());
            user.setMras(new ArrayList<>());
            user.setSkills(new ArrayList<>());
            user.setFollowing(new ArrayList<>());
            user.setFollowers(new ArrayList<>());
            user.setSdgs(new ArrayList<>());
            user.setFollowRequestMade(new ArrayList<>());
            user.setFollowRequestReceived(new ArrayList<>());
            user.setAffiliatedUsers(new ArrayList<>());
            user.setAffiliationRequestMade(new ArrayList<>());
            user.setAffiliationRequestReceived(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setFulfillments(new ArrayList<>());
            user.setActivityJoined(new ArrayList<>());
            user.setDonations(new ArrayList<>());
            user.setNotifications(new ArrayList<>());
            user.setReceivedAwards(new ArrayList<>());
            user.setClaimProfileRequestMade(new ArrayList<>());
            user.setProfiles(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setProjectsJoined(new ArrayList<>());
            user.setGroupsJoined(new ArrayList<>());
            user.setPassword("");
        }

        return Response.status(Status.OK).entity(leaderboard).build();
    }

    @Path("getReputationPointLeaderboardForFollowing/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReputationPointLeaderboardForFollowing(@PathParam("userId") Long userId) {
        try {
            List<UserEntity> leaderboard = leaderboardSessionBean.getReputationPointLeaderboardForFollowing(userId);
            for (UserEntity user : leaderboard) {
                user.setReviewsGiven(new ArrayList<>());
                user.setReviewsReceived(new ArrayList<>());
                user.setProjectsOwned(new ArrayList<>());
                user.setProjectsManaged(new ArrayList<>());
                user.setGroupsManaged(new ArrayList<>());
                user.setPosts(new ArrayList<>());
                user.setGroupsOwned(new ArrayList<>());
                user.setGroupAdmins(new ArrayList<>());
                user.setBadges(new ArrayList<>());
                user.setMras(new ArrayList<>());
                user.setSkills(new ArrayList<>());
                user.setFollowing(new ArrayList<>());
                user.setFollowers(new ArrayList<>());
                user.setSdgs(new ArrayList<>());
                user.setFollowRequestMade(new ArrayList<>());
                user.setFollowRequestReceived(new ArrayList<>());
                user.setAffiliatedUsers(new ArrayList<>());
                user.setAffiliationRequestMade(new ArrayList<>());
                user.setAffiliationRequestReceived(new ArrayList<>());
                user.setHrpApplied(new ArrayList<>());
                user.setFulfillments(new ArrayList<>());
                user.setActivityJoined(new ArrayList<>());
                user.setDonations(new ArrayList<>());
                user.setNotifications(new ArrayList<>());
                user.setReceivedAwards(new ArrayList<>());
                user.setClaimProfileRequestMade(new ArrayList<>());
                user.setProfiles(new ArrayList<>());
                user.setHrpApplied(new ArrayList<>());
                user.setProjectsJoined(new ArrayList<>());
                user.setGroupsJoined(new ArrayList<>());
                user.setPassword("");
            }
            return Response.status(Status.OK).entity(leaderboard).build();

        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(400).entity(exception).build();
        }
    }

    @Path("allTimeDonationAmountLeaderboard")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTimeDonationAmountLeaderboard() {
        List<UserEntity> leaderboard = leaderboardSessionBean.getAllTimeDonationAmountLeaderboard();
        for (UserEntity user : leaderboard) {
            user.setReviewsGiven(new ArrayList<>());
            user.setReviewsReceived(new ArrayList<>());
            user.setProjectsOwned(new ArrayList<>());
            user.setProjectsManaged(new ArrayList<>());
            user.setGroupsManaged(new ArrayList<>());
            user.setPosts(new ArrayList<>());
            user.setGroupsOwned(new ArrayList<>());
            user.setGroupAdmins(new ArrayList<>());
            user.setBadges(new ArrayList<>());
            user.setMras(new ArrayList<>());
            user.setSkills(new ArrayList<>());
            user.setFollowing(new ArrayList<>());
            user.setFollowers(new ArrayList<>());
            user.setSdgs(new ArrayList<>());
            user.setFollowRequestMade(new ArrayList<>());
            user.setFollowRequestReceived(new ArrayList<>());
            user.setAffiliatedUsers(new ArrayList<>());
            user.setAffiliationRequestMade(new ArrayList<>());
            user.setAffiliationRequestReceived(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setFulfillments(new ArrayList<>());
            user.setActivityJoined(new ArrayList<>());
            user.setDonations(new ArrayList<>());
            user.setNotifications(new ArrayList<>());
            user.setReceivedAwards(new ArrayList<>());
            user.setClaimProfileRequestMade(new ArrayList<>());
            user.setProfiles(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setProjectsJoined(new ArrayList<>());
            user.setGroupsJoined(new ArrayList<>());
            user.setPassword("");
        }

        return Response.status(Status.OK).entity(leaderboard).build();
    }

    @Path("weeklyDonationAmountLeaderboard")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWeeklyDonationAmountLeaderboard() {
        List<UserEntity> leaderboard = leaderboardSessionBean.getWeeklyDonationAmountLeaderboard();
        for (UserEntity user : leaderboard) {
            user.setReviewsGiven(new ArrayList<>());
            user.setReviewsReceived(new ArrayList<>());
            user.setProjectsOwned(new ArrayList<>());
            user.setProjectsManaged(new ArrayList<>());
            user.setGroupsManaged(new ArrayList<>());
            user.setPosts(new ArrayList<>());
            user.setGroupsOwned(new ArrayList<>());
            user.setGroupAdmins(new ArrayList<>());
            user.setBadges(new ArrayList<>());
            user.setMras(new ArrayList<>());
            user.setSkills(new ArrayList<>());
            user.setFollowing(new ArrayList<>());
            user.setFollowers(new ArrayList<>());
            user.setSdgs(new ArrayList<>());
            user.setFollowRequestMade(new ArrayList<>());
            user.setFollowRequestReceived(new ArrayList<>());
            user.setAffiliatedUsers(new ArrayList<>());
            user.setAffiliationRequestMade(new ArrayList<>());
            user.setAffiliationRequestReceived(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setFulfillments(new ArrayList<>());
            user.setActivityJoined(new ArrayList<>());
            user.setDonations(new ArrayList<>());
            user.setNotifications(new ArrayList<>());
            user.setReceivedAwards(new ArrayList<>());
            user.setClaimProfileRequestMade(new ArrayList<>());
            user.setProfiles(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setProjectsJoined(new ArrayList<>());
            user.setGroupsJoined(new ArrayList<>());
            user.setPassword("");
        }

        return Response.status(Status.OK).entity(leaderboard).build();
    }

    @Path("getWeeklyDonationAmountLeaderboardForFollowing/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWeeklyDonationAmountLeaderboardForFollowing(@PathParam("userId") Long userId) {
        try {
            List<UserEntity> leaderboard = leaderboardSessionBean.getWeeklyDonationAmountLeaderboardForFollowing(userId);
            for (UserEntity user : leaderboard) {
                user.setReviewsGiven(new ArrayList<>());
                user.setReviewsReceived(new ArrayList<>());
                user.setProjectsOwned(new ArrayList<>());
                user.setProjectsManaged(new ArrayList<>());
                user.setGroupsManaged(new ArrayList<>());
                user.setPosts(new ArrayList<>());
                user.setGroupsOwned(new ArrayList<>());
                user.setGroupAdmins(new ArrayList<>());
                user.setBadges(new ArrayList<>());
                user.setMras(new ArrayList<>());
                user.setSkills(new ArrayList<>());
                user.setFollowing(new ArrayList<>());
                user.setFollowers(new ArrayList<>());
                user.setSdgs(new ArrayList<>());
                user.setFollowRequestMade(new ArrayList<>());
                user.setFollowRequestReceived(new ArrayList<>());
                user.setAffiliatedUsers(new ArrayList<>());
                user.setAffiliationRequestMade(new ArrayList<>());
                user.setAffiliationRequestReceived(new ArrayList<>());
                user.setHrpApplied(new ArrayList<>());
                user.setFulfillments(new ArrayList<>());
                user.setActivityJoined(new ArrayList<>());
                user.setDonations(new ArrayList<>());
                user.setNotifications(new ArrayList<>());
                user.setReceivedAwards(new ArrayList<>());
                user.setClaimProfileRequestMade(new ArrayList<>());
                user.setProfiles(new ArrayList<>());
                user.setHrpApplied(new ArrayList<>());
                user.setProjectsJoined(new ArrayList<>());
                user.setGroupsJoined(new ArrayList<>());
                user.setPassword("");
            }
            return Response.status(Status.OK).entity(leaderboard).build();

        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(400).entity(exception).build();
        }
    }

    @Path("projectLeaderboard")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectLeaderboard() {
        List<UserEntity> leaderboard = leaderboardSessionBean.getProjectLeaderboard();
        for (UserEntity user : leaderboard) {
            user.setReviewsGiven(new ArrayList<>());
            user.setReviewsReceived(new ArrayList<>());
            user.setProjectsOwned(new ArrayList<>());
            user.setProjectsManaged(new ArrayList<>());
            user.setGroupsManaged(new ArrayList<>());
            user.setPosts(new ArrayList<>());
            user.setGroupsOwned(new ArrayList<>());
            user.setGroupAdmins(new ArrayList<>());
            user.setBadges(new ArrayList<>());
            user.setMras(new ArrayList<>());
            user.setSkills(new ArrayList<>());
            user.setFollowing(new ArrayList<>());
            user.setFollowers(new ArrayList<>());
            user.setSdgs(new ArrayList<>());
            user.setFollowRequestMade(new ArrayList<>());
            user.setFollowRequestReceived(new ArrayList<>());
            user.setAffiliatedUsers(new ArrayList<>());
            user.setAffiliationRequestMade(new ArrayList<>());
            user.setAffiliationRequestReceived(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setFulfillments(new ArrayList<>());
            user.setActivityJoined(new ArrayList<>());
            user.setDonations(new ArrayList<>());
            user.setNotifications(new ArrayList<>());
            user.setReceivedAwards(new ArrayList<>());
            user.setClaimProfileRequestMade(new ArrayList<>());
            user.setProfiles(new ArrayList<>());
            user.setHrpApplied(new ArrayList<>());
            user.setProjectsJoined(new ArrayList<>());
            user.setGroupsJoined(new ArrayList<>());
            user.setPassword("");
        }

        return Response.status(Status.OK).entity(leaderboard).build();
    }

    @Path("getProjectLeaderboardForFollowing/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectLeaderboardForFollowing(@PathParam("userId") Long userId) {
        try {
            List<UserEntity> leaderboard = leaderboardSessionBean.getProjectLeaderboardForFollowing(userId);
            for (UserEntity user : leaderboard) {
                user.setReviewsGiven(new ArrayList<>());
                user.setReviewsReceived(new ArrayList<>());
                user.setProjectsOwned(new ArrayList<>());
                user.setProjectsManaged(new ArrayList<>());
                user.setGroupsManaged(new ArrayList<>());
                user.setPosts(new ArrayList<>());
                user.setGroupsOwned(new ArrayList<>());
                user.setGroupAdmins(new ArrayList<>());
                user.setBadges(new ArrayList<>());
                user.setMras(new ArrayList<>());
                user.setSkills(new ArrayList<>());
                user.setFollowing(new ArrayList<>());
                user.setFollowers(new ArrayList<>());
                user.setSdgs(new ArrayList<>());
                user.setFollowRequestMade(new ArrayList<>());
                user.setFollowRequestReceived(new ArrayList<>());
                user.setAffiliatedUsers(new ArrayList<>());
                user.setAffiliationRequestMade(new ArrayList<>());
                user.setAffiliationRequestReceived(new ArrayList<>());
                user.setHrpApplied(new ArrayList<>());
                user.setFulfillments(new ArrayList<>());
                user.setActivityJoined(new ArrayList<>());
                user.setDonations(new ArrayList<>());
                user.setNotifications(new ArrayList<>());
                user.setReceivedAwards(new ArrayList<>());
                user.setClaimProfileRequestMade(new ArrayList<>());
                user.setProfiles(new ArrayList<>());
                user.setHrpApplied(new ArrayList<>());
                user.setProjectsJoined(new ArrayList<>());
                user.setGroupsJoined(new ArrayList<>());
                user.setPassword("");
            }
            return Response.status(Status.OK).entity(leaderboard).build();

        } catch (UserNotFoundException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(400).entity(exception).build();
        }
    }

    private LeaderboardSessionBeanLocal lookupLeaderboardSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (LeaderboardSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/LeaderboardSessionBean!ejb.session.stateless.LeaderboardSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

}
