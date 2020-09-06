/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import entity.Tag;
import entity.User;
import java.util.List;
import javax.json.Json;
import javax.json.JsonObject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
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

        if (user != null && tag != null) {
            List<Tag> skills = user.getSkills();
            skills.add(tag);
            user.setSkills(skills);
            return Response.status(200).entity(skills).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No user or tag found.")
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

        if (user != null && tag != null) {
            List<Tag> skills = user.getSkills();
            skills.remove(tag);
            user.setSkills(skills);
            return Response.status(200).entity(skills).build();
        } else {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", "No user or tag found.")
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
}
