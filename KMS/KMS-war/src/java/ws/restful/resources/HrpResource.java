/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.HumanResourcePostingSessionBeanLocal;
import entity.HumanResourcePostingEntity;
import entity.UserEntity;
import java.util.List;
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
import ws.restful.model.CreateHrpReq;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author chai
 */
@Path("hrp")
public class HrpResource {

    HumanResourcePostingSessionBeanLocal humanResourcePostingSessionBean = lookupHumanResourcePostingSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of HrpResource
     */
    public HrpResource() {
    }
    
    @Path("getHrpByProject/{projectId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHrpByProject(@PathParam("projectId") Long projectId) {
        System.out.println("******** HrpResource: getHrpByProject()");
        List<HumanResourcePostingEntity> hrpList = humanResourcePostingSessionBean.getListOfHumanResourcePostingByProjectId(projectId);
        
        for (HumanResourcePostingEntity hrp : hrpList) {
            hrp.setProject(null);
            hrp.setActivity(null);
            hrp.getAppliedUsers().clear();
        }
        
        return Response.status(Status.OK).entity(hrpList).build();
    }
    
    @Path("{hrpId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHrp(@PathParam("hrpId") Long hrpId) {
        System.out.println("******** HrpResource: getHrp()");
        try {
            HumanResourcePostingEntity hrp = humanResourcePostingSessionBean.getHrpById(hrpId);
            if (hrp.getProject() != null) {
                hrp.getProject().setProjectOwner(null);
                hrp.getProject().getProjectMembers().clear();
                hrp.getProject().getProjectAdmins().clear();
                hrp.getProject().getActivities().clear();
                hrp.getProject().getHumanResourcePostings().clear();
                hrp.getProject().getMaterialResourcePostings().clear();
                hrp.getProject().getTasks().clear();
                hrp.getProject().getPosts().clear();
                hrp.getProject().getSdgs().clear();
            }
            if (hrp.getActivity() != null) {
                hrp.getActivity().getHumanResourcePostings().clear();
                hrp.getActivity().getMaterialResourcePostings().clear();
                hrp.getActivity().setProject(null);
            }
            
            if (hrp.getAppliedUsers().size() > 0) {
                for (UserEntity appliedUser : hrp.getAppliedUsers()) {
                    appliedUser.getGroupsOwned().clear();
                    appliedUser.getReviewsGiven().clear();
                    appliedUser.getReviewsReceived().clear();
                    appliedUser.getProjectsOwned().clear();
                    appliedUser.getProjectsJoined().clear();
                    appliedUser.getProjectsManaged().clear();
                    appliedUser.getGroupsJoined().clear();
                    appliedUser.getPosts().clear();
                    appliedUser.getBadges().clear();
                    appliedUser.getMras().clear();
                    appliedUser.getSkills().clear();
                    appliedUser.getFollowers().clear();
                    appliedUser.getFollowing().clear();
                    appliedUser.getSdgs().clear();
                    appliedUser.getFollowRequestMade().clear();
                    appliedUser.getFollowRequestReceived().clear();
                    appliedUser.getHrpApplied().clear();
                    appliedUser.getFulfillments().clear();
                }
            }
            
            return Response.status(Status.OK).entity(hrp).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @Path("createNewHrp")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewHrp(CreateHrpReq createHrpReq) {
        System.out.println("******** HrpResource: createNewHrp()");
        if (createHrpReq != null) {
            try {
                Long hrpId = humanResourcePostingSessionBean.createHumanResourcePostingEntity(createHrpReq.getNewHrp(), createHrpReq.getProjectId(), createHrpReq.getTagIds());
                
                return Response.status(Status.OK).entity(hrpId).build();
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
            }                         
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build();
        }
    }
    
    @Path("updateHrp")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateMrp(HumanResourcePostingEntity hrp) {
        System.out.println("******** HrpResource: updateHrp()");
        try {
            humanResourcePostingSessionBean.updateHumanResourcePosting(hrp);

            return Response.status(204).build();
        } catch(NoResultException ex) {

            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("deleteHrp/{hrpId}")
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteHrp(@PathParam("hrpId") Long hrpId) {
        System.out.println("******** HrpResource: deleteHrp()");
        try {
            humanResourcePostingSessionBean.deleteHumanResourcePosting(hrpId);

            return Response.status(204).build();
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("joinHrp/{hrpId}/{userId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response joinHrp(@PathParam("hrpId") Long hrpId, @PathParam("userId") Long userId) {
        System.out.println("******** HrpResource: joinHrp()");
        try {
            humanResourcePostingSessionBean.joinHrp(userId, hrpId);
            
            return Response.status(204).build();
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("leaveHrp/{hrpId}/{userId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response leaveHrp(@PathParam("hrpId") Long hrpId, @PathParam("userId") Long userId) {
        System.out.println("******** HrpResource: leaveHrp()");
        try {
            humanResourcePostingSessionBean.leaveHrp(userId, hrpId);
            
            return Response.status(204).build();
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private HumanResourcePostingSessionBeanLocal lookupHumanResourcePostingSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (HumanResourcePostingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/HumanResourcePostingSessionBean!ejb.session.stateless.HumanResourcePostingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
