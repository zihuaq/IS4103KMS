/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.ActivitySessionBeanLocal;
import entity.ActivityEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.ProjectEntity;
import entity.ReviewEntity;
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
import ws.restful.model.CreateActivityReq;
import ws.restful.model.CreateProjectReviewReq;
import ws.restful.model.CreateProjectReviewRsp;
import ws.restful.model.CreateUserReviewReq;
import ws.restful.model.CreateUserReviewRsp;
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
            a.setHumanResourcePostings(new ArrayList<>());
            a.setMaterialResourcePostings(new ArrayList<>());
            a.setReviews(new ArrayList<>());
            if (a.getJoinedUsers() != null) {
                for (UserEntity user: a.getJoinedUsers()) {
                    user.setReviewsGiven(new ArrayList<>());
                    user.setReviewsReceived(new ArrayList<>());
                    user.setProjectsOwned(new ArrayList<>());
                    user.setProjectsJoined(new ArrayList<>());
                    user.setProjectsManaged(new ArrayList<>());
                    user.setGroupsManaged(new ArrayList<>());
                    user.setPosts(new ArrayList<>());
                    user.setGroupsOwned(new ArrayList<>());
                    user.setGroupsJoined(new ArrayList<>());
                    user.setGroupAdmins(new ArrayList<>());
                    user.setBadges(new ArrayList<>());
                    user.setMras(new ArrayList<>());
                    user.setSkills(new ArrayList<>());
                    user.setFollowing(new ArrayList<>());
                    user.setFollowers(new ArrayList<>());
                    user.setSdgs(new ArrayList<>());
                    user.setFollowRequestMade(new ArrayList<>());
                    user.setFollowRequestReceived(new ArrayList<>());
                    user.setAffiliatedUsers(new ArrayList<>());
                    user.setAffiliationRequestMade(new ArrayList<>());
                    user.setAffiliationRequestReceived(new ArrayList<>());
                    user.setHrpApplied(new ArrayList<>());
                    user.setFulfillments(new ArrayList<>());
                    user.setActivityJoined(new ArrayList<>());  
                    user.setDonations(new ArrayList<>());
                    user.setNotifications(new ArrayList<>());
                    user.setReceivedAwards(new ArrayList<>());
                }
            }
            a.setProject(null);
        }
        return Response.status(Status.OK).entity(activities).build();
    }
    
    @Path("getActivityById/{activityId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getActivityById(@PathParam("activityId") Long activityId) {
        System.out.println("******** ActivityResouce: getActivityById()");
        try {
            ActivityEntity activity = activitySessionBean.getActivityById(activityId);
            
            if (activity.getHumanResourcePostings() != null) {
                for (HumanResourcePostingEntity hrp: activity.getHumanResourcePostings()) {
                    hrp.setActivity(null);
                    hrp.setProject(null);
                    hrp.setTags(new ArrayList<>());
                    hrp.setAppliedUsers(new ArrayList<>());
                }
            }
            if (activity.getMaterialResourcePostings() != null) {
                for (MaterialResourcePostingEntity mrp: activity.getMaterialResourcePostings()) {
                    mrp.setActivity(null);
                    mrp.setProject(null);
                    mrp.setTags(new ArrayList<>());
                    mrp.setFulfillments(new ArrayList<>());
                }
            }
            if(activity.getReviews() != null){
                for (ReviewEntity review: activity.getReviews()){
                 review.setFrom(null);
                 review.setMadeFromActivity(null);
                 review.setTo(null);
                 review.setProject(null);
                }
            }
            if (activity.getJoinedUsers() != null) {
                for (UserEntity user: activity.getJoinedUsers()) {
                    user.setReviewsGiven(new ArrayList<>());
                    user.setReviewsReceived(new ArrayList<>());
                    user.setProjectsOwned(new ArrayList<>());
                    user.setProjectsJoined(new ArrayList<>());
                    user.setProjectsManaged(new ArrayList<>());
                    user.setGroupsManaged(new ArrayList<>());
                    user.setPosts(new ArrayList<>());
                    user.setGroupsOwned(new ArrayList<>());
                    user.setGroupsJoined(new ArrayList<>());
                    user.setGroupAdmins(new ArrayList<>());
                    user.setBadges(new ArrayList<>());
                    user.setMras(new ArrayList<>());
                    user.setSkills(new ArrayList<>());
                    user.setFollowing(new ArrayList<>());
                    user.setFollowers(new ArrayList<>());
                    user.setSdgs(new ArrayList<>());
                    user.setFollowRequestMade(new ArrayList<>());
                    user.setFollowRequestReceived(new ArrayList<>());
                    user.setAffiliatedUsers(new ArrayList<>());
                    user.setAffiliationRequestMade(new ArrayList<>());
                    user.setAffiliationRequestReceived(new ArrayList<>());
                    user.setHrpApplied(new ArrayList<>());
                    user.setFulfillments(new ArrayList<>());
                    user.setActivityJoined(new ArrayList<>());   
                    user.setDonations(new ArrayList<>());
                    user.setNotifications(new ArrayList<>());
                    user.setReceivedAwards(new ArrayList<>());
                }
            }
            
            activity.setProject(null);
            
            return Response.status(Status.OK).entity(activity).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
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
    
    @Path("updateActivity")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateActivity(ActivityEntity activity) {
        System.out.println("******** ActivityResource: updateActivity()");
        try {
            activitySessionBean.updateActivity(activity);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("deleteActivity/{activityId}")
    @DELETE
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteActivity(@PathParam("activityId") Long activityId) {
        System.out.println("********* ActivityResource: deleteActivity()");
        try {
            activitySessionBean.deleteActivity(activityId);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("addMemberToActivity/{activityId}/{userId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addMemberToActivity(@PathParam("activityId") Long activityId, @PathParam("userId") Long userId) {
        System.out.println("******** ActivityResource: addMemberToActivity()");
        try {
            activitySessionBean.addMemberToActivity(activityId, userId);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("removeMemberFromActivity/{activityId}/{userId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeMemberFromActivity(@PathParam("activityId") Long activityId, @PathParam("userId") Long userId) {
        System.out.println("******** ActivityResource: removeMemberFromActivity()");
        try {
            activitySessionBean.removeMemberFromActivity(activityId, userId);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("addHrpToActivity/{activityId}/{hrpId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addHrpToActivity(@PathParam("activityId") Long activityId, @PathParam("hrpId") Long hrpId) {
        System.out.println("******** ActivityResource: addHrpToActivity()");
        try {
            activitySessionBean.allocateHrpToActivity(activityId, hrpId);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("removeHrpFromActivity/{activityId}/{hrpId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeHrpFromActivity(@PathParam("activityId") Long activityId, @PathParam("hrpId") Long hrpId) {
        System.out.println("******** ActivityResource: removeHrpFromActivity()");
        try {
            activitySessionBean.removeHrpFromActivity(activityId, hrpId);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("getAllocatedMrps/{activityId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllocatedMrps(@PathParam("activityId") Long activityId) {
        System.out.println("******** ActivityResource: getAllocatedMrps()");
        
        try {
            List<MaterialResourcePostingEntity> mrpList = activitySessionBean.getAllocatedMrps(activityId);

            for (MaterialResourcePostingEntity mrp : mrpList) {
                mrp.setProject(null);
                mrp.setActivity(null);
                mrp.getFulfillments().clear();
            }
            return Response.status(Status.OK).entity(mrpList).build();  
            
        } catch (NoResultException ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }   
    }
    
    @Path("allocateMrpToActivity/{activityId}/{mrpId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response allocateMrpToActivity(@PathParam("activityId") Long activityId, @PathParam("mrpId") Long mrpId) {
        System.out.println("******** ActivityResource: allocateMrpToActivity()");
        try {
            activitySessionBean.allocateMrpToActivity(activityId, mrpId);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("removeMrpFromActivity/{activityId}/{mrpId}")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeMrpFromActivity(@PathParam("activityId") Long activityId, @PathParam("mrpId") Long mrpId) {
        System.out.println("******** ActivityResource: removeMrpFromActivity()");
        try {
            activitySessionBean.removeMrpFromActivity(activityId, mrpId);
            
            return Response.status(204).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("getUserReviewsForActivity/{activityId}/{userId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserReviewsForActivity(@PathParam("activityId") Long activityId, @PathParam("userId") Long userId) {
        System.out.println("******** ActivityResource: getToReviewForActivity");
        
        try {
            List<ReviewEntity> userReviews = activitySessionBean.getToUserWrittenReviewsForCurrentActivity(userId, activityId);
            List<ReviewEntity> userReviewsResponse = getUserReviewsForActivityResponse(userReviews);

            return Response.status(Status.OK).entity(userReviewsResponse).build();  
            
        } catch (Exception ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }   
    }
    
     private List<ReviewEntity> getUserReviewsForActivityResponse(List<ReviewEntity> userReviews) {
         List<ReviewEntity> userReviewsResponse = new ArrayList<>();
         for(ReviewEntity review: userReviews){
             ReviewEntity temp = new ReviewEntity();
             
             UserEntity to = new UserEntity();
             to.setUserId(review.getTo().getUserId());
             to.setFirstName(review.getTo().getFirstName());
             to.setLastName(review.getTo().getLastName());
             to.setProfilePicture(review.getTo().getProfilePicture());
             
             UserEntity from = new UserEntity();
             from.setUserId(review.getFrom().getUserId());
             from.setFirstName(review.getFrom().getFirstName());
             from.setLastName(review.getFrom().getLastName());
             from.setProfilePicture(review.getFrom().getProfilePicture());
            
             temp.setReviewId(review.getReviewId());
             temp.setReviewField(review.getReviewField());
             temp.setTitle(review.getTitle());
             temp.setRating(review.getRating());
             temp.setTo(to);
             temp.setFrom(from);
             
             userReviewsResponse.add(temp);
             
         }
        return userReviewsResponse;
    }
     
    @Path("getProjectReviewForActivity/{activityId}/{userId}")
    @GET
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectReviewForActivity(@PathParam("activityId") Long activityId, @PathParam("userId") Long userId) {
        System.out.println("******** ActivityResource: getProjectReviewForActivity");
        
        try {
            List<ReviewEntity> projectReviews = activitySessionBean.getToProjectWrittenReviewsForCurrentActivity(userId, activityId);
            List<ReviewEntity> projectReviewsResponse = getProjectReviewsForActivityResponse(projectReviews);

            return Response.status(Status.OK).entity(projectReviewsResponse).build();  
            
        } catch (Exception ex ) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }   
    }
    
     private List<ReviewEntity> getProjectReviewsForActivityResponse(List<ReviewEntity> projectReviews) {
         List<ReviewEntity> projectReviewsResponse = new ArrayList<>();
         for(ReviewEntity review: projectReviews){
             ReviewEntity temp = new ReviewEntity();
             
             UserEntity from = new UserEntity();
             from.setUserId(review.getFrom().getUserId());
             from.setFirstName(review.getFrom().getFirstName());
             from.setLastName(review.getFrom().getLastName());
             from.setProfilePicture(review.getFrom().getProfilePicture());
             
             ProjectEntity project = new ProjectEntity();
             project.setProjectId(review.getProject().getProjectId());
             project.setName(review.getProject().getName());
            
             temp.setReviewId(review.getReviewId());
             temp.setReviewField(review.getReviewField());
             temp.setTitle(review.getTitle());
             temp.setRating(review.getRating());
             temp.setFrom(from);
             temp.setProject(project);
             projectReviewsResponse.add(temp);
             
         }
        return projectReviewsResponse;
    }
     
  
    @Path("createNewUserReview")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewUserReview(CreateUserReviewReq createUserReviewReq) {
        System.out.println("******** ActivityResource: createNewUserReview");
        if (createUserReviewReq != null) {
            try {
                Long reviewId = activitySessionBean.createNewUserReview(createUserReviewReq.getReview(), createUserReviewReq.getFrom(), createUserReviewReq.getTo(), createUserReviewReq.getMadeFromActivityId());
                return Response.status(Status.OK).entity(new CreateUserReviewRsp(reviewId)).build();
            } catch (NoResultException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    
    @Path("createNewProjectReview")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewProjectReview(CreateProjectReviewReq createprojectReviewReq) {
        System.out.println("******** ActivityResource: createNewUserReview");
        if (createprojectReviewReq != null) {
            try {
                Long reviewId = activitySessionBean.createNewProjectReview(createprojectReviewReq.getReview(), createprojectReviewReq.getFrom(), createprojectReviewReq.getProject(), createprojectReviewReq.getMadeFromActivityId());
                return Response.status(Status.OK).entity(new CreateProjectReviewRsp(reviewId)).build();
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
