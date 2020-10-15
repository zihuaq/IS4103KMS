/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ProjectEntity;
import entity.ReportEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import util.enumeration.ReportTypeEnum;

/**
 *
 * @author Cassie
 */
@Stateless
public class ReportSessionBean implements ReportSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public ReportEntity createNewReport(ReportEntity report) throws NoResultException {
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
            throw new NoResultException("No profile reports");
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
            throw new NoResultException("No profile reports");
        }
        return postReports;
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
            throw new NoResultException("No profile reports");
        }
        return commentReports;
    }
}
