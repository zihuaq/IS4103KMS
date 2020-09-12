/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.DuplicateEmailException;
import Exception.DuplicateTagInProfileException;
import Exception.NoResultException;
import entity.User;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface UserSessionBeanLocal {

    public User createNewUser(User user) throws DuplicateEmailException;

    public User getUserById(long userId) throws NoResultException;

    public void addSkillToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException;

    public void removeSkillFromProfile(long userId, long tagId) throws NoResultException;
    
    public void addSDGToProfile(long userId, long tagId) throws NoResultException, DuplicateTagInProfileException;
    
    public void removeSDGFromProfile(long userId, long tagId) throws NoResultException;

}
