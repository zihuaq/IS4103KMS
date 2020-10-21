/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import ejb.session.stateless.GroupSessionBeanLocal;
import ejb.session.stateless.PostSessionBeanLocal;
import ejb.session.stateless.ProjectSessionBeanLocal;
import ejb.session.stateless.ReportSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.GroupEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.ReportEntity;
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
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;
import ws.restful.model.ErrorRsp;
import ws.restful.model.PassGroupReportVerdictReq;
import ws.restful.model.PassProfileReportVerdictReq;
import ws.restful.model.PassProjectReportVerdictReq;

/**
 * REST Web Service
 *
 * @author Cassie
 */
@Path("report")
public class ReportResource {

    PostSessionBeanLocal postSessionBean = lookupPostSessionBeanLocal();

    GroupSessionBeanLocal groupSessionBean = lookupGroupSessionBeanLocal();

    ProjectSessionBeanLocal projectSessionBean = lookupProjectSessionBeanLocal();

    UserSessionBeanLocal userSessionBean = lookupUserSessionBeanLocal();

    ReportSessionBeanLocal reportSessionBean = lookupReportSessionBeanLocal();
    
    
    
    @Context
    private UriInfo context;

    /**
     * Creates a new instance of ReportResource
     */
    public ReportResource() {
    }

    @POST
    @Path("/create")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createReport(ReportEntity report) {
        try {
            reportSessionBean.createNewReport(report);
            return Response.status(200).entity(report).build();
        } catch (Exception ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }
    
    @POST
    @Path("/reportProject")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportProject(ReportEntity report) {
        System.out.println("******** ReportResource: reportProject()");
        try {
            reportSessionBean.reportProject(report);
            
            return Response.status(Response.Status.OK).entity(report).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    @POST
    @Path("/reportGroup")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportGroup(ReportEntity report) {
        System.out.println("******** ReportResource: reportProject()");
        try {
            reportSessionBean.reportGroup(report);
            
            return Response.status(Response.Status.OK).entity(report).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
    
    @GET
    @Path("/getProfileReports")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProfileReports() {
        System.out.println("******** ReportResource: getProfileReports");
        try {
            List<ReportEntity> profileReports = reportSessionBean.getProfileReports();
            List<ReportEntity> profileReportsResponse = getProfileReportResponse(profileReports);
            return Response.status(Response.Status.OK).entity(profileReportsResponse).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
     private List<ReportEntity> getProfileReportResponse(List<ReportEntity> reports){
         List<ReportEntity> profileReportResponse = new ArrayList<>();
        for (ReportEntity reportEntity : reports) {
            UserEntity reportOwner = new UserEntity();
            reportOwner.setUserId(reportEntity.getReportOwner().getUserId());
            reportOwner.setFirstName(reportEntity.getReportOwner().getFirstName());
            reportOwner.setLastName(reportEntity.getReportOwner().getLastName());
            reportOwner.setProfilePicture(reportEntity.getReportOwner().getProfilePicture());
            UserEntity reportedUser = new UserEntity();
            reportedUser.setUserId(reportEntity.getReportedUser().getUserId());
            reportedUser.setFirstName(reportEntity.getReportedUser().getFirstName());
            reportedUser.setLastName(reportEntity.getReportedUser().getLastName());
            reportedUser.setProfilePicture(reportEntity.getReportedUser().getProfilePicture());
            ReportEntity temp = new ReportEntity();
            temp.setReportId(reportEntity.getReportId());
            temp.setReportContent(reportEntity.getReportContent());
            temp.setReportTags(reportEntity.getReportTags());
            temp.setReportType(reportEntity.getReportType());
            temp.setResolved(reportEntity.getResolved());
            temp.setVerdictComments(reportEntity.getVerdictComments());
            temp.setReportOwner(reportOwner);
            temp.setReportedUser(reportedUser);
            profileReportResponse.add(temp);
        }
        return profileReportResponse;
    } 
     
     @POST
     @Path("passProfileReportVerdict")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     public Response passProfileReportVerdict(PassProfileReportVerdictReq passProfileReportVerdictReq) {
        try {
            UserEntity reportedUser = userSessionBean.getUserById(passProfileReportVerdictReq.getReport().getReportedUser().getUserId());
            reportSessionBean.updateReportVerdict(passProfileReportVerdictReq.getReport());
            if(!passProfileReportVerdictReq.getActive()){
                reportedUser.setIsActive(Boolean.FALSE);
                userSessionBean.updateUser(reportedUser);
                reportSessionBean.sentReportVerdictEmail(passProfileReportVerdictReq.getReport());
            }
            return Response.status(Status.OK).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
     
     @POST
     @Path("passProjectReportVerdict")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     public Response passProjectReportVerdict(PassProjectReportVerdictReq passProjectReportVerdictReq) {
        try {
            ProjectEntity reportedProject = projectSessionBean.getProjectById(passProjectReportVerdictReq.getReport().getReportedProject().getProjectId());
            reportSessionBean.updateReportVerdict(passProjectReportVerdictReq.getReport());
            if(!passProjectReportVerdictReq.getActive()){
                reportedProject.setIsActive(Boolean.FALSE);
                projectSessionBean.updateProject(reportedProject);
                reportSessionBean.sentReportVerdictEmail(passProjectReportVerdictReq.getReport());
            }
            return Response.status(Status.OK).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
     
     @POST
     @Path("passGroupReportVerdict")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     public Response passGroupReportVerdict(PassGroupReportVerdictReq passGroupReportVerdictReq) {
        try {
            GroupEntity reportedGroup = groupSessionBean.getGroupById(passGroupReportVerdictReq.getReport().getReportedGroup().getGroupId());
            reportSessionBean.updateReportVerdict(passGroupReportVerdictReq.getReport());
            if(!passGroupReportVerdictReq.getActive()){
                reportedGroup.setIsActive(Boolean.FALSE);
                groupSessionBean.updateGroup(reportedGroup);
                reportSessionBean.sentReportVerdictEmail(passGroupReportVerdictReq.getReport());
            }
            return Response.status(Status.OK).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
     
     @POST
     @Path("passPostReportVerdict")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     //not done
     public Response passPostReportVerdict(PassProfileReportVerdictReq passProfileReportVerdictReq) {
        try {
            UserEntity reportedUser = userSessionBean.getUserById(passProfileReportVerdictReq.getReport().getReportedUser().getUserId());
            reportSessionBean.updateReportVerdict(passProfileReportVerdictReq.getReport());
            if(!passProfileReportVerdictReq.getActive()){
                reportedUser.setIsActive(Boolean.FALSE);
                userSessionBean.updateUser(reportedUser);
                reportSessionBean.sentReportVerdictEmail(passProfileReportVerdictReq.getReport());
            }
            return Response.status(Status.OK).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
     
          
     @POST
     @Path("passCommentReportVerdict")
     @Consumes(MediaType.APPLICATION_JSON)
     @Produces(MediaType.APPLICATION_JSON)
     //not done
     public Response passCommentReportVerdict(PassProfileReportVerdictReq passProfileReportVerdictReq) {
        try {
            UserEntity reportedUser = userSessionBean.getUserById(passProfileReportVerdictReq.getReport().getReportedUser().getUserId());
            reportSessionBean.updateReportVerdict(passProfileReportVerdictReq.getReport());
            if(!passProfileReportVerdictReq.getActive()){
                reportedUser.setIsActive(Boolean.FALSE);
                userSessionBean.updateUser(reportedUser);
                reportSessionBean.sentReportVerdictEmail(passProfileReportVerdictReq.getReport());
            }
            return Response.status(Status.OK).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
     
    @GET
    @Path("/getProjectReports")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectReports() {
        System.out.println("******** ReportResource: getProjectReports");
        try {
            List<ReportEntity> projectReports = reportSessionBean.getProjectReports();
            List<ReportEntity> projectReportsResponse = getProjectReportResponse(projectReports);
            return Response.status(Response.Status.OK).entity(projectReportsResponse).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
     private List<ReportEntity> getProjectReportResponse(List<ReportEntity> reports){
         List<ReportEntity> projectReportResponse = new ArrayList<>();
        for (ReportEntity reportEntity : reports) {
            UserEntity reportOwner = new UserEntity();
            reportOwner.setUserId(reportEntity.getReportOwner().getUserId());
            reportOwner.setFirstName(reportEntity.getReportOwner().getFirstName());
            reportOwner.setLastName(reportEntity.getReportOwner().getLastName());
            reportOwner.setProfilePicture(reportEntity.getReportOwner().getProfilePicture());
            ProjectEntity reportedProject = new ProjectEntity();
            reportedProject.setProjectId(reportEntity.getReportedProject().getProjectId());
            reportedProject.setName(reportEntity.getReportedProject().getName());
            ReportEntity temp = new ReportEntity();
            temp.setReportId(reportEntity.getReportId());
            temp.setReportContent(reportEntity.getReportContent());
            temp.setReportTags(reportEntity.getReportTags());
            temp.setReportType(reportEntity.getReportType());
            temp.setResolved(reportEntity.getResolved());
            temp.setVerdictComments(reportEntity.getVerdictComments());
            temp.setReportOwner(reportOwner);
            temp.setReportedProject(reportedProject);
            projectReportResponse.add(temp);
        }
        return projectReportResponse;
    } 
     
    @GET
    @Path("/getGroupReports")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroupReports() {
        System.out.println("******** ReportResource: getGroupReports");
        try {
            List<ReportEntity> groupReports = reportSessionBean.getProjectReports();
            List<ReportEntity> groupReportsResponse = getGroupReportResponse(groupReports);
            return Response.status(Response.Status.OK).entity(groupReportsResponse).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
     private List<ReportEntity> getGroupReportResponse(List<ReportEntity> reports){
         List<ReportEntity> groupReportResponse = new ArrayList<>();
        for (ReportEntity reportEntity : reports) {
            UserEntity reportOwner = new UserEntity();
            reportOwner.setUserId(reportEntity.getReportOwner().getUserId());
            reportOwner.setFirstName(reportEntity.getReportOwner().getFirstName());
            reportOwner.setLastName(reportEntity.getReportOwner().getLastName());
            reportOwner.setProfilePicture(reportEntity.getReportOwner().getProfilePicture());
            GroupEntity reportedGroup = new GroupEntity();
            reportedGroup.setGroupId(reportEntity.getReportedGroup().getGroupId());
            reportedGroup.setName(reportEntity.getReportedGroup().getName());
            ReportEntity temp = new ReportEntity();
            temp.setReportId(reportEntity.getReportId());
            temp.setReportContent(reportEntity.getReportContent());
            temp.setReportTags(reportEntity.getReportTags());
            temp.setReportType(reportEntity.getReportType());
            temp.setResolved(reportEntity.getResolved());
            temp.setVerdictComments(reportEntity.getVerdictComments());
            temp.setReportOwner(reportOwner);
            temp.setReportedGroup(reportedGroup);
            groupReportResponse.add(temp);
        }
        return groupReportResponse;
    } 
     
    @GET
    @Path("/getPostReports")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getPostReports() {
        System.out.println("******** ReportResource: getPostReports");
        try {
            List<ReportEntity> postReports = reportSessionBean.getPostReports();
            List<ReportEntity> groupReportsResponse = getPostReportResponse(postReports);
            return Response.status(Response.Status.OK).entity(groupReportsResponse).build();
            
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }
    
     private List<ReportEntity> getPostReportResponse(List<ReportEntity> reports){
         List<ReportEntity> postReportResponse = new ArrayList<>();
        for (ReportEntity reportEntity : reports) {
            UserEntity reportOwner = new UserEntity();
            reportOwner.setUserId(reportEntity.getReportOwner().getUserId());
            reportOwner.setFirstName(reportEntity.getReportOwner().getFirstName());
            reportOwner.setLastName(reportEntity.getReportOwner().getLastName());
            reportOwner.setProfilePicture(reportEntity.getReportOwner().getProfilePicture());
            PostEntity reportedPost = new PostEntity();
            reportedPost.setPostId(reportEntity.getReportedPost().getPostId());
            //reportedPost.setName(reportEntity.getReportedGroup().getName());
            ReportEntity temp = new ReportEntity();
            temp.setReportId(reportEntity.getReportId());
            temp.setReportContent(reportEntity.getReportContent());
            temp.setReportTags(reportEntity.getReportTags());
            temp.setReportType(reportEntity.getReportType());
            temp.setResolved(reportEntity.getResolved());
            temp.setVerdictComments(reportEntity.getVerdictComments());
            temp.setReportOwner(reportOwner);
            temp.setReportedPost(reportedPost);
            postReportResponse.add(temp);
        }
        return postReportResponse;
    } 
    
    private ReportSessionBeanLocal lookupReportSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (ReportSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/ReportSessionBean!ejb.session.stateless.ReportSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    private UserSessionBeanLocal lookupUserSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (UserSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/UserSessionBean!ejb.session.stateless.UserSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
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

    private GroupSessionBeanLocal lookupGroupSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (GroupSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/GroupSessionBean!ejb.session.stateless.GroupSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    private PostSessionBeanLocal lookupPostSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (PostSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/PostSessionBean!ejb.session.stateless.PostSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

   
}
