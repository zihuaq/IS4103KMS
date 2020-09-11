package ejb.session.stateless;

import Exception.NoResultException;
import entity.Tag;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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
}
