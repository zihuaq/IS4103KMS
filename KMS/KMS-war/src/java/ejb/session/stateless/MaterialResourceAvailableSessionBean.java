package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourceAvailableEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author Jeremy
 */
@Stateless
public class MaterialResourceAvailableSessionBean implements MaterialResourceAvailableSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public void createMaterialResourceAvailable(MaterialResourceAvailableEntity materialResourceAvailable, long userId) throws NoResultException {
        UserEntity materialResourceAvailableOwner = em.find(UserEntity.class, userId);
        if (materialResourceAvailableOwner != null) {
            em.persist(materialResourceAvailable);
            materialResourceAvailable.setMaterialResourceAvailableOwner(materialResourceAvailableOwner);
            materialResourceAvailableOwner.getMras().add(materialResourceAvailable);
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public List<MaterialResourceAvailableEntity> getMaterialResourceAvailableForUser(long userId) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user != null) {
            return user.getMras();
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public void deleteMaterialResourceAvailableForUser(long userId, long mraId) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, userId);
        MaterialResourceAvailableEntity mra = em.find(MaterialResourceAvailableEntity.class, mraId);
        
        if (user != null && mra != null) {
            user.getMras().remove(mra);
        } else {
            throw new NoResultException("User or Material Resource Available not found");
        }
    }
}
