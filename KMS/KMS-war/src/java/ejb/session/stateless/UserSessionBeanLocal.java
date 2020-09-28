/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
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
import entity.ReviewEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface UserSessionBeanLocal {

    public UserEntity createNewUser(UserEntity user) throws DuplicateEmailException;

    public UserEntity getUserById(long userId) throws NoResultException;

    public List<UserEntity> getAllUsers() throws NoResultException;

    public List<UserEntity> getAffiliatedUsers(Long userId) throws UserNotFoundException;

    public void addAffiliatedUser(Long userId, Long affiliatedToAddUserId) throws AffiliatedUserExistException, UserNotFoundException;

    public void removeAffiliatedUser(Long userId, Long affiliatedToRemoveUserId) throws NoResultException, UserNotFoundException;

    public List<TagEntity> addSkillsToProfile(long userId, List<TagEntity> tags) throws NoResultException, DuplicateTagInProfileException;

    public List<TagEntity> getSkillsForProfile(long userId) throws UserNotFoundException;

    public List<TagEntity> removeSkillFromProfile(long userId, long tagId) throws NoResultException;

    public List<TagEntity> getSDGsForProfile(long userId) throws UserNotFoundException;

    public void addSDGToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException;

    public void removeSDGFromProfile(long userId, long tagId) throws NoResultException;

    public UserEntity retrieveUserByEmail(String email) throws UserNotFoundException;

    public UserEntity userLogin(String email, String password) throws InvalidLoginCredentialException;

    public void deleteUser(long userId) throws UserNotFoundException;

    public FollowRequestEntity followUser(Long toUserId, Long fromUserId) throws UserNotFoundException, DuplicateFollowRequestException;

    public void acceptFollowRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException;

    public void rejectFollowRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException;

    public void unfollowUser(Long toUserId, Long fromUserId) throws UserNotFoundException;

    public UserEntity updateUser(UserEntity updatedUser) throws UserNotFoundException, DuplicateEmailException, NoResultException;

    public void sendVerificationEmail(String destinationEmail, String verificationCode);

    public Boolean verifyEmail(String email, String uuid) throws UserNotFoundException, InvalidUUIDException;

    public List<UserEntity> getFollowers(long userId) throws UserNotFoundException;

    public List<UserEntity> getFollowing(long userId) throws UserNotFoundException;

    public List<FollowRequestEntity> getFollowRequestReceived(Long userId) throws UserNotFoundException;

    public List<FollowRequestEntity> getFollowRequestMade(Long userId) throws UserNotFoundException;

    public void resetPassword(String email) throws UserNotFoundException;

    public Boolean changePassword(String email, String oldPassword, String newPassword) throws InvalidLoginCredentialException;

    public List<ReviewEntity> getUserWrittenReviews(Long userId) throws UserNotFoundException;

    public List<ReviewEntity> getUserRecievedReviews(Long userId) throws UserNotFoundException;

    public Long editReview(Long reviewId, String title, String message, Integer rating) throws NoResultException;

}
