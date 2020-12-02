/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.DuplicateApplicationException;
import Exception.NoResultException;
import entity.ElectionApplicationEntity;
import entity.ElectionEntity;
import javax.ejb.Local;

/**
 *
 * @author Cassie
 */
@Local
public interface ElectionSessionBeanLocal {

    public boolean hasActiveElection();

    public ElectionEntity getActiveElection() throws NoResultException;

    public void createElection(ElectionEntity election) throws NoResultException;
    
    public void updateElection(ElectionEntity electionToUpdate) throws NoResultException;
    
    public void endElection(ElectionEntity election) throws NoResultException;
    
    public void createElectionApplication(ElectionApplicationEntity application) throws NoResultException, DuplicateApplicationException;
    
}
