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
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import ws.restful.model.ErrorRsp;

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
    
    @POST
    @Path("/reportProject")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportProject(ReportEntity report) {
        System.out.println("******** ReportResource: reportProject()");
        try {
            reportSessionBean.reportProject(report);
            
            return Response.status(Response.Status.OK).entity(report).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @GET
    @Path("/getProfileReports")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProfileReports() {
        System.out.println("******** ReportResource: getProfileReports");
        try {
            List<ReportEntity>
            
            return Response.status(Response.Status.OK).entity(report).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
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
