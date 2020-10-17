/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.LinkSessionBeanLocal;
import entity.LinkEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author zihua
 */
@Path("link")
public class LinkResource {

    LinkSessionBeanLocal linkSessionBeanLocal = lookupLinkSessionBeanLocal1();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of LinkResource
     */
    public LinkResource() {
    }
    
    @Path("getLinksByProject/{projectId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLinksByProject(@PathParam("projectId") Long projectId) {
        System.out.println("******** LinkResource: getLinksByProject()");
        
        List<LinkEntity> links = linkSessionBeanLocal.getLinksByProject(projectId);
        
        for (LinkEntity link: links) {
            link.setSourceTask(null);
            link.setTargetTask(null);
        }
        
        return Response.status(Response.Status.OK).entity(links).build();
    }
    
    @Path("createNewLink")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewLink(LinkEntity newLink) {
        System.out.println("******** LinkResource: createNewLink()");
        
        if (newLink != null) {
            try {
                Long linkId = linkSessionBeanLocal.createNewLink(newLink);
                
                return Response.status(Response.Status.OK).entity(linkId).build();
                
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }
            
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }
    
    @Path("deleteLink/{linkId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteLink(@PathParam("linkId") Long linkId) {
        System.out.println("******** LinkResource: deleteLink()");
        try {
            linkSessionBeanLocal.deleteLink(linkId);

            return Response.status(Response.Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private LinkSessionBeanLocal lookupLinkSessionBeanLocal1() {
        try {
            javax.naming.Context c = new InitialContext();
            return (LinkSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/LinkSessionBean!ejb.session.stateless.LinkSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    
}
