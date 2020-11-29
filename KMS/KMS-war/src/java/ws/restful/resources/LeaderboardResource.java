/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Jeremy
 */
@Path("leaderboard")
public class LeaderboardResource {

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
        //TODO return proper representation object
        throw new UnsupportedOperationException();
    }

    @Path("allTimeDonationAmountLeaderboard")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTimeDonationAmountLeaderboard() {
        //TODO return proper representation object
        throw new UnsupportedOperationException();
    }

    @Path("weeklyDonationAmountLeaderboard")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getWeeklyDonationAmountLeaderboard() {
        //TODO return proper representation object
        throw new UnsupportedOperationException();
    }

    @Path("projectLeaderboard")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectLeaderboard() {
        //TODO return proper representation object
        throw new UnsupportedOperationException();
    }

}
