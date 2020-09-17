/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ReportEntity;
import entity.UserEntity;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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
}