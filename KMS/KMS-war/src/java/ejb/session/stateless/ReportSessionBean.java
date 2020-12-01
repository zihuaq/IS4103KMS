/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.GroupEntity;
import entity.PostCommentEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.ReportEntity;
import entity.ReviewEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import util.enumeration.ReportTypeEnum;

/**
 *
 * @author Cassie
 */
@Stateless
public class ReportSessionBean implements ReportSessionBeanLocal {

    @EJB
    private TagSessionBeanLocal tagSessionBean;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    

    @Override
    public ReportEntity reportProfile(ReportEntity report) throws NoResultException {
        UserEntity reportOwner = em.find(UserEntity.class, report.getReportOwner().getUserId());
        UserEntity reportedUser = em.find(UserEntity.class, report.getReportedUser().getUserId());
        if (reportOwner != null && reportedUser != null) {
            em.persist(report);
            em.flush();
            return report;
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    public ReportEntity getReportById(Long reportId) throws NoResultException{
       
        ReportEntity returnReport = em.find(ReportEntity.class, reportId);
        if(returnReport == null){
            throw new NoResultException("Repot not Found");
        }
        return returnReport;
        
    }
    
    @Override
    public ReportEntity reportProject(ReportEntity report) throws NoResultException {
        UserEntity reportOwner = em.find(UserEntity.class, report.getReportOwner().getUserId());
        ProjectEntity reportedProject = em.find(ProjectEntity.class, report.getReportedProject().getProjectId());
        if (reportOwner != null && reportedProject != null) {
            em.persist(report);
            em.flush();
            return report;
        } else if (reportedProject == null) {
            throw new NoResultException("Project not found");
        } else {
            throw new NoResultException("User not found");
        }
    }
    
 
    @Override
    public ReportEntity reportGroup(ReportEntity report) throws NoResultException {
        UserEntity reportOwner = em.find(UserEntity.class, report.getReportOwner().getUserId());
        GroupEntity reportedGroup = em.find(GroupEntity.class, report.getReportedGroup().getGroupId());
        
        if (reportOwner != null && reportedGroup != null) {
            em.persist(report);
            em.flush();
            return report;
        } else if (reportedGroup == null) {
            throw new NoResultException("Group not found");
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public ReportEntity reportPost(ReportEntity report) throws NoResultException {
        UserEntity reportOwner = em.find(UserEntity.class, report.getReportOwner().getUserId());
        PostEntity reportedPost = em.find(PostEntity.class, report.getReportedPost().getPostId());
        if (reportOwner != null && reportedPost != null) {
            em.persist(report);
            em.flush();
            return report;
        } else if (reportedPost == null) {
            throw new NoResultException("Post not found");
        } else {
            throw new NoResultException("User not found");
        }
    }
    
     public ReportEntity createPostReport(ReportEntity report, List<Long> tagIds) throws NoResultException {
        UserEntity reportOwner = em.find(UserEntity.class, report.getReportOwner().getUserId());
        PostEntity reportedPost = em.find(PostEntity.class, report.getReportedPost().getPostId());
        for (Long tagId : tagIds) {
                TagEntity tag = tagSessionBean.getTagById(tagId);
                report.getReportTags().add(tag);
            }
        if (reportOwner != null && reportedPost != null) {
            em.persist(report);
            em.flush();
            return report;
        } else if (reportedPost == null) {
            throw new NoResultException("Post not found");
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public ReportEntity reportComment(ReportEntity report) throws NoResultException {
        UserEntity reportOwner = em.find(UserEntity.class, report.getReportOwner().getUserId());
        PostCommentEntity reportedComment = em.find(PostCommentEntity.class, report.getReportedComment().getPostCommentId());
        if (reportOwner != null && reportedComment != null) {
            em.persist(report);
            em.flush();
            return report;
        } else if (reportedComment == null) {
            throw new NoResultException("Comment not found");
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public ReportEntity reportReview(ReportEntity report) throws NoResultException {
        UserEntity reportOwner = em.find(UserEntity.class, report.getReportOwner().getUserId());
        ReviewEntity reportedReview = em.find(ReviewEntity.class, report.getReportedReview().getReviewId());
        if (reportOwner != null && reportedReview != null) {
            em.persist(report);
            em.flush();
            return report;
        } else if (reportedReview == null) {
            throw new NoResultException("Comment not found");
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public void updateReportVerdict(ReportEntity updatedReport) throws NoResultException{
        ReportEntity report = em.find(ReportEntity.class, updatedReport.getReportId());
        if(report == null){
            throw new NoResultException("Report not found");
        }
        
        report.setVerdictComments(updatedReport.getVerdictComments());
        report.setResolved(Boolean.TRUE);
    }
    
    @Override
    public List<ReportEntity> getAllReports(){
        List<ReportEntity> reports = em.createQuery("SELECT r FROM ReportEntity r").getResultList();
        
        return reports;
    }
    
    @Override
    public List<ReportEntity> getProfileReports() throws NoResultException{
        List<ReportEntity> reports = getAllReports();
        if(reports.size() < 1){
            throw new NoResultException("No reports");
        }
        List<ReportEntity> profileReports = new ArrayList<>();
        for(ReportEntity report: reports){
            if(report.getReportType().equals(ReportTypeEnum.PROFILE)){
                profileReports.add(report);
            }
        }
        if(profileReports.size() < 1){
            throw new NoResultException("No profile reports");
        }
        return profileReports;
    }
    
    
    @Override
    public List<ReportEntity> getProjectReports() throws NoResultException{
        List<ReportEntity> reports = getAllReports();
        if(reports.size() < 1){
            throw new NoResultException("No reports");
        }
        List<ReportEntity> projectReports = new ArrayList<>();
        for(ReportEntity report: reports){
            if(report.getReportType().equals(ReportTypeEnum.PROJECT)){
                projectReports.add(report);
            }
        }
        if(projectReports.size() < 1){
            throw new NoResultException("No profile reports");
        }
        return projectReports;
    }
    
    @Override
    public List<ReportEntity> getGroupReports() throws NoResultException{
        List<ReportEntity> reports = getAllReports();
        if(reports.size() < 1){
            throw new NoResultException("No reports");
        }
        List<ReportEntity> groupReports = new ArrayList<>();
        for(ReportEntity report: reports){
            if(report.getReportType().equals(ReportTypeEnum.GROUP)){
                groupReports.add(report);
            }
        }
        if(groupReports.size() < 1){
            throw new NoResultException("No group reports");
        }
        return groupReports;
    }
    
    @Override
    public List<ReportEntity> getPostReports() throws NoResultException{
        List<ReportEntity> reports = getAllReports();
        if(reports.size() < 1){
            throw new NoResultException("No reports");
        }
        List<ReportEntity> postReports = new ArrayList<>();
        for(ReportEntity report: reports){
            if(report.getReportType().equals(ReportTypeEnum.POST)){
                postReports.add(report);
            }
        }
        if(postReports.size() < 1){
            throw new NoResultException("No post reports");
        }
        return postReports;
    }
    
    public void deleteReport(Long reportId) throws NoResultException{
        ReportEntity report = getReportById(reportId);
        em.remove(report);
    }
    
    @Override
    public List<ReportEntity> getCommentReports() throws NoResultException{
        List<ReportEntity> reports = getAllReports();
        if(reports.size() < 1){
            throw new NoResultException("No reports");
        }
        List<ReportEntity> commentReports = new ArrayList<>();
        for(ReportEntity report: reports){
            if(report.getReportType().equals(ReportTypeEnum.COMMENT)){
                commentReports.add(report);
            }
        }
        if(commentReports.size() < 1){
            throw new NoResultException("No comment reports");
        }
        return commentReports;
    }
    
    
    @Override
    public List<ReportEntity> getReviewReports() throws NoResultException{
        List<ReportEntity> reports = getAllReports();
        if(reports.size() < 1){
            throw new NoResultException("No reports");
        }
        List<ReportEntity> commentReports = new ArrayList<>();
        for(ReportEntity report: reports){
            if(report.getReportType().equals(ReportTypeEnum.REVIEW)){
                commentReports.add(report);
            }
        }
        if(commentReports.size() < 1){
            throw new NoResultException("No comment reports");
        }
        return commentReports;
    }
    
    public void sentReportVerdictEmail(ReportEntity report) throws NoResultException{
        final String username = "4103kms";
        final String password = "4103kmsemail";
        final String host = "localhost";

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.user", username);

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            ReportEntity currentReport = getReportById(report.getReportId());
            if(currentReport.getReportType() == ReportTypeEnum.PROFILE){
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress("4103kms@gmail.com"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(currentReport.getReportedUser().getEmail()));
                message.setSubject("Your KMS Account has been deactivated");
                message.setText("Dear User," +'\n' + "Your account has been deactivated for violating our terms of service" + '\n' + currentReport.getVerdictComments());

                Transport.send(message);
            }
            if(currentReport.getReportType() == ReportTypeEnum.PROJECT){
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress("4103kms@gmail.com"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(currentReport.getReportedProject().getProjectOwner().getEmail()));
                message.setSubject("The KMS Project " + currentReport.getReportedProject().getName() + " has been deactivated");
                message.setText("Dear User," +'\n' + "Your project has been deactivated for violating our terms of service" + '\n' + currentReport.getVerdictComments());

                Transport.send(message);
            }
            if(currentReport.getReportType() == ReportTypeEnum.GROUP){
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress("4103kms@gmail.com"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(currentReport.getReportedGroup().getGroupOwner().getEmail()));
                message.setSubject("The KMS Group " + currentReport.getReportedGroup().getName() + " has been deactivated");
                message.setText("Dear User," +'\n' + "Your group has been deactivated for violating our terms of service" + '\n' + currentReport.getVerdictComments());

                Transport.send(message);
            }
            if(currentReport.getReportType() == ReportTypeEnum.POST){
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress("4103kms@gmail.com"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(currentReport.getReportedPost().getPostOwner().getEmail()));
                message.setSubject("A post you created has been deleted");
                message.setText("Dear User," +'\n' + "Your post has been deleted for violating our terms of service" + '\n');

                Transport.send(message);
            }
            if(currentReport.getReportType() == ReportTypeEnum.COMMENT){
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress("4103kms@gmail.com"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(currentReport.getReportedComment().getCommentOwner().getEmail()));
                message.setSubject("A comment you created has been deleted");
                message.setText("Dear User," +'\n' + "Your comment has been deleted for violating our terms of service" + '\n');

                Transport.send(message);
            }
            if(currentReport.getReportType() == ReportTypeEnum.REVIEW){
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress("4103kms@gmail.com"));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(currentReport.getReportedReview().getFrom().getEmail()));
                message.setSubject("A review you created has been deleted");
                message.setText("Dear User," +'\n' + "Your review has been deleted for violating our terms of service" + '\n');

                Transport.send(message);
            }
            

            System.out.println("message sent");
        } catch (MessagingException ex) {
            throw new RuntimeException(ex);
        }
    }
}
