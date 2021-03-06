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
import entity.TagRequestEntity;
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
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
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

    @PUT
    @Path("/updateTag")
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTag(TagEntity tag) {
        try {
            tagSessionBeanLocal.updateTag(tag);
            return Response.status(200).build();
        } catch (NoResultException | TagNameExistException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/createTagRequest")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createTagRequest(TagRequestEntity tagRequest) {
        try {
            tagSessionBeanLocal.createTagRequest(tagRequest);
            return Response.status(Response.Status.OK).build();
        } catch (TagNameExistException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @GET
    @Path("/tagRequests")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTagRequests() {
        List<TagRequestEntity> tagRequests = tagSessionBeanLocal.getTagRequests();
        List<TagRequestEntity> tagRequestsResponse = new ArrayList<>();
        for (TagRequestEntity tagRequestEntity : tagRequests) {
            TagRequestEntity temp = new TagRequestEntity();
            UserEntity requestOwner = new UserEntity();
            requestOwner.setUserId(tagRequestEntity.getRequestOwner().getUserId());
            requestOwner.setFirstName(tagRequestEntity.getRequestOwner().getFirstName());
            requestOwner.setLastName(tagRequestEntity.getRequestOwner().getLastName());
            requestOwner.setProfilePicture(tagRequestEntity.getRequestOwner().getProfilePicture());
            temp.setRequestOwner(requestOwner);
            temp.setRequestedName(tagRequestEntity.getRequestedName());
            temp.setRequestedTagType(tagRequestEntity.getRequestedTagType());
            temp.setTagRequestId(tagRequestEntity.getTagRequestId());
            tagRequestsResponse.add(temp);
        }
        return Response.status(200).entity(tagRequestsResponse).build();
    }

    @DELETE
    @Path("/rejectTagRequest/{tagRequestId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response rejectTagRequest(@PathParam("tagRequestId") Long tagRequestId) {
        try {
            tagSessionBeanLocal.rejectTagRequest(tagRequestId);
            return Response.status(200).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @PUT
    @Path("/acceptTagRequest/{tagRequestId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response acceptTagRequest(@PathParam("tagRequestId") Long tagRequestId) {
        try {
            tagSessionBeanLocal.acceptTagRequest(tagRequestId);
            return Response.status(200).build();
        } catch (NoResultException | TagNameExistException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
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
