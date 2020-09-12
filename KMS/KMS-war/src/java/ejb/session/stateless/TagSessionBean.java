package ejb.session.stateless;

import Exception.NoResultException;
import Exception.TagNameExistException;
import entity.Tag;
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
    public Tag getTagById(long tagId) throws NoResultException {
        Tag tag = em.find(Tag.class, tagId);
        if (tag != null) {
            return tag;
        } else {
            throw new NoResultException("Tag not found");
        }
    }

    @Override
    public void createNewTag(Tag tag) throws TagNameExistException {
        Query q = em.createQuery("SELECT t FROM Tag t WHERE LOWER(t.name)= :name");
        q.setParameter("name", tag.getName().toLowerCase());
        List<Tag> tags = (List<Tag>) q.getResultList();

        if (tags.isEmpty()) {
            em.persist(tag);
        } else {
            throw new TagNameExistException("Name of Tag exist");
        }
    }

    @Override
    public List<Tag> getAllSkillTags() {
        Query q = em.createQuery("SELECT t FROM Tag t WHERE t.TagType = 'SKILl'");
        return q.getResultList();
    }
    
    @Override
    public List<Tag> getAllMaterialResourceTags() {
        Query q = em.createQuery("SELECT t FROM Tag t WHERE t.TagType = 'MATERIALRESOURCE'");
        return q.getResultList();
    }
    
    @Override
    public List<Tag> getAllSDGTags() {
        Query q = em.createQuery("SELECT t FROM Tag t WHERE t.TagType = 'SDG'");
        return q.getResultList();
    }    
}
