/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.DonationEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author zihua
 */
@Stateless
public class DonationSessionBean implements DonationSessionBeanLocal {

    @EJB(name = "ProjectSessionBeanLocal")
    private ProjectSessionBeanLocal projectSessionBeanLocal;

    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;

    @Override
    public Long createNewDonation(DonationEntity newDonation, Long userId, Long projectId) throws NoResultException {
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        ProjectEntity project = projectSessionBeanLocal.getProjectById(projectId);
        
        user.getDonations().add(newDonation);
        
        if (project != null) {
            project.getDonations().add(newDonation);
            newDonation.setProject(project);  
        }
        
        em.persist(newDonation);
        em.flush();

        return newDonation.getDonationId();
    } 
    
}
