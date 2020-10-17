/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.DonationSessionBeanLocal;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import ws.restful.model.CreateDonationReq;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author zihua
 */
@Path("donation")
public class DonationResource {

    DonationSessionBeanLocal donationSessionBeanLocal = lookupDonationSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of DonationResource
     */
    public DonationResource() {
    }

    @Path("createNewDonation")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewDonation(CreateDonationReq createDonationReq) {
        System.out.println("******** DonationResource: createNewDonation()");
        if (createDonationReq != null) {
            try {
                Long donationId = donationSessionBeanLocal.createNewDonation(createDonationReq.getNewDonation(), createDonationReq.getUserId(), createDonationReq.getProjectId());
                
                return Response.status(Response.Status.OK).entity(donationId).build();
                
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }
            
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }

    private DonationSessionBeanLocal lookupDonationSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (DonationSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/DonationSessionBean!ejb.session.stateless.DonationSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
