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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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
                hrp.getProject().getReviews().clear();
                hrp.getProject().getDonations().clear();
            }
            if (hrp.getActivity() != null) {
                hrp.getActivity().getHumanResourcePostings().clear();
                hrp.getActivity().getMaterialResourcePostings().clear();
                hrp.getActivity().getJoinedUsers().clear();
                hrp.getActivity().setProject(null);
                hrp.getActivity().getReviews().clear();
            }
            
            if (hrp.getAppliedUsers().size() > 0) {
                for (UserEntity appliedUser : hrp.getAppliedUsers()) {
                    appliedUser.setReviewsGiven(new ArrayList<>());
                    appliedUser.setReviewsReceived(new ArrayList<>());
                    appliedUser.setProjectsOwned(new ArrayList<>());
                    appliedUser.setProjectsJoined(new ArrayList<>());
                    appliedUser.setProjectsManaged(new ArrayList<>());
                    appliedUser.setGroupsManaged(new ArrayList<>());
                    appliedUser.setPosts(new ArrayList<>());
                    appliedUser.setGroupsOwned(new ArrayList<>());
                    appliedUser.setGroupsJoined(new ArrayList<>());
                    appliedUser.setGroupAdmins(new ArrayList<>());
                    appliedUser.setBadges(new ArrayList<>());
                    appliedUser.setMras(new ArrayList<>());
                    appliedUser.setSkills(new ArrayList<>());
                    appliedUser.setFollowing(new ArrayList<>());
                    appliedUser.setFollowers(new ArrayList<>());
                    appliedUser.setSdgs(new ArrayList<>());
                    appliedUser.setFollowRequestMade(new ArrayList<>());
                    appliedUser.setFollowRequestReceived(new ArrayList<>());
                    appliedUser.setAffiliatedUsers(new ArrayList<>());
                    appliedUser.setAffiliationRequestMade(new ArrayList<>());
                    appliedUser.setAffiliationRequestReceived(new ArrayList<>());
                    appliedUser.setHrpApplied(new ArrayList<>());
                    appliedUser.setFulfillments(new ArrayList<>());
                    appliedUser.setActivityJoined(new ArrayList<>());  
                    appliedUser.setDonations(new ArrayList<>());
                    appliedUser.setNotifications(new ArrayList<>());
                    appliedUser.setReceivedAwards(new ArrayList<>());
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
    
    @Path("availableHrp/{projectId}/{startDate}/{endDate}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response availableHrp(@PathParam("projectId") Long projectId,@PathParam("startDate") String startString, @PathParam("endDate") String endString) {
        System.out.println("******** HrpResource: availableHrp()");
        
        Date start = new Date();
        Date end = new Date();
        try {
            start = new SimpleDateFormat("yyyy-MM-dd").parse(startString);
            end = new SimpleDateFormat("yyyy-MM-dd").parse(endString);
        } catch (ParseException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
        }  
        
        List<HumanResourcePostingEntity> hrps = humanResourcePostingSessionBean.availableHrp(projectId, start, end);
        
        for (HumanResourcePostingEntity hrp : hrps) {
            hrp.setProject(null);
            hrp.setActivity(null);
            hrp.getAppliedUsers().clear();
        }
        
        return Response.status(Status.OK).entity(hrps).build();
    }
    
    @Path("getHrpByActivityId/{activityId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getHrpByActivityId(@PathParam("activityId") Long activityId) {
        System.out.println("******** HrpResource: getHrpByActivityId()");
        
        List<HumanResourcePostingEntity> hrps = humanResourcePostingSessionBean.getHrpByActivityId(activityId);
        
        for (HumanResourcePostingEntity hrp : hrps) {
            hrp.setProject(null);
            hrp.setActivity(null);
            if (hrp.getAppliedUsers().size() > 0) {
                for (UserEntity appliedUser : hrp.getAppliedUsers()) {
                    appliedUser.setReviewsGiven(new ArrayList<>());
                    appliedUser.setReviewsReceived(new ArrayList<>());
                    appliedUser.setProjectsOwned(new ArrayList<>());
                    appliedUser.setProjectsJoined(new ArrayList<>());
                    appliedUser.setProjectsManaged(new ArrayList<>());
                    appliedUser.setGroupsManaged(new ArrayList<>());
                    appliedUser.setPosts(new ArrayList<>());
                    appliedUser.setGroupsOwned(new ArrayList<>());
                    appliedUser.setGroupsJoined(new ArrayList<>());
                    appliedUser.setGroupAdmins(new ArrayList<>());
                    appliedUser.setBadges(new ArrayList<>());
                    appliedUser.setMras(new ArrayList<>());
                    appliedUser.setSkills(new ArrayList<>());
                    appliedUser.setFollowing(new ArrayList<>());
                    appliedUser.setFollowers(new ArrayList<>());
                    appliedUser.setSdgs(new ArrayList<>());
                    appliedUser.setFollowRequestMade(new ArrayList<>());
                    appliedUser.setFollowRequestReceived(new ArrayList<>());
                    appliedUser.setAffiliatedUsers(new ArrayList<>());
                    appliedUser.setAffiliationRequestMade(new ArrayList<>());
                    appliedUser.setAffiliationRequestReceived(new ArrayList<>());
                    appliedUser.setHrpApplied(new ArrayList<>());
                    appliedUser.setFulfillments(new ArrayList<>());
                    appliedUser.setActivityJoined(new ArrayList<>());  
                    appliedUser.setDonations(new ArrayList<>());
                    appliedUser.setNotifications(new ArrayList<>());
                }
            }
        }
        
        return Response.status(Status.OK).entity(hrps).build();
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
