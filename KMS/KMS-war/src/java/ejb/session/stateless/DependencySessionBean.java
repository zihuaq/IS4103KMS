/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.DependencyEntity;
import entity.TaskEntity;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

/**
 *
 * @author zihua
 */
@Stateless
public class DependencySessionBean implements DependencySessionBeanLocal {

    @EJB(name = "TaskSessionBeanLocal")
    private TaskSessionBeanLocal taskSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @Override
    public DependencyEntity getDependencyById(Long dependencyId) throws NoResultException {
        DependencyEntity dependency = em.find(DependencyEntity.class, dependencyId);
        
        if (dependency != null) {
            return dependency;
        } else {
            throw new NoResultException("Dependency does not exist");
        }
    }
    
    @Override
    public List<DependencyEntity> getDependenciesByProject(Long projectId) {
        Query query = em.createQuery("SELECT d from DependencyEntity d WHERE d.predecessor.project.projectId = :inProjectId OR d.successor.project.projectId = :inProjectId");
        query.setParameter("inProjectId", projectId);
        
        return query.getResultList();
    }

    @Override
    public Long createNewDependency(DependencyEntity newDependency) throws NoResultException {
        TaskEntity predecessor = taskSessionBeanLocal.getTaskById(newDependency.getPredecessor().getTaskId());
        TaskEntity successor = taskSessionBeanLocal.getTaskById(newDependency.getSuccessor().getTaskId());
        
        newDependency.setPredecessor(predecessor);
        newDependency.setSuccessor(successor);
        
        em.persist(newDependency);
        em.flush();
        
        return newDependency.getDependencyId();
    }
    
    @Override
    public void deleteDependency(Long dependencyId) throws NoResultException {
        DependencyEntity dependencyToDelete = this.getDependencyById(dependencyId);
        
        dependencyToDelete.setPredecessor(null);
        dependencyToDelete.setSuccessor(null);
        
        em.remove(dependencyToDelete);
    }
}
