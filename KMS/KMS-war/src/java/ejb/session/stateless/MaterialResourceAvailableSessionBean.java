package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourceAvailableEntity;
import entity.UserEntity;
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
}
