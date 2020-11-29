/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.PaymentSessionBeanLocal;
import entity.FulfillmentEntity;
import entity.PaymentEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
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
import ws.restful.model.CreatePaymentReq;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author zihua
 */
@Path("payment")
public class PaymentResource {

    PaymentSessionBeanLocal paymentSessionBean = lookupPaymentSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of PaymentResource
     */
    public PaymentResource() {
    }
    
    @Path("{paymentId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPayment(@PathParam("paymentId") Long paymentId) {
        System.out.println("******** PaymentResource: getPayment()");
        try {
            PaymentEntity payment = paymentSessionBean.getPaymentById(paymentId);
            
            payment.getFulfillment().setFulfillmentOwner(null);
            payment.getFulfillment().setPosting(null);
            payment.getFulfillment().setMra(null);
            
            return Response.status(Status.OK).entity(payment).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("createNewPayment")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewPayment(CreatePaymentReq createPaymentReq) {
        System.out.println("******** PaymentResource: createNewPayment()");
        if (createPaymentReq != null) {
            try {
                Long paymentId = paymentSessionBean.createPayment(createPaymentReq.getNewPayment(), createPaymentReq.getFulfillmentId());
                
                return Response.status(Status.OK).entity(paymentId).build();
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }
    
    @Path("makePayment")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response makePayment(FulfillmentEntity fulfillmentToUpdate, List<Long> paymentIds, String paypalOrderId) {
        try { 
            System.out.println("******** PaymentResource: makePayment()");
            paymentSessionBean.makePayment(fulfillmentToUpdate, paymentIds, paypalOrderId);

            return Response.status(204).build();
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private PaymentSessionBeanLocal lookupPaymentSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (PaymentSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/PaymentSessionBean!ejb.session.stateless.PaymentSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

}
