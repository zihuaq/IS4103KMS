/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ReportEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Cassie
 */
@Local
public interface ReportSessionBeanLocal {
    
    public ReportEntity createNewReport(ReportEntity report) throws NoResultException;

    public ReportEntity reportProject(ReportEntity report) throws NoResultException;

    public List<ReportEntity> getProfileReports() throws NoResultException;

    public List<ReportEntity> getAllReports();

    public List<ReportEntity> getCommentReports() throws NoResultException;

    public List<ReportEntity> getPostReports() throws NoResultException;

    public List<ReportEntity> getGroupReports() throws NoResultException;

    public List<ReportEntity> getProjectReports() throws NoResultException;
    
}
