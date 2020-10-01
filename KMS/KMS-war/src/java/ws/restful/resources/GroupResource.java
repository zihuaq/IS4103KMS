/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.CreateGroupException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import ejb.session.stateless.GroupSessionBeanLocal;
import entity.GroupEntity;
import entity.UserEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import ws.restful.model.CreateGroupReq;
import ws.restful.model.CreateGroupRsp;
import ws.restful.model.ErrorRsp;

/**
 * REST Web Service
 *
 * @author zeplh
 */
@Path("Group")
public class GroupResource {

    GroupSessionBeanLocal groupSessionBeanLocal = lookupGroupSessionBeanLocal();
    
    

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of GroupResource
     */
    public GroupResource() {
    }
    
    @Path("getAllGroups")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllGroups() {
        System.out.println("******** GroupResource: getAllGroup()");
        List<GroupEntity> group = groupSessionBeanLocal.retrieveAllGroup();
        for (GroupEntity g : group) {
            g.setGroupOwner(null);
            g.getGroupMembers().clear();
            g.getGroupAdmins().clear();
            //g.getPosts().clear();
        }
        return Response.status(Response.Status.OK).entity(group).build();
    }
    
    @Path("createNewGroup")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewProject(CreateGroupReq createGroupReq) {
        System.out.println("******** ProjectResource: createNewProject()");
        if (createGroupReq != null) {
            System.out.println("Group: " + createGroupReq.getGroup());
            try {
                Long groupId = groupSessionBeanLocal.createNewGroup(createGroupReq.getGroup(), createGroupReq.getUserId());
                CreateGroupRsp createGroupRsp = new CreateGroupRsp(groupId);
                System.out.println("******** Group created");
                return Response.status(Response.Status.OK).entity(createGroupRsp).build();
            } catch (CreateGroupException ex) {
                ErrorRsp errorRsp = new ErrorRsp("Invalid request: Error Create Group Exception");
            
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @Path("{groupId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroup(@PathParam("groupId") Long groupId) {
        System.out.println("******** GroupResource: createNewGroup()");
        GroupEntity group = groupSessionBeanLocal.getGroupById(groupId);
        group.getGroupOwner().getGroupsOwned().clear();
        group.getGroupOwner().getReviewsGiven().clear();
        group.getGroupOwner().getReviewsReceived().clear();
        group.getGroupOwner().getProjectsOwned().clear();
        group.getGroupOwner().getProjectsJoined().clear();
        group.getGroupOwner().getProjectsManaged().clear();
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
            member.getProjectsOwned().clear();
            member.getProjectsJoined().clear();
            member.getProjectsManaged().clear();
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
            admin.getProjectsOwned().clear();
            admin.getProjectsJoined().clear();
            admin.getProjectsManaged().clear();
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
        
//        for (PostEntity post : group.getPosts()) {
//            post.setPostOwner(null);
//            post.setProject(null);
//        }
        return Response.status(Response.Status.OK).entity(group).build();

    }
    
    @Path("joinGroup/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response joinGroup(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** groupResource: joinGroup()");
        try {
            groupSessionBeanLocal.joinGroup(groupId, userId);

            return Response.status(Response.Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        } 
    }
    
    @Path("removeMember/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeMember(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** GroupResource: removeMember()");
        try {
            groupSessionBeanLocal.removeMember(groupId, userId);

            return Response.status(Response.Status.OK).build();
        
        } catch (InvalidRoleException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
                return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("addGroupAdmin/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response addGroupAdmin(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** groupResource: addAdmin()");
        try {
            groupSessionBeanLocal.addAdmin(groupId, userId);

            return Response.status(Response.Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("removeAdmin/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeAdmin(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** groupResource: removeAdmin()");
        try {
            groupSessionBeanLocal.removeAdmin(groupId, userId);

            return Response.status(Response.Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("changeGroupOwner/{groupId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeGroupOwner(@PathParam("groupId") Long groupId, @PathParam("userId") Long userId) {
        System.out.println("******** GroupResource: changeGroupOwner()");
        try {
            groupSessionBeanLocal.changeOwner(groupId, userId);

            return Response.status(Response.Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

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
