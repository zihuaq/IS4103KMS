/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import ejb.session.stateless.ReportSessionBeanLocal;
import entity.ReportEntity;
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
import javax.ws.rs.POST;
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
@Path("report")
public class ReportResource {

    ReportSessionBeanLocal reportSessionBean = lookupReportSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ReportResource
     */
    public ReportResource() {
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createReport(ReportEntity report) {
        System.out.println("Reached create report resource");
        try {
            reportSessionBean.createNewReport(report);
            return Response.status(200).entity(report).build();
        } catch (Exception ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    private ReportSessionBeanLocal lookupReportSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (ReportSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/ReportSessionBean!ejb.session.stateless.ReportSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

   
}
