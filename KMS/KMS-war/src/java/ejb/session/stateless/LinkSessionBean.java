/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.LinkEntity;
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
public class LinkSessionBean implements LinkSessionBeanLocal {

    @EJB(name = "TaskSessionBeanLocal")
    private TaskSessionBeanLocal taskSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @Override
    public LinkEntity getLinkById(Long linkId) throws NoResultException {
        LinkEntity link = em.find(LinkEntity.class, linkId);
        
        if (link != null) {
            return link;
        } else {
            throw new NoResultException("Link does not exist");
        }
    }
    
    @Override
    public List<LinkEntity> getLinksByProject(Long projectId) {
        Query query = em.createQuery("SELECT l from LinkEntity l WHERE l.sourceTask.project.projectId = :inProjectId OR l.targetTask.project.projectId = :inProjectId");
        query.setParameter("inProjectId", projectId);
        
        return query.getResultList();
    }

    @Override
    public Long createNewLink(LinkEntity newLink) throws NoResultException {
        TaskEntity sourceTask = taskSessionBeanLocal.getTaskById(newLink.getSource());
        TaskEntity targetTask = taskSessionBeanLocal.getTaskById(newLink.getTarget());
        
        newLink.setSourceTask(sourceTask);
        newLink.setTargetTask(targetTask);
        
        em.persist(newLink);
        em.flush();
        
        return newLink.getId();
    }
    
    @Override
    public void deleteLink(Long linkId) throws NoResultException {
        LinkEntity linkToDelete = this.getLinkById(linkId);
        
        linkToDelete.setSourceTask(null);
        linkToDelete.setTargetTask(null);
        
        em.remove(linkToDelete);
    }
}
