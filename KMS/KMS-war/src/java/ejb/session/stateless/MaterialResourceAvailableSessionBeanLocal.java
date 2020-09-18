/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import Exception.UserNotFoundException;
import entity.MaterialResourceAvailableEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface MaterialResourceAvailableSessionBeanLocal {

    public List<MaterialResourceAvailableEntity> createMaterialResourceAvailable(MaterialResourceAvailableEntity materialResourceAvailable) throws NoResultException;

    public MaterialResourceAvailableEntity updateMaterialResourceAvailable(MaterialResourceAvailableEntity materialResourceAvailable) throws NoResultException;
    
    public MaterialResourceAvailableEntity getMaterialResourceAvailableById(long mraId) throws NoResultException;
    
    public List<MaterialResourceAvailableEntity> getMaterialResourceAvailableForUser(long userId) throws UserNotFoundException;

    public List<MaterialResourceAvailableEntity> deleteMaterialResourceAvailableForUser(long userId, long mraId) throws NoResultException;
}
