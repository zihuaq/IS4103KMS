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
    public List<MaterialResourceAvailableEntity> createMaterialResourceAvailable(MaterialResourceAvailableEntity materialResourceAvailable, long userId) throws NoResultException {
        UserEntity materialResourceAvailableOwner = em.find(UserEntity.class, userId);
        if (materialResourceAvailableOwner != null) {
            em.persist(materialResourceAvailable);
            materialResourceAvailable.setMaterialResourceAvailableOwner(materialResourceAvailableOwner);
            materialResourceAvailableOwner.getMras().add(materialResourceAvailable);
            return materialResourceAvailableOwner.getMras();
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
    public List<MaterialResourceAvailableEntity> deleteMaterialResourceAvailableForUser(long userId, long mraId) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, userId);
        MaterialResourceAvailableEntity mra = em.find(MaterialResourceAvailableEntity.class, mraId);

        if (user != null && mra != null) {
            List<MaterialResourceAvailableEntity> mras = user.getMras();
            System.out.println(mras);
            if (!mras.contains(mra)) {
                throw new NoResultException("Material Resource Available does not exist in user's profile");
            }
            mras.remove(mra);
            user.setMras(mras);
            em.remove(mra);
            return user.getMras();
        } else {
            throw new NoResultException("User or Material Resource Available not found");
        }
    }
}
