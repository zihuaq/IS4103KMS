/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.TagSessionBeanLocal;
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
@Path("tag")
public class TagResource {

    TagSessionBeanLocal tagSessionBeanLocal = lookupTagSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of TagResource
     */
    public TagResource() {
    }

    @GET
    @Path("/skill")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllSkillTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllSkillTags()).build();
    }
    
    @GET
    @Path("/materialresource")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllMaterialResourceTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllMaterialResourceTags()).build();
    }
    
    @GET
    @Path("/sdg")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllSDGTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllSDGTags()).build();
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
}
