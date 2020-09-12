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
import ejb.session.stateless.MaterialResourceAvailableSessionBeanLocal;
import ejb.session.stateless.TagSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.MaterialResourceAvailableEntity;
import entity.UserEntity;
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
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/removeskill/{userId}/{tagId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeSkillFromProfile(@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
        try {
            userSessionBeanLocal.removeSkillFromProfile(userId, tagId);
            return Response.status(204).build();
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
        } catch (DuplicateEmailException ex) {
            return Response.status(Response.Status.BAD_REQUEST).entity(ex.getMessage()).build();
        }
        return Response.status(Response.Status.OK).entity(newUser).build();
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
    
    
    @Path("userLogin")
    @GET
    @Consumes(MediaType.TEXT_PLAIN)
    @Produces(MediaType.APPLICATION_JSON)
    public Response userLogin(@QueryParam("email") String email, @QueryParam("password") String password) {
        try{
            UserEntity user = this.userSessionBeanLocal.userLogin(email, password);
            System.out.println("here");
            user.getGroups().clear();
            user.getGroupsOwned().clear();
            user.getPosts().clear();
            user.getProjects().clear();
            user.getReviews().clear();
            user.getSdgs().clear();
            user.getSkills().clear();
            user.getBadges().clear();
            user.getFollowers().clear();
            user.getFollowing().clear();
            System.out.println("here");
            return Response.status(Response.Status.OK).entity(user).build();
        }
        catch(InvalidLoginCredentialException ex){
             return Response.status(Response.Status.UNAUTHORIZED).entity(ex.getMessage()).build();
        }
        catch(StackOverflowError ex){
             return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
        }
        catch(Exception ex){
             return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(ex.getMessage()).build();
        }
        
        
    }
    

}
