package ejb.session.stateless;

import Exception.NoResultException;
import Exception.UserNotFoundException;
import entity.MaterialResourceAvailableEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author Jeremy
 */
@Stateless
public class MaterialResourceAvailableSessionBean implements MaterialResourceAvailableSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @Override
    public List<MaterialResourceAvailableEntity> createMaterialResourceAvailable(MaterialResourceAvailableEntity materialResourceAvailable) throws NoResultException {
        UserEntity materialResourceAvailableOwner = em.find(UserEntity.class, materialResourceAvailable.getMaterialResourceAvailableOwner().getUserId());
        System.out.println(materialResourceAvailableOwner);
        if (materialResourceAvailableOwner != null) {
            em.persist(materialResourceAvailable);
            em.flush();
            List<MaterialResourceAvailableEntity> mras = materialResourceAvailableOwner.getMras();
            mras.add(materialResourceAvailable);
            materialResourceAvailableOwner.setMras(mras);
            return materialResourceAvailableOwner.getMras();
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public List<MaterialResourceAvailableEntity> updateMaterialResourceAvailable(MaterialResourceAvailableEntity materialResourceAvailable) throws NoResultException {
        UserEntity materialResourceAvailableOwner = em.find(UserEntity.class, materialResourceAvailable.getMaterialResourceAvailableOwner().getUserId());
        MaterialResourceAvailableEntity mra = em.find(MaterialResourceAvailableEntity.class, materialResourceAvailable.getMraId());
        if (materialResourceAvailableOwner != null && mra != null) {
            for (int i = 0; i < materialResourceAvailable.getTags().size(); i++) {
                TagEntity tag = em.find(TagEntity.class, materialResourceAvailable.getTags().get(i).getTagId());
                if (tag == null) {
                    throw new NoResultException("SDG tag not found.");
                }
            }
            mra.setTags(materialResourceAvailable.getTags());
            mra.setName(materialResourceAvailable.getName());
            mra.setDescription(materialResourceAvailable.getDescription());
            mra.setUnits(materialResourceAvailable.getUnits());
            mra.setLatitude(materialResourceAvailable.getLatitude());
            mra.setLongitude(materialResourceAvailable.getLongitude());
            mra.setPrice(materialResourceAvailable.getPrice());
            mra.setType(materialResourceAvailable.getType());
            return materialResourceAvailableOwner.getMras();
        } else {
            throw new NoResultException("User not found");
        }
    }
    
    @Override
    public MaterialResourceAvailableEntity getMaterialResourceAvailableById(long mraId) throws NoResultException {
        MaterialResourceAvailableEntity mra = em.find(MaterialResourceAvailableEntity.class, mraId);
        if (mra == null) {
            throw new NoResultException("Mra not found");
        }
        mra.getTags().size();
        return mra;
    }
    
    @Override
    public List<MaterialResourceAvailableEntity> getMaterialResourceAvailableForUser(long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getMras().size();
        return user.getMras();
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
    
    @Override
    public List<MaterialResourceAvailableEntity> getAllMaterialResourceAvailable(){
        Query query = em.createQuery("SELECT mra FROM MaterialResourceAvailableEntity MRA");
        return query.getResultList();
    }
}
