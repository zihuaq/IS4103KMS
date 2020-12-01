/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
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
}
