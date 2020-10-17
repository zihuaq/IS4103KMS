/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.LinkEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author zihua
 */
@Local
public interface LinkSessionBeanLocal {

    public LinkEntity getLinkById(Long dependencyId) throws NoResultException;

    public List<LinkEntity> getLinksByProject(Long projectId);

    public Long createNewLink(LinkEntity newDependency) throws NoResultException;

    public void deleteLink(Long dependencyId) throws NoResultException;
  
}
