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
import entity.UserEntity;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface UserSessionBeanLocal {

    public UserEntity createNewUser(UserEntity user) throws DuplicateEmailException;

    public UserEntity getUserById(long userId) throws NoResultException;

    public void addSkillToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException;

    public void removeSkillFromProfile(long userId, long tagId) throws NoResultException;
    
    public void addSDGToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException;
    
    public void removeSDGFromProfile(long userId, long tagId) throws NoResultException;

    public UserEntity retrieveUserByEmail(String email) throws UserNotFoundException;

    public UserEntity userLogin(String email, String password) throws InvalidLoginCredentialException;

    public void sendVerificationEmail(String destinationEmail);

}
