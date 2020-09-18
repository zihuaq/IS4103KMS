package ejb.session.stateless;

import Exception.DuplicateEmailException;
import Exception.DuplicateFollowRequestException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import entity.FollowRequestEntity;
import entity.MaterialResourceAvailableEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.AccountPrivacySettingEnum;
import util.security.CryptographicHelper;

/**
 *
 * @author Jeremy
 */
@Stateless
public class UserSessionBean implements UserSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public UserEntity createNewUser(UserEntity user) throws DuplicateEmailException {
        Query q = em.createQuery("SELECT u FROM UserEntity u WHERE u.email = :email");
        q.setParameter("email", user.getEmail());
        System.out.println(user);
        if (!q.getResultList().isEmpty()) {
            throw new DuplicateEmailException("Email already exist!");
        }
        em.persist(user);
        em.flush();
        return user;
    }

    @Override
    public UserEntity getUserById(long userId) throws NoResultException {
        System.out.println(em);
        System.out.println(userId);
        UserEntity user = em.find(UserEntity.class, userId);
        if (user != null) {
            user.getFollowers().size();
            user.getFollowing().size();
            return user;
        } else {
            throw new NoResultException("User not found");
        }
    }

    @Override
    public List<TagEntity> getSkillsForProfile(long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);

        if (user == null) {
            throw new UserNotFoundException("User not found.");
        }
        return user.getSkills();
    }

    @Override
    public List<TagEntity> removeSkillFromProfile(long userId, long tagId) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, userId);
        TagEntity tag = em.find(TagEntity.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<TagEntity> skills = user.getSkills();
        if (!skills.contains(tag)) {
            throw new NoResultException("Skill does not exist in user's profile");
        }
        skills.remove(tag);
        user.setSkills(skills);
        return skills;
    }

    @Override
    public UserEntity retrieveUserByEmail(String email) throws UserNotFoundException {
        System.out.println(email);
        Query query = em.createQuery("SELECT u FROM UserEntity U WHERE u.email = :userInput");
        query.setParameter("userInput", email);
        System.out.println("here");
        try {
            UserEntity user = (UserEntity) query.getSingleResult();
            System.out.println("here");
            user.getGroups().size();
            user.getGroupsOwned().size();
            user.getPosts().size();
            //user.getProjects().size();
            user.getReviewsGiven().size();
            user.getSdgs().size();
            user.getSkills().size();
            user.getBadges().size();
            user.getFollowers().size();
            user.getFollowing().size();

            return user;
        } catch (javax.persistence.NoResultException ex) {
            System.out.println("No results");
            throw new UserNotFoundException("Email " + email + " does not exist");
        } catch (NonUniqueResultException ex) {
            System.out.println("No unique results");
            throw new UserNotFoundException("Email " + email + " does not exist");
        }

    }

    @Override
    public UserEntity userLogin(String email, String password) throws InvalidLoginCredentialException {
        try {
            UserEntity user = retrieveUserByEmail(email);
            String passwordHash = CryptographicHelper.getInstance().byteArrayToHexString(CryptographicHelper.getInstance().doMD5Hashing(password + user.getSalt()));
            if (user.getPassword().equals(passwordHash)) {
                System.out.println("user login if()");
                System.out.println(user.getPassword());
                System.out.println(passwordHash);
                return user;
            } else {
                System.out.println("user login else()");
                System.out.println(user.getPassword());
                System.out.println(passwordHash);
                throw new InvalidLoginCredentialException("Email does not exist of invalid password");
            }
        } catch (UserNotFoundException ex) {
            System.out.println("here");
            throw new InvalidLoginCredentialException("Email does not exist or invalid password!");
        }

    }

    @Override
    public List<TagEntity> getSDGsForProfile(long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);

        if (user == null) {
            throw new UserNotFoundException("User not found.");
        }
        return user.getSdgs();
    }
    
    @Override
    public void addSDGToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException {
        UserEntity user = em.find(UserEntity.class, userId);
        TagEntity tag = em.find(TagEntity.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<TagEntity> sdgs = user.getSdgs();
        if (sdgs.contains(tag)) {
            throw new DuplicateTagInProfileException("Tag is already present in user's profile");
        }
        sdgs.add(tag);
        user.setSdgs(sdgs);
    }

    @Override
    public void removeSDGFromProfile(long userId, long tagId) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, userId);
        TagEntity tag = em.find(TagEntity.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<TagEntity> sdgs = user.getSdgs();
        if (!sdgs.contains(tag)) {
            throw new NoResultException("Skill does not exist in user's profile");
        }
        sdgs.remove(tag);
        user.setSdgs(sdgs);
    }

    @Override
    public void deleteUser(long userId, UserEntity user) throws NoResultException {
        UserEntity userEntityToRemove = getUserById(userId);
        em.remove(userEntityToRemove);

    }

    @Override
    public FollowRequestEntity followUser(Long toUserId, Long fromUserId) throws UserNotFoundException, DuplicateFollowRequestException {
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        if (toUser.getAccountPrivacySetting().equals(AccountPrivacySettingEnum.PUBLIC)) {
            fromUser.getFollowing().add(toUser);
            toUser.getFollowers().add(fromUser);
            return null;
        } else {
            Query q = em.createQuery("SELECT f FROM FollowRequestEntity AS f WHERE f.from.userId = :from AND f.to.userId = :to");
            q.setParameter("from", fromUserId);
            q.setParameter("to", toUserId);
            FollowRequestEntity f = (FollowRequestEntity) q.getSingleResult();
            if (f == null) {
                FollowRequestEntity followRequestEntity = new FollowRequestEntity();
                followRequestEntity.setFrom(fromUser);
                followRequestEntity.setTo(toUser);

                fromUser.getFollowRequestMade().add(followRequestEntity);
                toUser.getFollowRequestReceived().add(followRequestEntity);
                em.persist(followRequestEntity);
                em.flush();
                return followRequestEntity;
            } else {
                throw new DuplicateFollowRequestException("Follow request already sent!");
            }
        }
    }

    @Override
    public void acceptFollowRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException {
        Query q = em.createQuery("SELECT f FROM FollowRequestEntity AS f WHERE f.from.userId = :from AND f.to.userId = :to");
        q.setParameter("from", fromUserId);
        q.setParameter("to", toUserId);
        FollowRequestEntity f = (FollowRequestEntity) q.getSingleResult();
        if (f == null) {
            throw new NoResultException("Follow request not found");
        }
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        fromUser.getFollowRequestMade().remove(f);
        toUser.getFollowRequestReceived().remove(f);
        f.setTo(null);
        f.setFrom(null);
        em.remove(f);
        if (!fromUser.getFollowing().contains(toUser)) {
            fromUser.getFollowing().add(toUser);
        }
        if (!toUser.getFollowers().contains(fromUser)) {
            toUser.getFollowers().add(fromUser);
        }
    }

    @Override
    public void rejectFollowRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException {
        Query q = em.createQuery("SELECT f FROM FollowRequestEntity AS f WHERE f.from.userId = :from AND f.to.userId = :to");
        q.setParameter("from", fromUserId);
        q.setParameter("to", toUserId);
        FollowRequestEntity f = (FollowRequestEntity) q.getSingleResult();
        if (f == null) {
            throw new NoResultException("follow request not found");
        }
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        fromUser.getFollowRequestMade().remove(f);
        toUser.getFollowRequestReceived().remove(f);
        f.setTo(null);
        f.setFrom(null);
        em.remove(f);
    }

    @Override
    public void unfollowUser(Long toUserId, Long fromUserId) throws UserNotFoundException {
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        fromUser.getFollowing().remove(toUser);
        toUser.getFollowers().remove(fromUser);
    }

    @Override
    public List<TagEntity> addSkillsToProfile(long userId, List<TagEntity> tags) throws NoResultException, DuplicateTagInProfileException {
        UserEntity user = em.find(UserEntity.class, userId);

        if (user == null) {
            throw new NoResultException("User not found.");
        }

        List<TagEntity> skillTags = user.getSkills();

        for (int i = 0; i < tags.size(); i++) {
            TagEntity tag = em.find(TagEntity.class, tags.get(i).getTagId());
            if (tag == null) {
                throw new NoResultException("Tag not found.");
            }
            if (skillTags.contains(tag)) {
                throw new DuplicateTagInProfileException("Tag is already present in user's profile");
            }
            skillTags.add(tag);
        }

        user.setSkills(skillTags);
        return skillTags;
    }

    @Override
    public List<UserEntity> getAllUsers() throws NoResultException {
        Query q = em.createQuery("SELECT u FROM UserEntity u");
        List<UserEntity> users = q.getResultList();
        for(UserEntity userEntity : users) {
            userEntity.getFollowers().size();
            userEntity.getFollowing().size();
        }
        return users;
    }

    public UserEntity updateUser(UserEntity updatedUser) throws UserNotFoundException, DuplicateEmailException, NoResultException {
        UserEntity user = em.find(UserEntity.class, updatedUser.getUserId());
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        Query q = em.createQuery("SELECT u FROM UserEntity u WHERE u.email = :email");
        q.setParameter("email", updatedUser.getEmail());
        if (!q.getResultList().isEmpty() && !updatedUser.getEmail().equals(user.getEmail())) {
            throw new DuplicateEmailException("Email already exist!");
        }

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setDob(updatedUser.getDob());
        System.out.println(updatedUser);
        user.setProfilePicture(updatedUser.getProfilePicture());
        user.setAccountPrivacySetting(updatedUser.getAccountPrivacySetting());
        
        for (int i = 0; i < updatedUser.getSdgs().size(); i++) {
            TagEntity tag = em.find(TagEntity.class, updatedUser.getSdgs().get(i).getTagId());
            if (tag == null) {
                throw new NoResultException("SDG tag not found.");
            }
        }
        user.setSdgs(updatedUser.getSdgs());

        return user;
    }

    @Override
    public List<UserEntity> getFollowers(long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getFollowers().size();
        return user.getFollowers();
    }

    @Override
    public List<UserEntity> getFollowing(long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getFollowing().size();
        return user.getFollowing();
    }

    @Override
    public List<FollowRequestEntity> getFollowRequestReceived(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getFollowRequestReceived().size();
        return user.getFollowRequestReceived();
    }
    
    @Override
    public List<FollowRequestEntity> getFollowRequestMade(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getFollowRequestMade().size();
        return user.getFollowRequestMade();
    }
}
