package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourceAvailable;
import entity.User;
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
    
    @Override
    public List<MaterialResourceAvailable> getMaterialResourceAvailableForUser(long userId) throws NoResultException {
        User user = em.find(User.class, userId);
        if (user != null) {
            return user.getMras();
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public void deleteMaterialResourceAvailableForUser(long userId, long mraId) throws NoResultException {
        User user = em.find(User.class, userId);
        MaterialResourceAvailable mra = em.find(MaterialResourceAvailable.class, mraId);
        
        if (user != null && mra != null) {
            user.getMras().remove(mra);
        } else {
            throw new NoResultException("User or Material Resource Available not found");
        }
    }
}
