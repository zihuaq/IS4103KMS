/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.CreateProjectException;
import Exception.CreateProjectReviewException;
import Exception.CreateUserReviewException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import ejb.session.stateless.ProjectSessionBeanLocal;
import entity.ActivityEntity;
import entity.DonationEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.ReviewEntity;
import entity.TaskEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
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
import util.enumeration.ProjectStatusEnum;
import ws.restful.model.CreateProjectReq;
import ws.restful.model.CreateProjectReviewReq;
import ws.restful.model.CreateProjectReviewRsp;
import ws.restful.model.CreateProjectRsp;
import ws.restful.model.CreateUserReviewReq;
import ws.restful.model.CreateUserReviewRsp;
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
        System.out.println("******** ProjectResource: getAllProject()");
        List<ProjectEntity> projects = projectSessionBeanLocal.retrieveAllProject();
        for (ProjectEntity p : projects) {
            p.setProjectOwner(null);
            p.getProjectMembers().clear();
            p.getProjectAdmins().clear();
            p.getActivities().clear();
            p.getHumanResourcePostings().clear();
            p.getMaterialResourcePostings().clear();
            p.getTasks().clear();
            p.getPosts().clear();
            p.getReviews().clear();
            p.getDonations().clear();
        }
        return Response.status(Status.OK).entity(new RetrieveAllProjectRsp(projects)).build();
    }

    @Path("createNewProject")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewProject(CreateProjectReq createProjectReq) {
        System.out.println("******** ProjectResource: createNewProject()");
        if (createProjectReq != null) {
            System.out.println("Project: " + createProjectReq.getNewProject());
            try {
                Long projectId = projectSessionBeanLocal.createNewProject(createProjectReq.getNewProject(), createProjectReq.getOwnerId(), createProjectReq.getTagIds());
                CreateProjectRsp createProjectRsp = new CreateProjectRsp(projectId);
                System.out.println("******** Project created");
                return Response.status(Status.OK).entity(createProjectRsp).build();
            } catch (CreateProjectException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @Path("{projectId}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProject(@PathParam("projectId") Long projectId) {
        System.out.println("******** ProjectResource: getProject()");
        try {
            ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
            project.getProjectOwner().setReviewsGiven(new ArrayList<>());
            project.getProjectOwner().setReviewsReceived(new ArrayList<>());
            project.getProjectOwner().setProjectsOwned(new ArrayList<>());
            project.getProjectOwner().setProjectsJoined(new ArrayList<>());
            project.getProjectOwner().setProjectsManaged(new ArrayList<>());
            project.getProjectOwner().setGroupsManaged((new ArrayList<>()));
            project.getProjectOwner().setPosts(new ArrayList<>());
            project.getProjectOwner().setGroupsOwned(new ArrayList<>());
            project.getProjectOwner().setGroupsJoined(new ArrayList<>());
            project.getProjectOwner().setGroupAdmins(new ArrayList<>());
            project.getProjectOwner().setBadges(new ArrayList<>());
            project.getProjectOwner().setMras(new ArrayList<>());
            project.getProjectOwner().setSkills(new ArrayList<>());
            project.getProjectOwner().setFollowing(new ArrayList<>());
            project.getProjectOwner().setFollowers(new ArrayList<>());
            project.getProjectOwner().setSdgs(new ArrayList<>());
            project.getProjectOwner().setFollowRequestMade(new ArrayList<>());
            project.getProjectOwner().setFollowRequestReceived(new ArrayList<>());
            project.getProjectOwner().setAffiliatedUsers(new ArrayList<>());
            project.getProjectOwner().setAffiliationRequestMade(new ArrayList<>());
            project.getProjectOwner().setAffiliationRequestReceived(new ArrayList<>());
            project.getProjectOwner().setHrpApplied(new ArrayList<>());
            project.getProjectOwner().setFulfillments(new ArrayList<>());
            project.getProjectOwner().setActivityJoined(new ArrayList<>());  
            project.getProjectOwner().setDonations(new ArrayList<>());
            for (UserEntity member : project.getProjectMembers()) {
                member.setReviewsGiven(new ArrayList<>());
                member.setReviewsReceived(new ArrayList<>());
                member.setProjectsOwned(new ArrayList<>());
                member.setProjectsJoined(new ArrayList<>());
                member.setProjectsManaged(new ArrayList<>());
                member.setGroupsManaged(new ArrayList<>());
                member.setPosts(new ArrayList<>());
                member.setGroupsOwned(new ArrayList<>());
                member.setGroupsJoined(new ArrayList<>());
                member.setGroupAdmins(new ArrayList<>());
                member.setBadges(new ArrayList<>());
                member.setMras(new ArrayList<>());
                member.setSkills(new ArrayList<>());
                member.setFollowing(new ArrayList<>());
                member.setFollowers(new ArrayList<>());
                member.setSdgs(new ArrayList<>());
                member.setFollowRequestMade(new ArrayList<>());
                member.setFollowRequestReceived(new ArrayList<>());
                member.setAffiliatedUsers(new ArrayList<>());
                member.setAffiliationRequestMade(new ArrayList<>());
                member.setAffiliationRequestReceived(new ArrayList<>());
                member.setHrpApplied(new ArrayList<>());
                member.setFulfillments(new ArrayList<>());
                member.setActivityJoined(new ArrayList<>());  
                member.setDonations(new ArrayList<>());
            }
            for (UserEntity admin : project.getProjectAdmins()) {
                admin.setReviewsGiven(new ArrayList<>());
                admin.setReviewsReceived(new ArrayList<>());
                admin.setProjectsOwned(new ArrayList<>());
                admin.setProjectsJoined(new ArrayList<>());
                admin.setProjectsManaged(new ArrayList<>());
                admin.setGroupsManaged(new ArrayList<>());
                admin.setPosts(new ArrayList<>());
                admin.setGroupsOwned(new ArrayList<>());
                admin.setGroupsJoined(new ArrayList<>());
                admin.setGroupAdmins(new ArrayList<>());
                admin.setBadges(new ArrayList<>());
                admin.setMras(new ArrayList<>());
                admin.setSkills(new ArrayList<>());
                admin.setFollowing(new ArrayList<>());
                admin.setFollowers(new ArrayList<>());
                admin.setSdgs(new ArrayList<>());
                admin.setFollowRequestMade(new ArrayList<>());
                admin.setFollowRequestReceived(new ArrayList<>());
                admin.setAffiliatedUsers(new ArrayList<>());
                admin.setAffiliationRequestMade(new ArrayList<>());
                admin.setAffiliationRequestReceived(new ArrayList<>());
                admin.setHrpApplied(new ArrayList<>());
                admin.setFulfillments(new ArrayList<>());
                admin.setActivityJoined(new ArrayList<>());  
                admin.setDonations(new ArrayList<>());
            }
            for (ActivityEntity ae : project.getActivities()) {
                ae.setProject(null);
                ae.getHumanResourcePostings().clear();
                ae.getMaterialResourcePostings().clear();
                ae.getJoinedUsers().clear();
            }
            for (HumanResourcePostingEntity hrp : project.getHumanResourcePostings()) {
                hrp.setActivity(null);
                hrp.setProject(null);
                hrp.getAppliedUsers().clear();
            }
            for (MaterialResourcePostingEntity mrp : project.getMaterialResourcePostings()) {
                mrp.getActivities().clear();
                mrp.setProject(null);
                mrp.getFulfillments().clear();
            }
            for (TaskEntity task : project.getTasks()) {
                task.setProject(null);
                task.setParentTask(null);
            }
            for (PostEntity post : project.getPosts()) {
                post.setPostOwner(null);
                post.setProject(null);
            }
            for (ReviewEntity review: project.getReviews()) {
                review.setProject(null);
                review.setFrom(null);
                review.setTo(null);
            }
            for (DonationEntity donation: project.getDonations()) {
                donation.setProject(null);
            }
            return Response.status(Status.OK).entity(project).build();
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }

    }
    
    @Path("joinProject/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response joinProject(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        System.out.println("******** ProjectResource: joinProject()");
        try {
            projectSessionBeanLocal.joinProject(projectId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        } 
    }
    
    @Path("removeMember/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeMember(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        System.out.println("******** ProjectResource: removeMember()");
        try {
            projectSessionBeanLocal.removeMember(projectId, userId);

            return Response.status(Status.OK).build();
        
        } catch (InvalidRoleException ex) {
                ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
                return Response.status(Response.Status.BAD_REQUEST).entity(errorRsp).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("updateStatus/{projectId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateStatus(@PathParam("projectId") Long projectId, @QueryParam("status") String status) {
        System.out.println("******** ProjectResource: updateStatus()");
        try {
            projectSessionBeanLocal.updateStatus(projectId, status);

            return Response.status(Status.OK).build();
        
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("addAdmin/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response addAdmin(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        System.out.println("******** ProjectResource: addAdmin()");
        try {
            projectSessionBeanLocal.addAdmin(projectId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("removeAdmin/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response removeAdmin(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        System.out.println("******** ProjectResource: removeAdmin()");
        try {
            projectSessionBeanLocal.removeAdmin(projectId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("changeOwner/{projectId}/{userId}")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response changeOwner(@PathParam("projectId") Long projectId, @PathParam("userId") Long userId) {
        System.out.println("******** ProjectResource: changeOwner()");
        try {
            projectSessionBeanLocal.changeOwner(projectId, userId);

            return Response.status(Status.OK).build();
            
        } catch (NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("deleteProject/{projectId}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteProject(@PathParam("projectId") Long projectId) {
        System.out.println("******** ProjectResource: deleteProject()");
        try {
            projectSessionBeanLocal.deleteProject(projectId);

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
    public Response updateProject(ProjectEntity project) {
        System.out.println("******** ProjectResource: updateProject()");
        try {
            projectSessionBeanLocal.updateProject(project);
            return Response.status(204).build();
        } catch(NoResultException ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @Path("/getProjectStatusList")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectStatusList() {
        System.out.println("******** ProjectResource: getProjectStatusList()");
        ProjectStatusEnum[] enumList = ProjectStatusEnum.values();
        
        return Response.status(Response.Status.OK).entity(enumList).build();
    }

    @Path("createNewProjectReview")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewProjectReview(CreateProjectReviewReq createProjectReviewReq) {
        System.out.println("******** ProjectResource: createNewProjectReview()");
        if (createProjectReviewReq != null) {
            System.out.println("Project: " + createProjectReviewReq.getReview());
            try {
                Long reviewId = projectSessionBeanLocal.createNewProjectReview(createProjectReviewReq.getReview(), createProjectReviewReq.getProject(),createProjectReviewReq.getFrom());
                CreateProjectReviewRsp createProjectReviewRsp = new CreateProjectReviewRsp(reviewId);
                System.out.println("******** Project created");
                return Response.status(Status.OK).entity(createProjectReviewRsp).build();
            } catch (CreateProjectReviewException ex) {
                ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @Path("createNewUserReview")
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createNewUserReview(CreateUserReviewReq createUserReviewReq) {
        System.out.println("******** ProjectResource: createNewProjectReview()");
        if (createUserReviewReq != null) {
            System.out.println("Project: " + createUserReviewReq.getReview());
            try {
                Long reviewId = projectSessionBeanLocal.createNewUserReview(createUserReviewReq.getReview(), createUserReviewReq.getProject(),createUserReviewReq.getFrom(), createUserReviewReq.getTo());
                CreateUserReviewRsp createUserReviewRsp = new CreateUserReviewRsp(reviewId);
                System.out.println("******** Project created");
                return Response.status(Status.OK).entity(createUserReviewRsp).build();
            } catch (CreateUserReviewException ex) {
                ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build(); 
            }
        } else {
            ErrorRsp errorRsp = new ErrorRsp("Invalid request");
            
            return Response.status(Status.BAD_REQUEST).entity(errorRsp).build(); 
        }
    }
    
    @GET
    @Path("/projectreviews/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectReviews(@PathParam("projectId") Long projectId) {
        try {
            List<ReviewEntity> reviews = projectSessionBeanLocal.getProjectReviews(projectId);
            List<ReviewEntity> projectReviewsResponse = getProjectReviewsResponse(reviews);
            System.out.println(projectReviewsResponse);
            return Response.status(200).entity(projectReviewsResponse).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    private List<ReviewEntity> getProjectReviewsResponse(List<ReviewEntity> reviews){
         List<ReviewEntity> projectReviewsResponse = new ArrayList<>();
        for (ReviewEntity reviewEntity : reviews) {
            if(reviewEntity.getTo() == null){
//            UserEntity to = new UserEntity();
//            to.setUserId(reviewEntity.getTo().getUserId());
//            to.setFirstName(reviewEntity.getTo().getFirstName());
//            to.setLastName(reviewEntity.getTo().getLastName());
//            to.setProfilePicture(reviewEntity.getTo().getProfilePicture());
            UserEntity from = new UserEntity();
            from.setUserId(reviewEntity.getFrom().getUserId());
            from.setFirstName(reviewEntity.getFrom().getFirstName());
            from.setLastName(reviewEntity.getFrom().getLastName());
            from.setProfilePicture(reviewEntity.getFrom().getProfilePicture());
            ReviewEntity temp = new ReviewEntity();
            ProjectEntity project = new ProjectEntity();
            project.setProjectId(reviewEntity.getProject().getProjectId());
            project.setName(reviewEntity.getProject().getName());
            temp.setReviewId(reviewEntity.getReviewId());
            temp.setTitle(reviewEntity.getTitle());
            temp.setReviewField(reviewEntity.getReviewField());
            temp.setRating(reviewEntity.getRating());
//            temp.setTo(to);
            temp.setFrom(from);
            temp.setProject(project);
            projectReviewsResponse.add(temp);
            }
        }
        return projectReviewsResponse;
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
