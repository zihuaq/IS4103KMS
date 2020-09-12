package ejb.session.stateless;

import Exception.NoResultException;
import entity.TagEntity;
import Exception.TagNameExistException;
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
public class TagSessionBean implements TagSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public TagEntity getTagById(long tagId) throws NoResultException {
        TagEntity tag = em.find(TagEntity.class, tagId);
        if (tag != null) {
            return tag;
        } else {
            throw new NoResultException("Tag not found");
        }
    }

    @Override
    public void createNewTag(TagEntity tag) throws TagNameExistException {
        Query q = em.createQuery("SELECT t FROM TagEntity t WHERE LOWER(t.name)= :name");
        q.setParameter("name", tag.getName().toLowerCase());
        List<TagEntity> tags = (List<TagEntity>) q.getResultList();

        if (tags.isEmpty()) {
            em.persist(tag);
        } else {
            throw new TagNameExistException("Name of Tag exist");
        }
    }

    @Override
    public List<TagEntity> getAllSkillTags() {
        Query q = em.createQuery("SELECT t FROM TagEntity t WHERE t.TagType = 'SKILl'");
        return q.getResultList();
    }
    
    @Override
    public List<TagEntity> getAllMaterialResourceTags() {
        Query q = em.createQuery("SELECT t FROM TagEntity t WHERE t.TagType = 'MATERIALRESOURCE'");
        return q.getResultList();
    }
    
    @Override
    public List<TagEntity> getAllSDGTags() {
        Query q = em.createQuery("SELECT t FROM TagEntity t WHERE t.TagType = 'SDG'");
        return q.getResultList();
    }    
}
