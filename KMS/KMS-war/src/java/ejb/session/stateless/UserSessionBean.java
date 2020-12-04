package ejb.session.stateless;

import Exception.AffiliatedUserExistException;
import Exception.DeactivatedEntityException;
import Exception.DuplicateAffiliationRequestException;
import Exception.DuplicateEmailException;
import Exception.DuplicateFollowRequestException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.InvalidUUIDException;
import Exception.NoResultException;
import Exception.QuestionnaireAlreadyCompletedException;
import Exception.ResignFromAdminException;
import Exception.UserNotFoundException;
import entity.AffiliationRequestEntity;
import entity.AwardEntity;
import entity.FollowRequestEntity;
import entity.FulfillmentEntity;
import entity.GroupEntity;
import entity.IndividualQuestionnaireEntity;
import entity.MaterialResourceAvailableEntity;
import entity.OrganisationQuestionnaireEntity;
import entity.PostEntity;
import entity.ProfileEntity;
import entity.ProjectEntity;
import entity.ReportEntity;
import entity.ReviewEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.UUID;
import javax.ejb.EJB;
import javax.ejb.Local;
import javax.ejb.Remote;
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
@Local(UserSessionBeanLocal.class)
@Remote(UserSessionBeanRemote.class)
public class UserSessionBean implements UserSessionBeanLocal, UserSessionBeanRemote {

    @EJB
    private ReportSessionBeanLocal reportSessionBean;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public UserEntity createNewUser(UserEntity user) throws DuplicateEmailException {
        Query q = em.createQuery("SELECT u FROM UserEntity u WHERE u.email = :email");
        q.setParameter("email", user.getEmail());

        if (!q.getResultList().isEmpty()) {
            throw new DuplicateEmailException("Email already exist!");
        }
        String uuid = UUID.randomUUID().toString().replace("-", "");
        user.setVerificationCode(uuid);
        user.setIsVerified(Boolean.FALSE);
        user.setCountOfActivitiesCompleted(0);
        user.setCountOfCommentsCreated(0);
        user.setCountOfGroupsCreated(0);
        user.setCountOfGroupsJoined(0);
        user.setCountOfPostCreated(0);
        user.setCountOfProjectsCreated(0);
        user.setCountOfProjectsJoined(0);
        user.setCountOfReviewsCreated(0);
        user.setReputationPoints(0);
        user.setCompletedQuestionnaire(Boolean.FALSE);
        em.persist(user);
        em.flush();
        System.out.println(user);
        return user;
    }

    @Override
    public void resetPassword(String email) throws UserNotFoundException {
        String password = this.generateRandomPassword(10);
        UserEntity user = this.retrieveUserByEmail(email);
        user.setPassword(password);
        em.merge(user);
        em.flush();
        this.sendResetPasswordEmail(user.getEmail(), password);
    }

    private String generateRandomPassword(int len) {

        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < len; i++) {
            int randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }
        return sb.toString();
    }

    private void sendResetPasswordEmail(String destinationEmail, String newPassword) {

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
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("4103kms@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinationEmail));
            message.setSubject("Password Reset for KMS");
            message.setText("Dear user, "
                    + "\n"
                    + "\n" + "Your password has been reset. New password: " + newPassword
                    + "\n" + "Please login and change your password");

            Transport.send(message);

            System.out.println("reset password message sent");
        } catch (MessagingException ex) {
            throw new RuntimeException(ex);
        }

    }

    @Override
    public UserEntity getUserById(long userId) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user != null) {
            user.getActivityJoined().size();
            user.getAffiliatedUsers().size();
            user.getAffiliationRequestMade().size();
            user.getAffiliationRequestReceived().size();
            user.getBadges().size();
            user.getClaimProfileRequestMade().size();
            user.getDonations().size();
            user.getFollowRequestMade().size();
            user.getFollowRequestReceived().size();
            user.getFollowers().size();
            user.getFollowing().size();
            user.getFulfillments().size();
            user.getGroupAdmins().size();
            user.getGroupsJoined().size();
            user.getGroupsManaged().size();
            user.getGroupsOwned().size();
            user.getHrpApplied().size();
            user.getMras().size();
            user.getNotifications().size();
            user.getPosts().size();
            user.getProfiles().size();
            user.getProjectsJoined().size();
            user.getProjectsManaged().size();
            user.getProjectsOwned().size();
            user.getReviewsGiven().size();
            user.getReviewsReceived().size();
            user.getSdgs().size();
            user.getSkills().size();
            user.getReceivedAwards().size();
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
            user.getProjectsManaged().size();
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
    public UserEntity userLogin(String email, String password) throws InvalidLoginCredentialException, DeactivatedEntityException {
        try {
            UserEntity user = retrieveUserByEmail(email);
            String passwordHash = CryptographicHelper.getInstance().byteArrayToHexString(CryptographicHelper.getInstance().doMD5Hashing(password + user.getSalt()));
            if (user.getPassword().equals(passwordHash)) {
                if (user.getIsActive() == Boolean.FALSE) {
                    throw new DeactivatedEntityException("User account is deactivated");
                }
                return user;
            } else {

                throw new InvalidLoginCredentialException("Email does not exist or invalid password");
            }
        } catch (UserNotFoundException ex) {
            throw new InvalidLoginCredentialException("Email does not exist or invalid password!");
        }

    }

    @Override
    public Boolean changePassword(String email, String oldPassword, String newPassword) throws InvalidLoginCredentialException {
        try {
            UserEntity user = retrieveUserByEmail(email);
            String passwordHash = CryptographicHelper.getInstance().byteArrayToHexString(CryptographicHelper.getInstance().doMD5Hashing(oldPassword + user.getSalt()));
            if (user.getPassword().equals(passwordHash)) {
                System.out.println("change password  if()");
                user.setPassword(newPassword);
                em.merge(user);
                em.flush();
                return true;
            } else {
                System.out.println("change password else()");
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
    public List<TagEntity> addSDGsToProfile(long userId, List<TagEntity> tags) throws NoResultException, DuplicateTagInProfileException {
        UserEntity user = em.find(UserEntity.class, userId);

        if (user == null) {
            throw new NoResultException("User not found.");
        }

        List<TagEntity> sdgTags = user.getSdgs();

        for (int i = 0; i < tags.size(); i++) {
            TagEntity tag = em.find(TagEntity.class, tags.get(i).getTagId());
            if (tag == null) {
                throw new NoResultException("Tag not found.");
            }
            if (sdgTags.contains(tag)) {
                throw new DuplicateTagInProfileException("Tag is already present in user's profile");
            }
            sdgTags.add(tag);
        }

        user.setSdgs(sdgTags);
        return sdgTags;
    }

    @Override
    public List<TagEntity> removeSDGFromProfile(long userId, long tagId) throws NoResultException {
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
        return sdgs;
    }

    @Override
    public void sendVerificationEmail(String destinationEmail, String verificationCode) {

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
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("4103kms@gmail.com"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinationEmail));
            message.setSubject("Thank you for signing up with kms");
            message.setText("Please verify your email address at http://localhost:4200//accountVerification/" + destinationEmail + "/" + verificationCode);

            Transport.send(message);

            System.out.println("message sent");
        } catch (MessagingException ex) {
            throw new RuntimeException(ex);
        }

    }

    public Boolean verifyEmail(String email, String uuid) throws UserNotFoundException, InvalidUUIDException {

        UserEntity user = this.retrieveUserByEmail(email);
        if (user.getIsVerified() == Boolean.TRUE) {
            return user.getIsVerified();
        }

        if (user.getVerificationCode().equals(uuid)) {
            user.setIsVerified(Boolean.TRUE);
            em.flush();
        } else {
            throw new InvalidUUIDException("Invalid UUID");
        }
        return user.getIsVerified();
    }

    //TODO: how to delete if user is group owner/project owner
    //ReviewsGiven will not be deleted when user is deleted
    //ReviewsReceived will be deleted when user is deleted
    //FollowRequests and posts will be deleted when user is deleted
    @Override
    public void deleteUser(long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getAffiliatedUsers().clear();
        List<FollowRequestEntity> followRequestMade = user.getFollowRequestMade();
        for (int i = 0; i < followRequestMade.size(); i++) {
            UserEntity to = followRequestMade.get(i).getTo();
            to.getFollowRequestReceived().remove(followRequestMade.get(i));
            followRequestMade.get(i).setTo(null);
            followRequestMade.get(i).setFrom(null);
            em.remove(followRequestMade.get(i));
        }
        followRequestMade.clear();

        List<FollowRequestEntity> followRequestReceived = user.getFollowRequestReceived();
        for (int i = 0; i < followRequestReceived.size(); i++) {
            UserEntity from = followRequestReceived.get(i).getFrom();
            from.getFollowRequestReceived().remove(followRequestReceived.get(i));
            followRequestReceived.get(i).setTo(null);
            followRequestReceived.get(i).setFrom(null);
            em.remove(followRequestReceived.get(i));
        }
        followRequestReceived.clear();
        user.getFollowers().clear();
        user.getFollowing().clear();
        List<GroupEntity> groupAdmins = user.getGroupAdmins();
        for (int i = 0; i < groupAdmins.size(); i++) {
            groupAdmins.get(i).getGroupAdmins().remove(user);
        }
        groupAdmins.clear();
        List<GroupEntity> groupsJoined = user.getGroupsJoined();
        for (int i = 0; i < groupsJoined.size(); i++) {
            groupsJoined.get(i).getGroupMembers().remove(user);
        }
        groupsJoined.clear();
        List<GroupEntity> groupsOwned = user.getGroupsOwned();
        for (int i = 0; i < groupsOwned.size(); i++) {
            groupsOwned.get(i).setGroupOwner(null);
        }
        groupsOwned.clear();
        List<MaterialResourceAvailableEntity> mras = user.getMras();
        for (int i = 0; i < mras.size(); i++) {
            mras.get(i).setMaterialResourceAvailableOwner(null);
            em.remove(mras.get(i));
        }
        mras.clear();
        List<PostEntity> posts = user.getPosts();
        for (int i = 0; i < posts.size(); i++) {
            posts.get(i).setPostOwner(null);
            posts.get(i).setProject(null);
            em.remove(posts.get(i));
        }
        posts.clear();

        try {
            List<ReportEntity> reports = reportSessionBean.getProfileReports();
            List<Long> reportIds = new ArrayList<>();
            for (ReportEntity report : reports) {
                if (report.getReportedUser().getUserId() == userId) {
                    reportIds.add(report.getReportId());
                }
            }
            for (int i = 0; i < reportIds.size(); i++) {
                reportSessionBean.deleteReport(reportIds.get(i));
            }
        } catch (NoResultException ex) {
            System.out.println("no Reports made against user");
        }

        try {
            List<ReportEntity> reports = reportSessionBean.getAllReports();
            List<Long> reportIds = new ArrayList<>();
            for (ReportEntity report : reports) {
                if (report.getReportOwner().getUserId() == userId) {
                    reportIds.add(report.getReportId());
                }
            }
            for (int i = 0; i < reportIds.size(); i++) {
                reportSessionBean.deleteReport(reportIds.get(i));
            }
        } catch (NoResultException ex) {
            System.out.println("User made no reports");
        }

        List<ProjectEntity> projectAdmins = user.getProjectsManaged();
        for (int i = 0; i < projectAdmins.size(); i++) {
            projectAdmins.get(i).getProjectAdmins().remove(user);
        }
        projectAdmins.clear();
        List<ProjectEntity> projectsJoined = user.getProjectsJoined();
        for (int i = 0; i < projectsJoined.size(); i++) {
            projectsJoined.get(i).getProjectMembers().remove(user);
        }
        projectsJoined.clear();
        List<ProjectEntity> projectsOwned = user.getProjectsOwned();
        for (int i = 0; i < projectsOwned.size(); i++) {
            projectsOwned.get(i).setProjectOwner(null);
        }
        projectsOwned.clear();
        List<ReviewEntity> reviewsGiven = user.getReviewsGiven();
        for (int i = 0; i < reviewsGiven.size(); i++) {
            reviewsGiven.get(i).setFrom(null);
        }
        reviewsGiven.clear();
        List<ReviewEntity> reviewsReceived = user.getReviewsReceived();
        for (int i = 0; i < reviewsReceived.size(); i++) {
            reviewsReceived.get(i).setTo(null);
            reviewsReceived.get(i).getFrom().getReviewsGiven().remove(reviewsReceived.get(i));
            reviewsReceived.get(i).setFrom(null);
            em.remove(reviewsReceived.get(i));
        }
        reviewsReceived.clear();
        List<FulfillmentEntity> fulfillments = user.getFulfillments();
        for (int i = 0; i < fulfillments.size(); i++) {
            fulfillments.get(i).setFulfillmentOwner(null);
            fulfillments.get(i).setMra(null);
        }
        fulfillments.clear();
        user.getSdgs().clear();
        user.getSkills().clear();
        em.remove(user);

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
        Query q = em.createQuery("SELECT u FROM UserEntity U");
        List<UserEntity> users = q.getResultList();
        for (UserEntity userEntity : users) {
            userEntity.getFollowers().size();
            userEntity.getFollowing().size();
            userEntity.getSkills().size();
            userEntity.getSdgs().size();
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
        users = user.getAffiliatedUsers();

        return users;
    }

    @Override
    public void makeAffiliationRequest(Long fromUserId, List<Long> toUserIds) throws UserNotFoundException, DuplicateAffiliationRequestException, AffiliatedUserExistException {
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        List<AffiliationRequestEntity> requests = new ArrayList<>();

        for (int i = 0; i < toUserIds.size(); i++) {
            UserEntity toUser = em.find(UserEntity.class, toUserIds.get(i));
            Query q = em.createQuery("SELECT a FROM AffiliationRequestEntity AS a WHERE a.from.userId = :from AND a.to.userId = :to");
            q.setParameter("from", fromUserId);
            q.setParameter("to", toUserIds.get(i));
            if (fromUser.getAffiliatedUsers().contains(toUser)) {
                throw new AffiliatedUserExistException("User is already affiliated!");
            }
            try {
                AffiliationRequestEntity a = (AffiliationRequestEntity) q.getSingleResult();
                throw new DuplicateAffiliationRequestException("Affiliation request already sent!");
            } catch (javax.persistence.NoResultException e) {
                AffiliationRequestEntity affiliationRequestEntity = new AffiliationRequestEntity();
                affiliationRequestEntity.setFrom(fromUser);
                affiliationRequestEntity.setTo(toUser);
                requests.add(affiliationRequestEntity);
            }
        }

        for (int i = 0; i < requests.size(); i++) {
            AffiliationRequestEntity req = requests.get(i);
            fromUser.getAffiliationRequestMade().add(req);
            UserEntity toUser = em.find(UserEntity.class, req.getTo());
            toUser.getAffiliationRequestReceived().add(req);
            em.persist(req);
            em.flush();
        }
    }

    @Override
    public AffiliationRequestEntity sendAffiliateReqToUser(Long userId, Long affiliatedToAddUserId) throws AffiliatedUserExistException, DuplicateAffiliationRequestException, UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        UserEntity toUser = em.find(UserEntity.class, affiliatedToAddUserId);
        if (user == null || toUser == null) {
            throw new UserNotFoundException("User not found");
        }

        Query q = em.createQuery("SELECT a FROM AffiliationRequestEntity AS a WHERE a.from.userId = :from AND a.to.userId = :to");
        q.setParameter("from", userId);
        q.setParameter("to", affiliatedToAddUserId);
        if (user.getAffiliatedUsers().contains(toUser)) {
            throw new AffiliatedUserExistException("User is already affiliated!");
        }
        try {
            AffiliationRequestEntity a = (AffiliationRequestEntity) q.getSingleResult();
            throw new DuplicateAffiliationRequestException("Affiliation request already sent!");
        } catch (javax.persistence.NoResultException e) {
            AffiliationRequestEntity affiliationRequestEntity = new AffiliationRequestEntity();
            affiliationRequestEntity.setFrom(user);
            affiliationRequestEntity.setTo(toUser);
            user.getAffiliationRequestMade().add(affiliationRequestEntity);
            toUser.getAffiliationRequestReceived().add(affiliationRequestEntity);
            em.persist(affiliationRequestEntity);
            em.flush();
            return affiliationRequestEntity;
        }
    }

    @Override
    public void removeAffiliatedUser(Long userId, Long affiliatedToRemoveUserId) throws NoResultException, UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        UserEntity affiliatedUserToRemove = em.find(UserEntity.class, affiliatedToRemoveUserId);
        if (user == null || affiliatedUserToRemove == null) {
            throw new UserNotFoundException("User not found");
        }

        if (user.getAffiliatedUsers().contains(affiliatedUserToRemove) && affiliatedUserToRemove.getAffiliatedUsers().contains(user)) {
            user.getAffiliatedUsers().remove(affiliatedUserToRemove);
            affiliatedUserToRemove.getAffiliatedUsers().remove(user);
        } else {
            throw new NoResultException("User is not affiliated.");
        }
    }

    @Override
    public List<AffiliationRequestEntity> getAffiliationRequestsReceived(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getAffiliationRequestReceived().size();
        return user.getAffiliationRequestReceived();
    }

    @Override
    public List<AffiliationRequestEntity> getAffiliationRequestsMade(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getAffiliationRequestMade().size();
        return user.getAffiliationRequestMade();
    }

    @Override
    public void acceptAffiliationRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException {
        Query q = em.createQuery("SELECT a FROM AffiliationRequestEntity AS a WHERE a.from.userId = :from AND a.to.userId = :to");
        q.setParameter("from", fromUserId);
        q.setParameter("to", toUserId);
        AffiliationRequestEntity a = (AffiliationRequestEntity) q.getSingleResult();
        if (a == null) {
            throw new NoResultException("Affiliation request not found");
        }
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        fromUser.getAffiliationRequestMade().remove(a);
        toUser.getAffiliationRequestReceived().remove(a);
        a.setTo(null);
        a.setFrom(null);
        em.remove(a);
        if (!fromUser.getAffiliatedUsers().contains(toUser)) {
            fromUser.getAffiliatedUsers().add(toUser);
        }
        if (!toUser.getAffiliatedUsers().contains(fromUser)) {
            toUser.getAffiliatedUsers().add(fromUser);
        }
    }

    @Override
    public void rejectAffiliationRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException {
        Query q = em.createQuery("SELECT a FROM AffiliationRequestEntity AS a WHERE a.from.userId = :from AND a.to.userId = :to");
        q.setParameter("from", fromUserId);
        q.setParameter("to", toUserId);
        AffiliationRequestEntity a = (AffiliationRequestEntity) q.getSingleResult();
        if (a == null) {
            throw new NoResultException("Affiliation request not found");
        }
        UserEntity toUser = em.find(UserEntity.class, toUserId);
        UserEntity fromUser = em.find(UserEntity.class, fromUserId);
        if (toUser == null || fromUser == null) {
            throw new UserNotFoundException("User not found");
        }
        fromUser.getAffiliationRequestMade().remove(a);
        toUser.getAffiliationRequestReceived().remove(a);
        a.setTo(null);
        a.setFrom(null);
        em.remove(a);
    }

    @Override
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
        user.setGender(updatedUser.getGender());
        user.setIsActive(updatedUser.getIsActive());
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

    @Override
    public List<ProjectEntity> getProjectsOwned(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        user.getProjectsOwned().size();
        return user.getProjectsOwned();
    }

    public List<ReviewEntity> getUserWrittenReviews(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getReviewsGiven().size();
        return user.getReviewsGiven();
    }

    @Override
    public List<ProjectEntity> getProjectsJoined(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);

        user.getProjectsJoined().size();
        return user.getProjectsJoined();
    }

    @Override
    public List<ReviewEntity> getUserRecievedReviews(Long userId) throws UserNotFoundException {

        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getReviewsReceived().size();
        return user.getReviewsReceived();
    }

    @Override
    public List<ProjectEntity> getProjectsManaged(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getProjectsManaged().size();
        return user.getProjectsManaged();

    }

    @Override
    public List<GroupEntity> getGroupsOwned(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        user.getGroupsOwned().size();
        return user.getGroupsOwned();
    }

    @Override
    public List<GroupEntity> getGroupsJoined(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);

        user.getGroupsJoined().size();
        return user.getGroupsJoined();
    }

    @Override
    public List<GroupEntity> getGroupsManaged(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        user.getGroupAdmins().size();
        return user.getGroupAdmins();

    }

    public Long editReview(Long reviewId, String title, String message, Integer rating) throws NoResultException {
        ReviewEntity review = em.find(ReviewEntity.class, reviewId);
        if (review == null) {
            throw new NoResultException("Review does not exist");
        }
        review.setTitle(title);
        review.setReviewField(message);
        review.setRating(rating);

        return review.getReviewId();
    }

    public void persist(Object object) {
        em.persist(object);
    }

    public List<AwardEntity> getReceivedAwards(Long userId) throws UserNotFoundException {
        UserEntity user = em.find(UserEntity.class, userId);

        user.getReceivedAwards().size();
        return user.getReceivedAwards();
    }

    @Override
    public List<ProfileEntity> getProfilesForUser(Long userId) throws NoResultException {
        UserEntity userEntity = getUserById(userId);
        userEntity.getProfiles().size();
        return userEntity.getProfiles();
    }

    
    public Long submitIndividualQuestionnaire(IndividualQuestionnaireEntity questionnaire, Long userId, List<TagEntity> sdg) throws NoResultException, QuestionnaireAlreadyCompletedException{
        UserEntity user = getUserById(userId);
        if(user.getCompletedQuestionnaire()){
            throw new QuestionnaireAlreadyCompletedException("Questionnaire has already been submitted");
        }
        else{
            List<TagEntity> currentSDGs = user.getSdgs();
            List<TagEntity> updatedSDGs = new ArrayList<>();
            for(TagEntity incomingSdg : sdg){
                boolean incomingSDGinCurrent = false;
                for(TagEntity currentSdg: currentSDGs){
                    if(incomingSdg.getTagId().equals(currentSdg.getTagId())){
                        incomingSDGinCurrent = true;
                    }
                }
                if(incomingSDGinCurrent == false){
                    try{
                        addSDGToProfile(userId, incomingSdg.getTagId());
                    }
                    catch (DuplicateTagInProfileException ex){
                        continue;
                    }
                }
            }
           
            
            
            
            user.setCompletedQuestionnaire(Boolean.TRUE);
            em.persist(questionnaire);
            user.setIndividualQuestionnaire(questionnaire);
            em.flush();
        }
        
        return questionnaire.getIndividualQuestionnaireId();
    }
    
    public Long submitOrganisationQuestionnaire(OrganisationQuestionnaireEntity questionnaire, Long userId, List<TagEntity> sdg) throws NoResultException, QuestionnaireAlreadyCompletedException{
        UserEntity user = getUserById(userId);
        if(user.getCompletedQuestionnaire()){
            throw new QuestionnaireAlreadyCompletedException("Questionnaire has already been submitted");
        }
        else{
             List<TagEntity> currentSDGs = user.getSdgs();
            List<TagEntity> updatedSDGs = new ArrayList<>();
            for(TagEntity incomingSdg : sdg){
                boolean incomingSDGinCurrent = false;
                for(TagEntity currentSdg: currentSDGs){
                    if(incomingSdg.getTagId().equals(currentSdg.getTagId())){
                        incomingSDGinCurrent = true;
                    }
                }
                if(incomingSDGinCurrent == false){
                    try{
                        addSDGToProfile(userId, incomingSdg.getTagId());
                    }
                    catch (DuplicateTagInProfileException ex){
                        continue;
                    }
                }
            }
            
            em.persist(questionnaire);
            user.setOrganisationQuestionnaire(questionnaire);
            em.flush();
            user.setCompletedQuestionnaire(Boolean.TRUE);
        }
        
        return questionnaire.getOrganisationQuestionnaireId();
    }

    @Override
    public UserEntity promoteUserToAdmin(Long userToPromoteId) throws NoResultException {
        UserEntity user = em.find(UserEntity.class, userToPromoteId);

        if (user != null && user.getUserType() != UserTypeEnum.ADMIN) {
            user.setUserType(UserTypeEnum.ADMIN);
            return user;
        } else {
            throw new NoResultException("No User Found.");
        }
    }

    @Override
    public UserEntity resignFromAdmin(Long userId) throws NoResultException,ResignFromAdminException {
        UserEntity user = em.find(UserEntity.class, userId);

        if (user != null && user.getUserType() == UserTypeEnum.ADMIN) {
            Query q = em.createQuery("SELECT u FROM UserEntity u WHERE u.userType = :userType");
            q.setParameter("userType", UserTypeEnum.ADMIN);
            List<UserEntity> admins = (List<UserEntity>) q.getResultList();
            if(admins.size() > 1) {
            user.setUserType(UserTypeEnum.INDIVIDUAL);
            return user;
            } else {
                throw new ResignFromAdminException("There must be at least one Admin on the platform.");
            }
        } else {
            throw new NoResultException("No Admin Found.");
        }

    }
}
