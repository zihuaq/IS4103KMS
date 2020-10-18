/*
 * To change this license header, choose License Headers in Group Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.CreateGroupException;
//import Exception.CreateGroupReviewException;
//import Exception.CreateUserReviewException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import ejb.session.stateless.GroupSessionBeanLocal;
import entity.GroupEntity;
//import entity.ReviewEntity;
import entity.UserEntity;
//import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
//import javax.json.Json;
//import javax.json.JsonObject;
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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import util.enumeration.GroupStatusEnum;
import ws.restful.model.CreateGroupReq;
//import ws.restful.model.CreateGroupReviewReq;
//import ws.restful.model.CreateGroupReviewRsp;
import ws.restful.model.CreateGroupRsp;
//import ws.restful.model.CreateUserReviewReq;
//import ws.restful.model.CreateUserReviewRsp;
import ws.restful.model.ErrorRsp;
import ws.restful.model.RetrieveAllGroupRsp;

/**
 * REST Web Service
 *
 * @author chai
 */
@Path("group")
public class GroupResource {

    GroupSessionBeanLocal groupSessionBeanLocal = lookupGroupSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of GroupResource
     */
    public GroupResource() {
    }

    @Path("getAllGroup")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllGroup() {
        System.out.println("******** GroupResource: getAllGroup()");
        List<GroupEntity> groups = groupSessionBeanLocal.retrieveAllGroup();
        for (GroupEntity p : groups) {
            p.setGroupOwner(null);
            p.getGroupMembers().clear();
            p.getGroupAdmins().clear();
//            p.getActivities().clear();
//            p.getHumanResourcePostings().clear();
//            p.getMaterialResourcePostings().clear();
//            p.getTasks().clear();
//            p.getPosts().clear();
        }
        return Response.status(Status.OK).entity(new RetrieveAllGroupRsp(groups)).build();
    }

    @Path("createNewGroup")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewGroup(CreateGroupReq createGroupReq) {
        System.out.println("******** GroupResource: createNewGroup()");
        if (createGroupReq != null) {
            System.out.println("Group: " + createGroupReq.getNewGroup());
            try {
                Long groupId = groupSessionBeanLocal.createNewGroup(createGroupReq.getNewGroup(), createGroupReq.getOwnerId());
                CreateGroupRsp createGroupRsp = new CreateGroupRsp(groupId);
                System.out.println("******** Group created");
                return Response.status(Status.OK).entity(createGroupRsp).build();
            } catch (CreateGroupException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @Path("{groupId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroup(@PathParam("groupId") Long groupId) {
        System.out.println("******** GroupResource: getGroup()");
        try {
            GroupEntity group = groupSessionBeanLocal.getGroupById(groupId);
            group.getGroupOwner().getGroupsOwned().clear();
            group.getGroupOwner().getReviewsGiven().clear();
            group.getGroupOwner().getReviewsReceived().clear();
            group.getGroupOwner().getGroupsOwned().clear();
            group.getGroupOwner().getGroupsJoined().clear();
            group.getGroupOwner().getGroupsManaged().clear();
            group.getGroupOwner().getGroupsJoined().clear();
            group.getGroupOwner().getPosts().clear();
            group.getGroupOwner().getBadges().clear();
            group.getGroupOwner().getMras().clear();
            group.getGroupOwner().getSkills().clear();
            group.getGroupOwner().getFollowers().clear();
            group.getGroupOwner().getFollowing().clear();
            group.getGroupOwner().getSdgs().clear();
            group.getGroupOwner().getFollowRequestMade().clear();
            group.getGroupOwner().getFollowRequestReceived().clear();
            group.getGroupOwner().getHrpApplied().clear();
            group.getGroupOwner().getFulfillments().clear();
            for (UserEntity member : group.getGroupMembers()) {
                member.getGroupsOwned().clear();
                member.getReviewsGiven().clear();
                member.getReviewsReceived().clear();
                member.getGroupsOwned().clear();
                member.getGroupsJoined().clear();
                member.getGroupsManaged().clear();
                member.getGroupsJoined().clear();
                member.getPosts().clear();
                member.getBadges().clear();
                member.getMras().clear();
                member.getSkills().clear();
                member.getFollowers().clear();
                member.getFollowing().clear();
                member.getSdgs().clear();
                member.getFollowRequestMade().clear();
                member.getFollowRequestReceived().clear();
                member.getHrpApplied().clear();
                member.getFulfillments().clear();
            }
            for (UserEntity admin : group.getGroupAdmins()) {
                admin.getGroupsOwned().clear();
                admin.getReviewsGiven().clear();
                admin.getReviewsReceived().clear();
                admin.getGroupsOwned().clear();
                admin.getGroupsJoined().clear();
                admin.getGroupsManaged().clear();
                admin.getGroupsJoined().clear();
                admin.getPosts().clear();
                admin.getBadges().clear();
                admin.getMras().clear();
                admin.getSkills().clear();
                admin.getFollowers().clear();
                admin.getFollowing().clear();
                admin.getSdgs().clear();
                admin.getFollowRequestMade().clear();
                admin.getFollowRequestReceived().clear();
                admin.getHrpApplied().clear();
                admin.getFulfillments().clear();
            }
//            for (ActivityEntity ae : group.getActivities()) {
//                ae.setGroup(null);
//                ae.getHumanResourcePostings().clear();
//                ae.getMaterialResourcePostings().clear();
//            }
//            for (HumanResourcePostingEntity hrp : group.getHumanResourcePostings()) {
//                hrp.setActivity(null);
//                hrp.setGroup(null);
//                hrp.getAppliedUsers().clear();
//            }
//            for (MaterialResourcePostingEntity mrp : group.getMaterialResourcePostings()) {
//                mrp.setActivity(null);
//                mrp.setGroup(null);
//                mrp.getFulfillments().clear();
//            }
//
            return Response.status(200).entity(group).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }

    }
    
    @Path("joinGroup/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response joinGroup(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** GroupResource: joinGroup()");
        try {
            groupSessionBeanLocal.joinGroup(groupId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        } 
    }
    
    @Path("removeMember/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeMember(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** GroupResource: removeMember()");
        try {
            groupSessionBeanLocal.removeMember(groupId, userId);

            return Response.status(Status.OK).build();
        
        } catch (InvalidRoleException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
                return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("updateStatus/{groupId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateStatus(@PathParam("groupId") Long groupId, @QueryParam("status") String status) {
        System.out.println("******** GroupResource: updateStatus()");
        try {
            groupSessionBeanLocal.updateStatus(groupId, status);

            return Response.status(Status.OK).build();
        
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("addAdmin/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response addAdmin(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** GroupResource: addAdmin()");
        try {
            groupSessionBeanLocal.addAdmin(groupId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("removeAdmin/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeAdmin(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** GroupResource: removeAdmin()");
        try {
            groupSessionBeanLocal.removeAdmin(groupId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("changeOwner/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeOwner(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** GroupResource: changeOwner()");
        try {
            groupSessionBeanLocal.changeOwner(groupId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("deleteGroup/{groupId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteGroup(@PathParam("groupId") Long groupId) {
        System.out.println("******** GroupResource: deleteGroup()");
        try {
            groupSessionBeanLocal.deleteGroup(groupId);

            return Response.status(Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("/update")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateGroup(GroupEntity group) {
        System.out.println("******** GroupResource: updateGroup()");
        try {
            groupSessionBeanLocal.updateGroup(group);
            return Response.status(204).build();
        } catch(NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("/getGroupStatusList")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroupStatusList() {
        System.out.println("******** GroupResource: getGroupStatusList()");
        GroupStatusEnum[] enumList = GroupStatusEnum.values();
        
        return Response.status(Response.Status.OK).entity(enumList).build();
    @Path("deleteGroup/{groupId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteGroup(@PathParam("groupId") Long groupId) {
        System.out.println("******** groupResource: deleteGroup()");
        try {
            groupSessionBeanLocal.deleteGroup(groupId);
            return Response.status(Response.Status.OK).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("/update")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateGroup(GroupEntity group) {
        System.out.println("******** GroupResource: updateGroup()");
        try {
            groupSessionBeanLocal.updateGroup(group);
            return Response.status(204).build();
        } catch(NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

//    @Path("createNewGroupReview")
//    @PUT
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response createNewGroupReview(CreateGroupReviewReq createGroupReviewReq) {
//        System.out.println("******** GroupResource: createNewGroupReview()");
//        if (createGroupReviewReq != null) {
//            System.out.println("Group: " + createGroupReviewReq.getReview());
//            try {
//                Long reviewId = groupSessionBeanLocal.createNewGroupReview(createGroupReviewReq.getReview(), createGroupReviewReq.getGroup(),createGroupReviewReq.getFrom());
//                CreateGroupReviewRsp createGroupReviewRsp = new CreateGroupReviewRsp(reviewId);
//                System.out.println("******** Group created");
//                return Response.status(Status.OK).entity(createGroupReviewRsp).build();
//            } catch (CreateGroupReviewException ex) {
//                ErrorRsp errorRsp = new ErrorRsp("Invalid request");
//            
//                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
//            }
//        } else {
//            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
//            
//            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
//        }
//    }
    
//    @Path("createNewUserReview")
//    @PUT
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response createNewUserReview(CreateUserReviewReq createUserReviewReq) {
//        System.out.println("******** GroupResource: createNewGroupReview()");
//        if (createUserReviewReq != null) {
//            System.out.println("Group: " + createUserReviewReq.getReview());
//            try {
//                Long reviewId = groupSessionBeanLocal.createNewUserReview(createUserReviewReq.getReview(), createUserReviewReq.getGroup(),createUserReviewReq.getFrom(), createUserReviewReq.getTo());
//                CreateUserReviewRsp createUserReviewRsp = new CreateUserReviewRsp(reviewId);
//                System.out.println("******** Group created");
//                return Response.status(Status.OK).entity(createUserReviewRsp).build();
//            } catch (CreateUserReviewException ex) {
//                ErrorRsp errorRsp = new ErrorRsp("Invalid request");
//            
//                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
//            }
//        } else {
//            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
//            
//            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
//        }
//    }
    
//    @GET
//    @Path("/groupreviews/{groupId}")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getGroupReviews(@PathParam("groupId") Long groupId) {
//        try {
//            List<ReviewEntity> reviews = groupSessionBeanLocal.getGroupReviews(groupId);
//            List<ReviewEntity> groupReviewsResponse = getGroupReviewsResponse(reviews);
//            System.out.println(groupReviewsResponse);
//            return Response.status(200).entity(groupReviewsResponse).build();
//        } catch (NoResultException ex) {
//            JsonObject exception = Json.createObjectBuilder()
//                    .add("error", ex.getMessage())
//                    .build();
//            return Response.status(404).entity(exception).build();
//        }
//    }
    
//    private List<ReviewEntity> getGroupReviewsResponse(List<ReviewEntity> reviews){
//         List<ReviewEntity> groupReviewsResponse = new ArrayList<>();
//        for (ReviewEntity reviewEntity : reviews) {
//            if(reviewEntity.getTo() == null){
////            UserEntity to = new UserEntity();
////            to.setUserId(reviewEntity.getTo().getUserId());
////            to.setFirstName(reviewEntity.getTo().getFirstName());
////            to.setLastName(reviewEntity.getTo().getLastName());
////            to.setProfilePicture(reviewEntity.getTo().getProfilePicture());
//            UserEntity from = new UserEntity();
//            from.setUserId(reviewEntity.getFrom().getUserId());
//            from.setFirstName(reviewEntity.getFrom().getFirstName());
//            from.setLastName(reviewEntity.getFrom().getLastName());
//            from.setProfilePicture(reviewEntity.getFrom().getProfilePicture());
//            ReviewEntity temp = new ReviewEntity();
//            GroupEntity group = new GroupEntity();
//            group.setGroupId(reviewEntity.getGroup().getGroupId());
//            group.setName(reviewEntity.getGroup().getName());
//            temp.setReviewId(reviewEntity.getReviewId());
//            temp.setTitle(reviewEntity.getTitle());
//            temp.setReviewField(reviewEntity.getReviewField());
//            temp.setRating(reviewEntity.getRating());
////            temp.setTo(to);
//            temp.setFrom(from);
//            temp.setGroup(group);
//            groupReviewsResponse.add(temp);
//            }
//        }
//        return groupReviewsResponse;
//    }
    
    private GroupSessionBeanLocal lookupGroupSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (GroupSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/GroupSessionBean!ejb.session.stateless.GroupSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
