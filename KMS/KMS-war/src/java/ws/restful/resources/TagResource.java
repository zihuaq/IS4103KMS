/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import Exception.TagNameExistException;
import ejb.session.stateless.TagSessionBeanLocal;
import entity.TagEntity;
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
import ws.restful.model.ErrorRsp;

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

    @PUT
    @Path("/createNewTag")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewTag(TagEntity tag) {
        try {
            System.out.println("create new tag");
            tagSessionBeanLocal.createNewTag(tag);
            return Response.status(Response.Status.OK).build();
        } catch (TagNameExistException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
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

    @GET
    @Path("/report/profile")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProfileReportTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllProfileReportTags()).build();
    }

    @GET
    @Path("/report/group")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllGroupReportTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllGroupReportTags()).build();
    }

    @GET
    @Path("/report/project")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProjectReportTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllProjectReportTags()).build();
    }

    @GET
    @Path("/report/post")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPostReportTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllPostReportTags()).build();
    }

    @GET
    @Path("/report/review")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllReviewReportTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllReviewReportTags()).build();
    }

    @GET
    @Path("/report/comment")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllCommentReportTags() {
        return Response.status(200).entity(tagSessionBeanLocal.getAllCommentReportTags()).build();
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
