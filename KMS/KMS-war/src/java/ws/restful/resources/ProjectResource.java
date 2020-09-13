/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.CreateProjectException;
import Exception.NoResultException;
import ejb.session.stateless.ProjectSessionBeanLocal;
import entity.ProjectEntity;
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
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import ws.restful.model.CreateProjectReq;
import ws.restful.model.CreateProjectRsp;
import ws.restful.model.ErrorRsp;
import ws.restful.model.RetrieveAllProjectRsp;

/**
 * REST Web Service
 *
 * @author chai
 */
@Path("project")
public class ProjectResource {

    ProjectSessionBeanLocal projectSessionBeanLocal = lookupProjectSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ProjectResource
     */
    public ProjectResource() {
    }

    @Path("getAllProject")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllProject() {
        List<ProjectEntity> projects = projectSessionBeanLocal.retrieveAllProject();
        for (ProjectEntity p : projects) {
            p.getOwner().getProjectsOwned().clear();
            p.getContributors().clear();
            p.getAdmins().clear();
            p.getActivities().clear();
            p.getHumanResourcePostings().clear();
            p.getMaterialResourcePostings().clear();
            p.getTasks().clear();
            p.getPosts().clear();
        }
        return Response.status(Status.OK).entity(new RetrieveAllProjectRsp(projects)).build();
    }

    @Path("createNewProject")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewProject(CreateProjectReq createProjectReq) {
        if (createProjectReq != null) {
            try {
                Long projectId = projectSessionBeanLocal.createNewProject(createProjectReq.getNewProject(), createProjectReq.getOwnerId());
                CreateProjectRsp createProjectRsp = new CreateProjectRsp(projectId);
                System.out.println("******** Customer created");
                return Response.status(Status.OK).entity(createProjectRsp).build();
            } catch (CreateProjectException ex) {
                ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @Path("/{projectId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProject(@PathParam("projectId") Long projectId) {
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        return Response.status(Status.OK).entity(project).build();

    }
    
    @Path("joinProject/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response addContributor(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        try {
            projectSessionBeanLocal.addContributor(projectId, userId);

            return Response.status(Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("leaveProject/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeContributor(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        try {
            projectSessionBeanLocal.removeContributor(projectId, userId);

            return Response.status(Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("addAdmin/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response addAdmin(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        try {
            projectSessionBeanLocal.addAdmin(projectId, userId);

            return Response.status(Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("removeAdmin/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeAdmin(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        try {
            projectSessionBeanLocal.removeAdmin(projectId, userId);

            return Response.status(Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    

    private ProjectSessionBeanLocal lookupProjectSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (ProjectSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/ProjectSessionBean!ejb.session.stateless.ProjectSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
