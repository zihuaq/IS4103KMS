/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.FulfillmentSessionBeanLocal;
import entity.FulfillmentEntity;
import entity.PaymentEntity;
import entity.UserEntity;
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
import javax.ws.rs.core.UriInfo;
import ws.restful.model.CreateFulfillmentReq;
import ws.restful.model.ErrorRsp;
import ws.restful.model.MakeOneTimePaymentReq;

/**
 * REST Web Service
 *
 * @author zihua
 */
@Path("fulfillment")
public class FulfillmentResource {

    FulfillmentSessionBeanLocal fulfillmentSessionBeanLocal = lookupFulfillmentSessionBeanLocal();
    
    @Context
    private UriInfo context;

    /**
     * Creates a new instance of FulfillmentResource
     */
    public FulfillmentResource() {
    }

    @Path("createNewFulfillment")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewFulfillment(CreateFulfillmentReq createFulfillmentReq) {
        System.out.println("******** FulfillmentResource: createNewFulfillment()");
        if (createFulfillmentReq != null) {
            try {
                Long fulfillmentId = fulfillmentSessionBeanLocal.createFulfillment(createFulfillmentReq.getNewFulfillment(), createFulfillmentReq.getOwnerId(), createFulfillmentReq.getPostingId(), createFulfillmentReq.getMraId());
                
                return Response.status(Response.Status.OK).entity(fulfillmentId).build();
                
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }
            
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }
    
    @Path("{fulfillmentId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFulfillment(@PathParam("fulfillmentId") Long fulfillmentId) {
        System.out.println("******** FulfillmentResource: getFulfillment()");
        try {
            FulfillmentEntity fulfillment = fulfillmentSessionBeanLocal.getFulfillmentById(fulfillmentId);
            
            fulfillment.setFulfillmentOwner(null);
            fulfillment.setPosting(null);
            fulfillment.setMra(null);
            
            return Response.status(Response.Status.OK).entity(fulfillment).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("getFulfillmentsByMrp/{mrpId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFulfillmentsByMrp(@PathParam("mrpId") Long mrpId) {
        System.out.println("******** FulfillmentResource: getFulfillmentsByMrp()");
        try {
            List<FulfillmentEntity> fulfillmentList = fulfillmentSessionBeanLocal.getListOfFulfillmentsByMrp(mrpId);

            for (FulfillmentEntity fulfillment : fulfillmentList) {
                UserEntity owner = new UserEntity();
                owner.setUserId(fulfillment.getFulfillmentOwner().getUserId());
                owner.setFirstName(fulfillment.getFulfillmentOwner().getFirstName());
                owner.setLastName(fulfillment.getFulfillmentOwner().getLastName());
                fulfillment.setFulfillmentOwner(owner);
                fulfillment.setPosting(null);
                fulfillment.getMra().setMaterialResourceAvailableOwner(null);
            }
            return Response.status(Response.Status.OK).entity(fulfillmentList).build();
        
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("receiveResource")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response receiveResource(MakeOneTimePaymentReq makeOneTimePaymentReq) {
        try { 
            System.out.println("******** FulfillmentResource: receiveResource()");
            fulfillmentSessionBeanLocal.receiveResource(makeOneTimePaymentReq.getFulfillmentToUpdate(), makeOneTimePaymentReq.getPayment());

            return Response.status(204).build();
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("updateQuantity")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateQuantity(MakeOneTimePaymentReq makeOneTimePaymentReq) {
        try { 
            System.out.println("******** FulfillmentResource: updateQuantity()");
            fulfillmentSessionBeanLocal.updateQuantity(makeOneTimePaymentReq.getFulfillmentToUpdate(), makeOneTimePaymentReq.getPayment());

            return Response.status(204).build();
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("updateFulfillment")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateFulfillment(FulfillmentEntity fulfillmentToUpdate) {
        try { 
            System.out.println("******** FulfillmentResource: updateFulfillment()");
            fulfillmentSessionBeanLocal.updateFulfillment(fulfillmentToUpdate);

            return Response.status(204).build();
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("rejectFulfillment")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response rejectFulfillment(Long fulfillmentId) {
        try { 
            System.out.println("******** FulfillmentResource: rejectFulfillment()");
            fulfillmentSessionBeanLocal.rejectFulfillment(fulfillmentId);

            return Response.status(204).build();
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("acceptFulfillment")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response acceptFulfillment(Long fulfillmentId) {
        try { 
            System.out.println("******** FulfillmentResource: acceptFulfillment()");
            fulfillmentSessionBeanLocal.acceptFulfillment(fulfillmentId);

            return Response.status(204).build();
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("endSubscription")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response endSubscription(Long fulfillmentId) {
        try { 
            System.out.println("******** FulfillmentResource: endSubscription()");
            PaymentEntity payment = fulfillmentSessionBeanLocal.endSubscription(fulfillmentId);
            payment.setFulfillment(null);

            return Response.status(Response.Status.OK).entity(payment).build();
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("deleteFulfillment/{fulfillmentId}")
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteFulfillment(@PathParam("fulfillmentId") Long fulfillmentId) {
        System.out.println("******** FulfillmentResource: deleteFulfillment()");
        try {
            fulfillmentSessionBeanLocal.deleteFulfillment(fulfillmentId);

            return Response.status(204).build();
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("getListOfFulfillmentsByUserAndProject/{userId}/{projectId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getListOfFulfillmentsByUserAndProject(@PathParam("userId") Long userId, @PathParam("projectId") Long projectId) {
        System.out.println("******** FulfillmentResource: getListOfFulfillmentsByUserAndProject()");
        try {
            List<FulfillmentEntity> fulfillmentList = fulfillmentSessionBeanLocal.getListOfFulfillmentsByUserAndProject(userId, projectId);

            for (FulfillmentEntity fulfillment : fulfillmentList) {
                fulfillment.setFulfillmentOwner(null);
                fulfillment.getPosting().setProject(null);
                fulfillment.getPosting().setActivity(null);
                fulfillment.getPosting().getFulfillments().clear();
                fulfillment.getMra().setMaterialResourceAvailableOwner(null);
            }
            return Response.status(Response.Status.OK).entity(fulfillmentList).build();
        
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("getListOfFulfillmentsByProject/{projectId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getListOfFulfillmentsByProject(@PathParam("projectId") Long projectId) {
        System.out.println("******** FulfillmentResource: getListOfFulfillmentsByProject()");
        try {
            List<FulfillmentEntity> fulfillmentList = fulfillmentSessionBeanLocal.getListOfFulfillmentsByProject(projectId);

            for (FulfillmentEntity fulfillment : fulfillmentList) {
                fulfillment.setFulfillmentOwner(null);
                fulfillment.getPosting().setProject(null);
                fulfillment.getPosting().setActivity(null);
                fulfillment.getPosting().getFulfillments().clear();
                fulfillment.getMra().setMaterialResourceAvailableOwner(null);
            }
            return Response.status(Response.Status.OK).entity(fulfillmentList).build();
        
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private FulfillmentSessionBeanLocal lookupFulfillmentSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (FulfillmentSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/FulfillmentSessionBean!ejb.session.stateless.FulfillmentSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
