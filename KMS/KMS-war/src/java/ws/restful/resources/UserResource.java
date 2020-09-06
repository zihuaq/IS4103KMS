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
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.UserTransaction;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author cassie
 */
@Path("user")
public class UserResource {

    @Context
    private UriInfo context;
    
    @PersistenceContext (unitName = "KMS-warPU")
    private EntityManager em;

    /**
     * Creates a new instance of UserResource
     */
    public UserResource() {
    }

    @PUT
    @Path("/addskill/{userId}/{tagId}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addSkillToProfile (@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
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
    public Response removeSkillFromProfile (@PathParam("userId") Long userId, @PathParam("tagId") Long tagId) {
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
}
