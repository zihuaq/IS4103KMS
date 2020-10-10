/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.MaterialResourcePostingSessionBeanLocal;
import entity.MaterialResourcePostingEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import ws.restful.model.CreateMrpReq;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author chai
 */
@Path("mrp")
public class MrpResource {

    MaterialResourcePostingSessionBeanLocal materialResourcePostingSessionBean = lookupMaterialResourcePostingSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of MrpResource
     */
    public MrpResource() {
    }
    
    @Path("getMrpByProject/{projectId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMrpByProject(@PathParam("projectId") Long projectId) {
        System.out.println("******** MrpResource: getMrpByProject()");
        List<MaterialResourcePostingEntity> mrpList = materialResourcePostingSessionBean.getListOfMaterialResourcePostingByProjectId(projectId);
        
        for (MaterialResourcePostingEntity mrp : mrpList) {
            mrp.setProject(null);
            mrp.setActivity(null);
            mrp.getFulfillments().clear();
        }
        
        return Response.status(Status.OK).entity(mrpList).build();
    }

    @Path("{mrpId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMrp(@PathParam("mrpId") Long mrpId) {
        System.out.println("******** MrpResource: getMrp()");
        try {
            MaterialResourcePostingEntity mrp = materialResourcePostingSessionBean.getMrpById(mrpId);
            
            mrp.getProject().setProjectOwner(null);
            mrp.getProject().getProjectMembers().clear();
            mrp.getProject().getProjectAdmins().clear();
            mrp.getProject().getActivities().clear();
            mrp.getProject().getHumanResourcePostings().clear();
            mrp.getProject().getMaterialResourcePostings().clear();
            mrp.getProject().getTasks().clear();
            mrp.getProject().getPosts().clear();
            mrp.getProject().getSdgs().clear();
            mrp.getProject().getReviews().clear();
            mrp.getProject().getDonations().clear();
            mrp.getFulfillments().clear();
//            mrp.getActivity().getHumanResourcePostings().clear();
//            mrp.getActivity().getMaterialResourcePostings().clear();
//            mrp.getActivity().setProject(null);
            
            return Response.status(Status.OK).entity(mrp).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("createNewMrp")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewMrp(CreateMrpReq createMrpReq) {
        System.out.println("******** MrpResource: createNewMrp()");
        if (createMrpReq != null) {
            try {
                System.out.println("Name: " + createMrpReq.getNewMrp().getName());
                Long mrpId = materialResourcePostingSessionBean.createMaterialResourcePosting(createMrpReq.getNewMrp(), createMrpReq.getProjectId(), createMrpReq.getTagIds());
                
                return Response.status(Status.OK).entity(mrpId).build();
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }
    
    @Path("updateMrp")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMrp(MaterialResourcePostingEntity mrp) {
        try { 
            System.out.println("******** MrpResource: updateMrp()");
            materialResourcePostingSessionBean.updateMaterialResourcePosting(mrp);

            return Response.status(204).build();
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("deleteMrp/{mrpId}")
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteMrp(@PathParam("mrpId") Long mrpId) {
        System.out.println("******** MrpResource: deleteMrp()");
        try {
            materialResourcePostingSessionBean.deleteMaterialResourcePosting(mrpId);

            return Response.status(204).build();
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private MaterialResourcePostingSessionBeanLocal lookupMaterialResourcePostingSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (MaterialResourcePostingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/MaterialResourcePostingSessionBean!ejb.session.stateless.MaterialResourcePostingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
