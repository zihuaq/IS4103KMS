/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.DuplicateEmailException;
import Exception.DuplicateTagInProfileException;
import Exception.InvalidLoginCredentialException;
import Exception.NoResultException;
import Exception.UserNotFoundException;
import entity.MaterialResourceAvailableEntity;
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

    public List<TagEntity> addSkillsToProfile(long userId, List<TagEntity> tags) throws NoResultException, DuplicateTagInProfileException;
    
    public List<TagEntity> getSkillsForProfile(long userId) throws UserNotFoundException;

    public List<TagEntity> removeSkillFromProfile(long userId, long tagId) throws NoResultException;
    
    public void addSDGToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException;

    public void removeSDGFromProfile(long userId, long tagId) throws NoResultException;

    public UserEntity retrieveUserByEmail(String email) throws UserNotFoundException;

    public UserEntity userLogin(String email, String password) throws InvalidLoginCredentialException;

    public void deleteUser(long userId, UserEntity user) throws NoResultException;

    public void followUser(Long toUserId, Long fromUserId) throws UserNotFoundException;

    public void acceptFollowRequest(Long toUserId, Long fromUserId) throws NoResultException, UserNotFoundException;

    public void unfollowUser(Long toUserId, Long fromUserId) throws UserNotFoundException;

    public UserEntity updateUser(UserEntity updatedUser) throws UserNotFoundException, DuplicateEmailException;

    public List<UserEntity> getFollowers(long userId) throws UserNotFoundException;

    public List<UserEntity> getFollowing(long userId) throws UserNotFoundException;

    public List<MaterialResourceAvailableEntity> getMaterialRequestAvailable(long userId) throws UserNotFoundException;
    
    public List<UserEntity> retrieveAllUser() throws UserNotFoundException;


}
