/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.DuplicateAwardException;
import Exception.NoResultException;
import ejb.session.stateless.AwardSessionBeanLocal;
import ejb.session.stateless.ProjectSessionBeanLocal;
import entity.AwardEntity;
import entity.UserEntity;
import java.util.ArrayList;
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
import ws.restful.model.CreateAwardReq;
import ws.restful.model.CreateAwardRsp;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author zeplh
 */
@Path("Award")
public class AwardResource {

    AwardSessionBeanLocal awardSessionBean = lookupAwardSessionBeanLocal();

    ProjectSessionBeanLocal projectSessionBean = lookupProjectSessionBeanLocal();

    @Context
    private UriInfo context;
    
    
    
    @Path("{projectId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAward(@PathParam("projectId") Long projectId) {
        System.out.println("******** AwardResource: getAwards()");
        try{
            List<AwardEntity> awards = projectSessionBean.getProjectById(projectId).getAwards();
            List<AwardEntity> returnAward = new ArrayList<>();
            if(awards != null){
                for(AwardEntity award : awards){
                  AwardEntity awardItem = new AwardEntity();
                  awardItem.setProject(null);
                  awardItem.setAwardId(award.getAwardId());
                  awardItem.setName(award.getName());
                  awardItem.setDescription(award.getDescription());
                  awardItem.setAwardPicture(award.getAwardPicture());
                  awardItem.setUsersReceived(new ArrayList<>());
                  for (UserEntity user: award.getUsersReceived()){
                    UserEntity from = new UserEntity();
                    from.setUserId(user.getUserId());
                    from.setFirstName(user.getFirstName());
                    from.setLastName(user.getLastName());
                    from.setProfilePicture(user.getProfilePicture());
                    awardItem.getUsersReceived().add(from);
                  }
                  returnAward.add(awardItem);
                }      
            }
            return Response.status(Response.Status.OK).entity(returnAward).build();
        }
        catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
    }

    @Path("createNewAward")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewAward(CreateAwardReq createAwardReq) {
        System.out.println("******** AwardResource: createNewAward()");
        if (createAwardReq != null) {
            System.out.println("Award: " + createAwardReq.getAward());
            try {
                Long awardId = awardSessionBean.createNewProjectAward(createAwardReq.getAward(), createAwardReq.getProjectId());
                CreateAwardRsp createAwardRsp = new CreateAwardRsp(awardId);
                System.out.println("******** Project Award created");
                return Response.status(Response.Status.OK).entity(createAwardRsp).build();
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @Path("issueAward/{awardId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response issueAward(@PathParam("awardId") Long awardId, @PathParam("userId") Long userId) {
        System.out.println("******** AwardResource: IssueAward()");
        try {
            awardSessionBean.issueAwardToUser(awardId, userId);

            return Response.status(Response.Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        } 
        catch (DuplicateAwardException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        } 
    }
    
    @Path("withdrawAward/{awardId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response withdrawAward(@PathParam("awardId") Long awardId, @PathParam("userId") Long userId) {
        System.out.println("******** AwardResource: withdrawAward()");
        try {
            awardSessionBean.withdrawAwardfromUser(awardId, userId);

            return Response.status(Response.Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        } 
    }
    
    @Path("deleteAward/{awardId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteAward(@PathParam("awardId") Long awardId) {
        System.out.println("******** AwardResource: deleteAward");
        try {
            awardSessionBean.deleteProjectAward(awardId);

            return Response.status(Response.Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("/updateAward")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateAward(AwardEntity award) {
        System.out.println("******** AwardResource: updateAward()");
        try {
            awardSessionBean.editAward(award);
            return Response.status(204).build();
        } catch(NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
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

    private AwardSessionBeanLocal lookupAwardSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (AwardSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/AwardSessionBean!ejb.session.stateless.AwardSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
