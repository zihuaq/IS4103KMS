/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.DependencyEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author zihua
 */
@Local
public interface DependencySessionBeanLocal {

    public DependencyEntity getDependencyById(Long dependencyId) throws NoResultException;

    public List<DependencyEntity> getDependenciesByProject(Long projectId);

    public Long createNewDependency(DependencyEntity newDependency) throws NoResultException;

    public void deleteDependency(Long dependencyId) throws NoResultException;
  
}
