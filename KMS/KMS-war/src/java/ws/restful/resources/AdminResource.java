/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.DuplicateEmailException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.UserEntity;
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
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import util.enumeration.UserTypeEnum;
import ws.restful.model.ChangeUserStatusReq;

/**
 * REST Web Service
 *
 * @author zeplh
 */
@Path("Admin")
public class AdminResource {

    UserSessionBeanLocal userSessionBeanLocal = lookupUserSessionBeanLocal();

    
    @Context
    private UriInfo context;

    /**
     * Creates a new instance of AdminResource
     */
    public AdminResource() {
    }

    @POST
    @Path("/changeUserStatus")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeUserStatus(ChangeUserStatusReq changeUserStatusReq) {
        try {
            UserEntity adminUser = userSessionBeanLocal.retrieveUserByEmail(changeUserStatusReq.getAdminEmail());
            UserEntity user = userSessionBeanLocal.retrieveUserByEmail(changeUserStatusReq.getUserEmail());
            if(adminUser.getUserType().equals(UserTypeEnum.ADMIN)){
                user.setIsActive(changeUserStatusReq.getIsActive());
                user = userSessionBeanLocal.updateUser(user);
                user.getReviewsGiven().clear();
                user.getReviewsReceived().clear();
                user.getProjectsOwned().clear();
                user.getProjectsJoined().clear();
                user.getProjectsManaged().clear();
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
            }      
            
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

    private UserSessionBeanLocal lookupUserSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (UserSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/UserSessionBean!ejb.session.stateless.UserSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
