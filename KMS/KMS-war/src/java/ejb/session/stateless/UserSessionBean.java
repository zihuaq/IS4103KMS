package ejb.session.stateless;

import Exception.DuplicateEmailException;
import Exception.DuplicateTagInProfileException;
import Exception.NoResultException;
import entity.Tag;
import entity.User;
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
public class UserSessionBean implements UserSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public User createNewUser(User user) throws DuplicateEmailException {
        Query q = em.createQuery("SELECT u FROM User u WHERE u.email = :email");
        q.setParameter("email", user.getEmail());
        System.out.println(user);
        if(!q.getResultList().isEmpty()){
            throw new DuplicateEmailException("Email already exist!");
        }
        em.persist(user);
        em.flush();
        return user;
    }
    
    @Override
    public User getUserById(long userId) throws NoResultException {
        User user = em.find(User.class, userId);
        if (user != null) {
            return user;
        } else {
            throw new NoResultException("User not found");
        }
    }

    @Override
    public void addSkillToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException {
        User user = em.find(User.class, userId);
        Tag tag = em.find(Tag.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<Tag> skills = user.getSkills();
        if (skills.contains(tag)) {
            throw new DuplicateTagInProfileException("Skill is already present in user's profile");
        }
        skills.add(tag);
        user.setSkills(skills);
    }

    @Override
    public void removeSkillFromProfile(long userId, long tagId) throws NoResultException {
        User user = em.find(User.class, userId);
        Tag tag = em.find(Tag.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<Tag> skills = user.getSkills();
        if (!skills.contains(tag)) {
            throw new NoResultException("Skill does not exist in user's profile");
        }
        skills.remove(tag);
        user.setSkills(skills);
    }
    
    @Override
    public void addSDGToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException {
        User user = em.find(User.class, userId);
        Tag tag = em.find(Tag.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<Tag> sdgs = user.getSdgs();
        if (sdgs.contains(tag)) {
            throw new DuplicateTagInProfileException("Tag is already present in user's profile");
        }
        sdgs.add(tag);
        user.setSdgs(sdgs);
    }

    @Override
    public void removeSDGFromProfile(long userId, long tagId) throws NoResultException {
        User user = em.find(User.class, userId);
        Tag tag = em.find(Tag.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<Tag> sdgs = user.getSdgs();
        if (!sdgs.contains(tag)) {
            throw new NoResultException("Skill does not exist in user's profile");
        }
        sdgs.remove(tag);
        user.setSdgs(sdgs);
    }
}
