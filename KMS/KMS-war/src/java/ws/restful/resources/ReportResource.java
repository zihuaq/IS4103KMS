/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import ejb.session.stateless.ActivitySessionBeanLocal;
import ejb.session.stateless.GroupSessionBeanLocal;
import ejb.session.stateless.PostSessionBeanLocal;
import ejb.session.stateless.ProjectSessionBeanLocal;
import ejb.session.stateless.ReportSessionBeanLocal;
import ejb.session.stateless.UserSessionBeanLocal;
import entity.GroupEntity;
import entity.PostCommentEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.ReportEntity;
import entity.ReviewEntity;
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

    ActivitySessionBeanLocal activitySessionBean = lookupActivitySessionBeanLocal();

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
    @Path("/reportProfile")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportProfile(ReportEntity report) {
        System.out.println("******** ReportResource: reportProfile()");
        try {
            ReportEntity reportResponse = reportSessionBean.reportProfile(report);
            return Response.status(200).entity(reportResponse).build();
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
            ReportEntity reportResponse = reportSessionBean.reportProject(report);
            return Response.status(Response.Status.OK).entity(reportResponse).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @POST
    @Path("/reportGroup")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportGroup(ReportEntity report) {
        System.out.println("******** ReportResource: reportGroup()");
        try {
            ReportEntity reportResponse = reportSessionBean.reportGroup(report);
            return Response.status(Response.Status.OK).entity(reportResponse).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @POST
    @Path("/reportPost")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportPost(ReportEntity report) {
        System.out.println("******** ReportResource: reportPost()");
        try {
            ReportEntity reportResponse = reportSessionBean.reportPost(report);
            return Response.status(Response.Status.OK).entity(reportResponse).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @POST
    @Path("/reportComment")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportComment(ReportEntity report) {
        System.out.println("******** ReportResource: reportComment()");
        try {
            ReportEntity reportResponse = reportSessionBean.reportComment(report);
            return Response.status(Response.Status.OK).entity(reportResponse).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @POST
    @Path("/reportReview")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response reportReview(ReportEntity report) {
        System.out.println("******** ReportResource: reportReview()");
        try {
            ReportEntity reportResponse = reportSessionBean.reportReview(report);
            return Response.status(Response.Status.OK).entity(reportResponse).build();
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

    private List<ReportEntity> getProfileReportResponse(List<ReportEntity> reports) {
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
            if (!passProfileReportVerdictReq.getActive()) {
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
            if (!passProjectReportVerdictReq.getActive()) {
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
            if (!passGroupReportVerdictReq.getActive()) {
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
    public Response passPostReportVerdict(PassProfileReportVerdictReq passProfileReportVerdictReq) {
        try {
            System.out.println("**************reportResource: passPostReportVerdict");
            PostEntity reportedPost = postSessionBean.getPostById(passProfileReportVerdictReq.getReport().getReportedPost().getPostId());
            //reportSessionBean.updateReportVerdict(passProfileReportVerdictReq.getReport());
            Long reportId = 0L;
            if (!passProfileReportVerdictReq.getActive()) {
                System.out.println("**************passPostReportVerdict: active = false");
                reportSessionBean.sentReportVerdictEmail(passProfileReportVerdictReq.getReport());
                System.out.println("**************passPostReportVerdict email sent");
                reportId = passProfileReportVerdictReq.getReport().getReportId();
                reportSessionBean.deleteReport(passProfileReportVerdictReq.getReport().getReportId());
                System.out.println("**************passPostReportVerdict delete report");
                postSessionBean.deletePostById(reportedPost.getPostId());
                System.out.println("**************passPostReportVerdict delete post");
            } else {
                reportId = passProfileReportVerdictReq.getReport().getReportId();
                reportSessionBean.deleteReport(passProfileReportVerdictReq.getReport().getReportId());
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
    public Response passCommentReportVerdict(PassProfileReportVerdictReq passProfileReportVerdictReq) {
        try {
            PostCommentEntity reportedComment = postSessionBean.getPostCommentById(passProfileReportVerdictReq.getReport().getReportedComment().getPostCommentId());
            //reportSessionBean.updateReportVerdict(passProfileReportVerdictReq.getReport());
            Long reportId = 0L;
            if (!passProfileReportVerdictReq.getActive()) {
                reportSessionBean.sentReportVerdictEmail(passProfileReportVerdictReq.getReport());
                reportId = passProfileReportVerdictReq.getReport().getReportId();
                reportSessionBean.deleteReport(passProfileReportVerdictReq.getReport().getReportId());
                postSessionBean.deleteComment(reportedComment.getPostCommentId());
            } else {
                reportId = passProfileReportVerdictReq.getReport().getReportId();
                reportSessionBean.deleteReport(passProfileReportVerdictReq.getReport().getReportId());

            }

            return Response.status(Status.OK).build();
        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    @POST
    @Path("passReviewReportVerdict")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response passReviewReportVerdict(PassProfileReportVerdictReq passProfileReportVerdictReq) {
        try {
            ReviewEntity reportedReview = activitySessionBean.getReviewById(passProfileReportVerdictReq.getReport().getReportedReview().getReviewId());
            //reportSessionBean.updateReportVerdict(passProfileReportVerdictReq.getReport());
            Long reportId = 0L;
            if (!passProfileReportVerdictReq.getActive()) {
                reportSessionBean.sentReportVerdictEmail(passProfileReportVerdictReq.getReport());
                reportId = passProfileReportVerdictReq.getReport().getReportId();
                reportSessionBean.deleteReport(passProfileReportVerdictReq.getReport().getReportId());
                activitySessionBean.deleteReview(reportedReview.getReviewId());
            } else {
                reportId = passProfileReportVerdictReq.getReport().getReportId();
                reportSessionBean.deleteReport(passProfileReportVerdictReq.getReport().getReportId());

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

    private List<ReportEntity> getProjectReportResponse(List<ReportEntity> reports) {
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
            List<ReportEntity> groupReports = reportSessionBean.getGroupReports();
            List<ReportEntity> groupReportsResponse = getGroupReportResponse(groupReports);
            return Response.status(Response.Status.OK).entity(groupReportsResponse).build();

        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private List<ReportEntity> getGroupReportResponse(List<ReportEntity> reports) {
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
            List<ReportEntity> postReportsResponse = getPostReportResponse(postReports);
            return Response.status(Response.Status.OK).entity(postReportsResponse).build();

        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private List<ReportEntity> getPostReportResponse(List<ReportEntity> reports) {
        List<ReportEntity> postReportResponse = new ArrayList<>();
        for (ReportEntity reportEntity : reports) {
            UserEntity reportOwner = new UserEntity();
            reportOwner.setUserId(reportEntity.getReportOwner().getUserId());
            reportOwner.setFirstName(reportEntity.getReportOwner().getFirstName());
            reportOwner.setLastName(reportEntity.getReportOwner().getLastName());
            reportOwner.setProfilePicture(reportEntity.getReportOwner().getProfilePicture());
            PostEntity reportedPost = new PostEntity();
            reportedPost.setPostId(reportEntity.getReportedPost().getPostId());
            reportedPost.setText(reportEntity.getReportedPost().getText());
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

    @GET
    @Path("/getCommentReports")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommentReports() {
        System.out.println("******** ReportResource: getCommentReports");
        try {
            List<ReportEntity> commentReports = reportSessionBean.getCommentReports();
            List<ReportEntity> commentReportsResponse = getCommentReportResponse(commentReports);
            return Response.status(Response.Status.OK).entity(commentReportsResponse).build();

        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private List<ReportEntity> getCommentReportResponse(List<ReportEntity> reports) {
        List<ReportEntity> postReportResponse = new ArrayList<>();
        for (ReportEntity reportEntity : reports) {
            UserEntity reportOwner = new UserEntity();
            reportOwner.setUserId(reportEntity.getReportOwner().getUserId());
            reportOwner.setFirstName(reportEntity.getReportOwner().getFirstName());
            reportOwner.setLastName(reportEntity.getReportOwner().getLastName());
            reportOwner.setProfilePicture(reportEntity.getReportOwner().getProfilePicture());
            PostCommentEntity reportedPostComment = new PostCommentEntity();
            reportedPostComment.setPostCommentId(reportEntity.getReportedComment().getPostCommentId());
            reportedPostComment.setComment(reportEntity.getReportedComment().getComment());
            ReportEntity temp = new ReportEntity();
            temp.setReportId(reportEntity.getReportId());
            temp.setReportContent(reportEntity.getReportContent());
            temp.setReportTags(reportEntity.getReportTags());
            temp.setReportType(reportEntity.getReportType());
            temp.setResolved(reportEntity.getResolved());
            temp.setVerdictComments(reportEntity.getVerdictComments());
            temp.setReportOwner(reportOwner);
            temp.setReportedComment(reportedPostComment);
            postReportResponse.add(temp);
        }
        return postReportResponse;
    }

    @GET
    @Path("/getReviewReports")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReviewReports() {
        System.out.println("******** ReportResource: getReviewReports");
        try {
            List<ReportEntity> reviewReports = reportSessionBean.getReviewReports();
            List<ReportEntity> reviewReportsResponse = getReviewReportResponse(reviewReports);
            return Response.status(Response.Status.OK).entity(reviewReportsResponse).build();

        } catch (Exception ex) {
            ErrorRsp errorRsp = new ErrorRsp(ex.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorRsp).build();
        }
    }

    private List<ReportEntity> getReviewReportResponse(List<ReportEntity> reports) {
        List<ReportEntity> postReportResponse = new ArrayList<>();
        for (ReportEntity reportEntity : reports) {
            UserEntity reportOwner = new UserEntity();
            reportOwner.setUserId(reportEntity.getReportOwner().getUserId());
            reportOwner.setFirstName(reportEntity.getReportOwner().getFirstName());
            reportOwner.setLastName(reportEntity.getReportOwner().getLastName());
            reportOwner.setProfilePicture(reportEntity.getReportOwner().getProfilePicture());

            ReviewEntity reportedReview = new ReviewEntity();
            reportedReview.setReviewId(reportEntity.getReportedReview().getReviewId());
            reportedReview.setTitle(reportEntity.getReportedReview().getTitle());
            reportedReview.setReviewField(reportEntity.getReportedReview().getReviewField());

            ReportEntity temp = new ReportEntity();
            temp.setReportId(reportEntity.getReportId());
            temp.setReportContent(reportEntity.getReportContent());
            temp.setReportTags(reportEntity.getReportTags());
            temp.setReportType(reportEntity.getReportType());
            temp.setResolved(reportEntity.getResolved());
            temp.setVerdictComments(reportEntity.getVerdictComments());
            temp.setReportOwner(reportOwner);
            temp.setReportedReview(reportedReview);
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

    private PostSessionBeanLocal lookupPostSessionBeanLocal1() {
        try {
            javax.naming.Context c = new InitialContext();
            return (PostSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/PostSessionBean!ejb.session.stateless.PostSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
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
