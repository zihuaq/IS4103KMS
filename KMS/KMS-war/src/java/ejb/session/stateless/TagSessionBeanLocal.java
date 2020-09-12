/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import Exception.TagNameExistException;
import entity.Tag;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface TagSessionBeanLocal {

    public Tag getTagById(long tagId) throws NoResultException;
    
    public void createNewTag (Tag tag) throws TagNameExistException;

}
