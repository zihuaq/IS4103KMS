package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourceAvailable;
import entity.User;
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
    public void createMaterialResourceAvailable(MaterialResourceAvailable materialResourceAvailable, long userId) throws NoResultException {
        User materialResourceAvailableOwner = em.find(User.class, userId);
        if (materialResourceAvailableOwner != null) {
            em.persist(materialResourceAvailable);
            materialResourceAvailable.setMaterialResourceAvailableOwner(materialResourceAvailableOwner);
            materialResourceAvailableOwner.getMras().add(materialResourceAvailable);
        } else {
            throw new NoResultException("User not found");
        }

    }
}
