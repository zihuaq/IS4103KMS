/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourceAvailableEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Cassie
 */
@Local
public interface MatchingSessionBeanLocal {
    
    public List<MaterialResourceAvailableEntity> getMatchesForMrp(long mrpId) throws NoResultException;
    
}
