/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.CreateNotificationException;
import Exception.NoResultException;
import ejb.session.stateless.NotificationSessionBeanLocal;
import entity.NotificationEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import ws.restful.model.CreateNotificationReq;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author chai
 */
@Path("notification")
public class NotificationResource {

    NotificationSessionBeanLocal notificationSessionBean = lookupNotificationSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of NotificationResource
     */
    public NotificationResource() {
    }

    @Path("getNotification/{userId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNotification(@PathParam("userId") Long userId) {
        System.out.println("******** NotificationResource: getNotification()");
        List<NotificationEntity> notifications = notificationSessionBean.getNotificationByUserId(userId);
        
        for (NotificationEntity n : notifications) {
            n.setTo(null);
        }
        
        return Response.status(Status.OK).entity(notifications).build();
    }
    
    @Path("createNewNotification")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewNotification(CreateNotificationReq createNotificationReq) {
        System.out.println("******* NotificationResource: createNewNotification()");
        if (createNotificationReq != null) {
            try {
                Long notificationId = notificationSessionBean.createNewNotification(createNotificationReq.getNewNotification(), createNotificationReq.getUserId());
                
                return Response.status(Status.OK).entity(notificationId).build();
            } catch (CreateNotificationException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());

                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @Path("deleteNotification/{notificationId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteNotification(@PathParam("notificationId") Long notificationId) {
        System.out.println("******** NotificationResource: deleteNotification()");
        try {
            notificationSessionBean.deleteNotification(notificationId);
            
            return Response.status(Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private NotificationSessionBeanLocal lookupNotificationSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (NotificationSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/NotificationSessionBean!ejb.session.stateless.NotificationSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
