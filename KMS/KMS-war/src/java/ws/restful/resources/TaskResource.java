/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.TaskSessionBeanLocal;
import entity.TaskEntity;
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
import ws.restful.model.CreateTaskReq;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author zihua
 */
@Path("task")
public class TaskResource {

    TaskSessionBeanLocal taskSessionBeanLocal = lookupTaskSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of TaskResource
     */
    public TaskResource() {
    }
    
    @Path("{taskId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTaskById(@PathParam("taskId") Long taskId){
        System.out.println("******** TaskResource: getTaskById()");
        
        try {
            TaskEntity task = taskSessionBeanLocal.getTaskById(taskId);
            
            task.setProject(null);
            task.getParent().setProject(null);
            task.getParent().setParent(null);
                
            return Response.status(Status.OK).entity(task).build(); 
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());

            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
        
    }
    
    @Path("createNewTask")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewTask(CreateTaskReq createTaskReq) {
        System.out.println("******** TaskResource: createNewTask()");
        if (createTaskReq != null) {
            try {
                Long taskId = taskSessionBeanLocal.createNewTask(createTaskReq.getNewTask(), createTaskReq.getProjectId());
                
                return Response.status(Response.Status.OK).entity(taskId).build();
                
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }
            
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }
    
    @Path("/updateTask")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(TaskEntity taskToUpdate) {
        System.out.println("******** TaskResource: updateTask()");
        try {
            taskSessionBeanLocal.updateTask(taskToUpdate);
            return Response.status(204).build();
            
        } catch(NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("deleteTask/{taskId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTask(@PathParam("taskId") Long taskId) {
        System.out.println("******** TaskResource: deleteTask()");
        try {
            taskSessionBeanLocal.deleteTask(taskId);

            return Response.status(Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private TaskSessionBeanLocal lookupTaskSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (TaskSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/TaskSessionBean!ejb.session.stateless.TaskSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    
}
