package ejb.session.stateless;

import Exception.AffiliatedUserExistException;
import Exception.DuplicateEmailException;
import Exception.DuplicateFollowRequestException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.InvalidUUIDException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import entity.FollowRequestEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.security.SecureRandom;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
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
import util.enumeration.UserTypeEnum;
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
        String uuid = UUID.randomUUID().toString().replace("-", "");
        user.setVerificationCode(uuid);
        user.setIsVerified(Boolean.FALSE);
        em.persist(user);
        em.flush();
        return user;
    }
    
    @Override
    public void resetPassword(String email)throws UserNotFoundException{
        String password = this.generateRandomPassword(10);
        UserEntity user = this.retrieveUserByEmail(email);
        user.setPassword(password);
        em.merge(user);
        em.flush();
        this.sendResetPasswordEmail(user.getEmail(), password);
    }
    
    private String generateRandomPassword(int len){
        
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        
        for (int i = 0; i < len; i++){
            int randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }
        return sb.toString();
    }
    
    private void sendResetPasswordEmail(String destinationEmail, String newPassword){
        
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
            message.setSubject("Password Reset for KMS");
            message.setText("Dear user, "+ 
                    "\n" +
                    "\n" + "Your password has been reset. New password: " + newPassword +
                    "\n" + "Please login and change your password");
            
            Transport.send(message);
            
            System.out.println("reset password message sent");
        }
        catch(MessagingException ex){
            throw new RuntimeException(ex);
        }

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
            user.getGroupsJoined().size();
            user.getGroupsOwned().size();
            user.getPosts().size();
            user.getProjectAdmins().size();
            user.getProjectsJoined().size();
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
                return user;
            } else {
                System.out.println("user login else()");
                throw new InvalidLoginCredentialException("Email does not exist of invalid password");
            }
        } catch (UserNotFoundException ex) {
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
    public void sendVerificationEmail(String destinationEmail, String verificationCode){
        
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
            message.setText("Please verify your email address at http://localhost:4200//accountVerification/" + destinationEmail + "/"+ verificationCode);
            
            Transport.send(message);
            
            System.out.println("message sent");
        }
        catch(MessagingException ex){
            throw new RuntimeException(ex);
        }

    }
    
    public Boolean verifyEmail(String email, String uuid) throws UserNotFoundException, InvalidUUIDException{
        
        UserEntity user = this.retrieveUserByEmail(email);
        if(user.getIsVerified() == Boolean.TRUE){
            return user.getIsVerified();
        }
        
        if(user.getVerificationCode().equals(uuid)){
            user.setIsVerified(Boolean.TRUE);
            em.flush();
        }else{
            throw new InvalidUUIDException("Invalid UUID");
        }
        return user.getIsVerified();
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
            try {
                FollowRequestEntity f = (FollowRequestEntity) q.getSingleResult();
                throw new DuplicateFollowRequestException("Follow request already sent!");
            } catch (javax.persistence.NoResultException e) {
                FollowRequestEntity followRequestEntity = new FollowRequestEntity();
                followRequestEntity.setFrom(fromUser);
                followRequestEntity.setTo(toUser);

                fromUser.getFollowRequestMade().add(followRequestEntity);
                toUser.getFollowRequestReceived().add(followRequestEntity);
                em.persist(followRequestEntity);
                em.flush();
                return followRequestEntity;
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
        for (UserEntity userEntity : users) {
            userEntity.getFollowers().size();
            userEntity.getFollowing().size();
        }
        return users;
    }

    @Override
    public List<UserEntity> getAffiliatedUsers(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        List<UserEntity> users = new ArrayList<>();
        if (user.getUserType() == UserTypeEnum.INDIVIDUAL) {
            users = user.getAffiliatedInstitutes();
        } else if (user.getUserType() == UserTypeEnum.INSTITUTE) {
            users = user.getAffiliatedIndividuals();
        }
        for (UserEntity userEntity : users) {
            userEntity.getFollowers().size();
            userEntity.getFollowing().size();
        }
        return users;
    }

    @Override
    public void addAffiliatedUser(Long userId, Long affiliatedToAddUserId) throws AffiliatedUserExistException, UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        UserEntity affiliatedUserToAdd = em.find(UserEntity.class, affiliatedToAddUserId);
        if (user == null || affiliatedUserToAdd == null) {
            throw new UserNotFoundException("User not found");
        }
        List<UserEntity> affiliatedUsers = new ArrayList<>();
        if (user.getUserType() == UserTypeEnum.INDIVIDUAL) {
            affiliatedUsers = user.getAffiliatedInstitutes();
        } else if (user.getUserType() == UserTypeEnum.INSTITUTE) {
            affiliatedUsers = user.getAffiliatedIndividuals();
        }

        if (!affiliatedUsers.contains(affiliatedUserToAdd)) {
            affiliatedUsers.add(affiliatedUserToAdd);
        } else{
            throw new AffiliatedUserExistException("User is already affiliated.");
        }
    }
    
    @Override
    public void removeAffiliatedUser(Long userId, Long affiliatedToRemoveUserId) throws NoResultException, UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        UserEntity affiliatedUserToRemove = em.find(UserEntity.class, affiliatedToRemoveUserId);
        if (user == null || affiliatedUserToRemove == null) {
            throw new UserNotFoundException("User not found");
        }
        List<UserEntity> affiliatedUsers = new ArrayList<>();
        if (user.getUserType() == UserTypeEnum.INDIVIDUAL) {
            affiliatedUsers = user.getAffiliatedInstitutes();
        } else if (user.getUserType() == UserTypeEnum.INSTITUTE) {
            affiliatedUsers = user.getAffiliatedIndividuals();
        }

        if (affiliatedUsers.contains(affiliatedUserToRemove)) {
            affiliatedUsers.remove(affiliatedUserToRemove);
        } else{
            throw new NoResultException("User is not affiliated.");
        }
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
