/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourceAvailable;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface MaterialResourceAvailableSessionBeanLocal {

    public void createMaterialResourceAvailable(MaterialResourceAvailable materialResourceAvailable, long userId) throws NoResultException;

}
