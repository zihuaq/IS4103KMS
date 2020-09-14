package ejb.session.stateless;

import Exception.DuplicateEmailException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import entity.FollowRequestEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.List;
import java.util.Properties;
import javax.ejb.Stateless;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
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
    public void addSkillToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException {
        UserEntity user = em.find(UserEntity.class, userId);
        TagEntity tag = em.find(TagEntity.class, tagId);

        if (user == null || tag == null) {
            throw new NoResultException("User or Tag not found.");
        }
        List<TagEntity> skills = user.getSkills();
        if (skills.contains(tag)) {
            throw new DuplicateTagInProfileException("Skill is already present in user's profile");
        }
        skills.add(tag);
        user.setSkills(skills);
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
            user.getProjectAdmins().size();
            user.getProjectsContributed().size();
            user.getProjectsOwned().size();
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
    public void sendVerificationEmail(String destinationEmail){
        
        final String username = "4103kms";
        final String password = "4103kmsemail";
        final String host = "localhost";
        
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.user", username);
        
        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication(){
                return new PasswordAuthentication(username, password);
            }
        });
        
        try{
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("4103kms@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinationEmail));
            message.setSubject("Thank you for signing up with kms");
            message.setText("Please verify your email address here");
            
            Transport.send(message);
            
            System.out.println("message sent");
        }
        catch(MessagingException ex){
            throw new RuntimeException(ex);
        }

    }

    @Override
    public void deleteUser(long userId, UserEntity user) throws NoResultException {
        UserEntity userEntityToRemove = getUserById(userId);
        em.remove(userEntityToRemove);

    }

    @Override
    public void followUser(Long toUserId, Long fromUserId) throws UserNotFoundException {
        System.out.println(toUserId);
        System.out.println(fromUserId);
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        if (toUser.getAccountPrivacySetting().equals(AccountPrivacySettingEnum.PUBLIC)) {
            fromUser.getFollowing().add(toUser);
            toUser.getFollowers().add(fromUser);
        } else {
            FollowRequestEntity followRequestEntity = new FollowRequestEntity();
            em.persist(followRequestEntity);
            followRequestEntity.setFrom(fromUser);
            followRequestEntity.setTo(toUser);
        }
    }

    @Override
    public void acceptFollowRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException {
        Query q = em.createQuery("SELECT f FROM FollowRequestEntity AS f WHERE f.from=:from AND f.to=:to");
        q.setParameter("from", fromUserId);
        q.setParameter("to", toUserId);
        FollowRequestEntity f = (FollowRequestEntity) q.getSingleResult();
        if (f == null) {
            throw new NoResultException("follow request not found");
        }
        em.remove(f);
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, toUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        fromUser.getFollowing().add(toUser);
        toUser.getFollowers().add(fromUser);
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
        
        for(int i=0; i<tags.size(); i++) {
            TagEntity tag = em.find(TagEntity.class, tags.get(i).getTagId());
            if(tag == null){
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
}
