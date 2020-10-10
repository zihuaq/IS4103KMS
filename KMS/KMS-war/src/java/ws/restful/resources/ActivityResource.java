/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.ActivitySessionBeanLocal;
import entity.ActivityEntity;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import ws.restful.model.CreateActivityReq;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author chai
 */
@Path("activity")
public class ActivityResource {

    ActivitySessionBeanLocal activitySessionBean = lookupActivitySessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ActivityResource
     */
    public ActivityResource() {
    }

    @Path("getActivitiesByProject/{projectId}/{date}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getActivitiesByProject(@PathParam("projectId") Long projectId, @PathParam("date") String dateString) {
        System.out.println("******** ActivityResource: getActivitiesByProject");
        Date date = new Date();
        try {
            date = new SimpleDateFormat("yyyy-MM-dd").parse(dateString);
            System.out.println("date: " + date);
        } catch (ParseException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
        }        
        List<ActivityEntity> activities = activitySessionBean.getActivitiesByProjectId(projectId, date);
        for (ActivityEntity a : activities) {
            if (a.getHumanResourcePostings() != null) {
                a.getHumanResourcePostings().clear();
            }
            if (a.getMaterialResourcePostings() != null) {
                a.getMaterialResourcePostings().clear();
            }
            if (a.getJoinedUsers() != null) {
                a.getJoinedUsers().clear();
            }
            a.setProject(null);
        }
        return Response.status(Status.OK).entity(activities).build();
    }

    @Path("createNewActivity")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewActivity(CreateActivityReq createActivityReq) {
        System.out.println("******** ActivityResource: createNewActivity()");
        if (createActivityReq != null) {
            try {
                Long activityId = activitySessionBean.createNewActivity(createActivityReq.getNewActivity(), createActivityReq.getProjectId());
                return Response.status(Status.OK).entity(activityId).build();
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }

    private ActivitySessionBeanLocal lookupActivitySessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (ActivitySessionBeanLocal) c.lookup("java:global/KMS/KMS-war/ActivitySessionBean!ejb.session.stateless.ActivitySessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
