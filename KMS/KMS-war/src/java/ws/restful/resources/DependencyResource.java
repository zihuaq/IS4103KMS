/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.DependencySessionBeanLocal;
import entity.DependencyEntity;
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
@Path("dependency")
public class DependencyResource {

    DependencySessionBeanLocal dependencySessionBeanLocal = lookupDependencySessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of DependencyResource
     */
    public DependencyResource() {
    }
    
    @Path("getDependenciesByProject/{projectId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDependenciesByProject(@PathParam("projectId") Long projectId) {
        System.out.println("******** DependencyResource: getDependenciesByProject()");
        
        List<DependencyEntity> dependencies = dependencySessionBeanLocal.getDependenciesByProject(projectId);
        
        for (DependencyEntity dependency: dependencies) {
            dependency.getPredecessor().setProject(null);
            dependency.getPredecessor().setParent(null);
            
            dependency.getSuccessor().setProject(null);
            dependency.getSuccessor().setParent(null);
        }
        
        return Response.status(Response.Status.OK).entity(dependencies).build();
    }
    
    @Path("createNewDependency")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewDependency(DependencyEntity newDependency) {
        System.out.println("******** DependencyResource: createNewDependency()");
        
        if (newDependency != null) {
            try {
                Long dependencyId = dependencySessionBeanLocal.createNewDependency(newDependency);
                
                return Response.status(Response.Status.OK).entity(dependencyId).build();
                
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }
            
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }
    
    @Path("deleteDependency/{dependencyId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteDependency(@PathParam("dependencyId") Long dependencyId) {
        System.out.println("******** DependencyResource: deleteDependency()");
        try {
            dependencySessionBeanLocal.deleteDependency(dependencyId);

            return Response.status(Response.Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private DependencySessionBeanLocal lookupDependencySessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (DependencySessionBeanLocal) c.lookup("java:global/KMS/KMS-war/DependencySessionBean!ejb.session.stateless.DependencySessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    
}
