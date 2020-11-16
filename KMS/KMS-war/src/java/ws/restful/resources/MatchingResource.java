/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.MatchingSessionBeanLocal;
import entity.MaterialResourceAvailableEntity;
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
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Cassie
 */
@Path("matching")
public class MatchingResource {

    MatchingSessionBeanLocal matchingSessionBean = lookupMatchingSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of MatchingResource
     */
    public MatchingResource() {
    }

    @GET
    @Path("/getMatchesForMrp/{mrpId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMatchesForMrp(@PathParam("mrpId") Long mrpId) {
        try {
            List<MaterialResourceAvailableEntity> mras = matchingSessionBean.getMatchesForMrp(mrpId);
            mras = getMraResponse(mras);
            return Response.status(200).entity(mras).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getMatchesForHrp/{hrpId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMatchesForHrp(@PathParam("hrpId") Long hrpId) {
        try {
            List<UserEntity> users = matchingSessionBean.getMatchesForHrp(hrpId);
            users = getUserResponse(users);
            return Response.status(200).entity(users).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private List<MaterialResourceAvailableEntity> getMraResponse(List<MaterialResourceAvailableEntity> mras) {
        for (int i = 0; i < mras.size(); i++) {
            UserEntity user = new UserEntity();
            user.setUserId(mras.get(i).getMaterialResourceAvailableOwner().getUserId());
            user.setFirstName(mras.get(i).getMaterialResourceAvailableOwner().getFirstName());
            user.setLastName(mras.get(i).getMaterialResourceAvailableOwner().getLastName());
            mras.get(i).setMaterialResourceAvailableOwner(user);
        }
        return mras;
    }

    private List<UserEntity> getUserResponse(List<UserEntity> users) {
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
            temp.setReputationPoints(user.getReputationPoints());
            usersResponse.add(temp);
        }
        return usersResponse;
    }

    private MatchingSessionBeanLocal lookupMatchingSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (MatchingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/MatchingSessionBean!ejb.session.stateless.MatchingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
