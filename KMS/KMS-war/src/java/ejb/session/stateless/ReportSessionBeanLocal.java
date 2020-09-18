/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.ReportEntity;
import javax.ejb.Local;

/**
 *
 * @author Cassie
 */
@Local
public interface ReportSessionBeanLocal {
    
    public ReportEntity createNewReport(ReportEntity report) throws NoResultException;
    
}
