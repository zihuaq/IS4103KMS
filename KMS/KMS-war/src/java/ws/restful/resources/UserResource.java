/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.DuplicateSkillInProfileException;
import entity.MaterialResourceAvailable;
import entity.Tag;
import entity.User;
import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceException;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.Produces;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import ws.restful.model.ErrorRsp;
import ws.restful.model.UserRegistrationReq;
import ws.restful.model.UserRegistrationRsp;

/**
 * REST Web Service
 *
 * @author cassie
 */
@Path("user")
public class UserResource {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    /**
     * Creates a new instance of UserResource
     */
    public UserResource() {
    }

    @PUT
    @Path("/addskill/{userId}/{tagId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addSkillToProfile(@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
        User user = em.find(User.class, userId);
        Tag tag = em.find(Tag.class, tagId);
        
        try {
            if (user == null || tag == null) {
                throw new NoResultException("No user or tag found.");
            }
            List<Tag> skills = user.getSkills();
            if (skills.contains(tag)) {
                throw new DuplicateSkillInProfileException("Skill is already present in user's profile");
            }
            skills.add(tag);
            user.setSkills(skills);
            return Response.status(204).build();

        } catch (NoResultException | DuplicateSkillInProfileException ex) {
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
        User user = em.find(User.class, userId);
        Tag tag = em.find(Tag.class, tagId);
        
        try {
            if (user == null || tag == null) {
                throw new NoResultException("No user or tag found.");
            }
            List<Tag> skills = user.getSkills();
            if (!skills.contains(tag)) {
                throw new NoResultException("Skill does not exist in user's profile");
            }
            skills.remove(tag);
            user.setSkills(skills);
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
    public Response createMaterialRequestAvailable(@PathParam("userId") Long userId, MaterialResourceAvailable mra) {
        try {
            User user = em.find(User.class, userId);
            if(user == null){
                throw new NoResultException("User does not exist.");
            }
            mra.setMaterialResourceAvailableOwner(user);
            em.persist(mra);
            em.flush();
            List<MaterialResourceAvailable> mras = user.getMras();
            mras.add(mra);
            user.setMras(mras);
            return Response.status(204).build();
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
        User user = em.find(User.class, userId);
        if (user != null) {
            em.detach(user);
            return Response.status(200).entity(user).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No user found.")
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    
    @Path("userRegistration")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response userRegistration(UserRegistrationReq userRegistrationReq) {
        
        System.out.println("*********** HERE1");
        User newUser = userRegistrationReq.getNewUser();
        try {
            
            if(em==null)
                System.out.println("******* em is null");
            
            em.persist(newUser);
            em.flush();
            
        } catch (PersistenceException ex) {
            if (ex.getCause() != null && ex.getCause().getClass().getName().equals("org.eclipse.persistence.exceptions.DatabaseException")) {
                if (ex.getCause().getCause() != null && ex.getCause().getCause().getClass().getName().equals("java.sql.SQLIntegrityConstraintViolationException")) {
                    ErrorRsp errorRsp = new ErrorRsp("Email already in use");
                    return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
                } else {
                    ErrorRsp errorRsp = new ErrorRsp("Unknown Persitence Error");
                    return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
                }
            }
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
        
        Long newUserId = newUser.getUserId();
        UserRegistrationRsp userRegistrationRsp = new UserRegistrationRsp(newUserId);
        return Response.status(Response.Status.OK).entity(userRegistrationRsp).build();

    }
}
