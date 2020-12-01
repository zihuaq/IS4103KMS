/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.DataMappingSessionBeanLocal;
import entity.ClaimProfileRequestEntity;
import entity.ProfileEntity;
import entity.UserEntity;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import ws.restful.model.UploadProfilesReq;

/**
 * REST Web Service
 *
 * @author Jeremy
 */
@Path("profile")
public class ProfileResource {

    DataMappingSessionBeanLocal dataMappingSessionBean = lookupDataMappingSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ProfileResource
     */
    public ProfileResource() {
    }

    private DataMappingSessionBeanLocal lookupDataMappingSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (DataMappingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/DataMappingSessionBean!ejb.session.stateless.DataMappingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProfiles() {
        List<ProfileEntity> profiles = dataMappingSessionBean.getAllProfiles();
        for (ProfileEntity profileEntity : profiles) {
            profileEntity.setClaimProfileRequestMade(new ArrayList<>());
            profileEntity.setUserEntity(null);
        }
        return Response.status(200).entity(profiles).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProfile(@PathParam("id") Long id) {
        try {
            ProfileEntity profileEntity = dataMappingSessionBean.getProfile(id);
            List<ClaimProfileRequestEntity> claimProfileRequestEntitys = profileEntity.getClaimProfileRequestMade();
            List<ClaimProfileRequestEntity> temp = new ArrayList<>();
            for (ClaimProfileRequestEntity claimProfileRequestEntity : claimProfileRequestEntitys) {
                ClaimProfileRequestEntity claimProfileRequestEntity1 = new ClaimProfileRequestEntity();
                UserEntity userEntity = new UserEntity();
                userEntity.setUserId(claimProfileRequestEntity.getUser().getUserId());
                claimProfileRequestEntity1.setUser(userEntity);
                temp.add(claimProfileRequestEntity1);
            }
            profileEntity.setClaimProfileRequestMade(temp);
            if (profileEntity.getUserEntity() != null) {
                UserEntity userEntity = new UserEntity();
                userEntity.setUserId(profileEntity.getUserEntity().getUserId());
                profileEntity.setUserEntity(userEntity);
            }
            return Response.status(200).entity(profileEntity).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/claim/{userId}/{profileId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response makeProfileClaim(@PathParam("userId") Long userId, @PathParam("profileId") Long profileId) {
        try {
            dataMappingSessionBean.makeProfileClaim(userId, profileId);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/claims")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProfileClaims() {
        List<ClaimProfileRequestEntity> claimProfileRequestEntitys = dataMappingSessionBean.getAllProfileClaims();
        for (ClaimProfileRequestEntity claimProfileRequestEntity : claimProfileRequestEntitys) {
            claimProfileRequestEntity.getProfile().setClaimProfileRequestMade(new ArrayList<>());
            claimProfileRequestEntity.getProfile().setUserEntity(null);
            UserEntity user = new UserEntity();
            user.setUserId(claimProfileRequestEntity.getUser().getUserId());
            user.setFirstName(claimProfileRequestEntity.getUser().getFirstName());
            user.setLastName(claimProfileRequestEntity.getUser().getLastName());
            claimProfileRequestEntity.setUser(user);
        }
        return Response.status(200).entity(claimProfileRequestEntitys).build();
    }

    @POST
    @Path("/settleClaim/{claimProfileRequestId}/{accept}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response settleProfileClaim(@PathParam("claimProfileRequestId") Long claimProfileRequestId, @PathParam("accept") boolean accept) {
        try {
            dataMappingSessionBean.settleProfileClaim(claimProfileRequestId, accept);
            return Response.status(204).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @POST
    @Path("/uploadProfiles")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadProfiles(UploadProfilesReq uploadProfilesReq) {
        try {
            System.out.println("filename" + uploadProfilesReq.getFile());
            dataMappingSessionBean.uploadProfiles(Base64.getDecoder().decode(uploadProfilesReq.getFile().split("base64,")[1]));
            return Response.status(204).build();
        } catch (IOException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
}
