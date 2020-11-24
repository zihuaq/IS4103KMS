/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.BadgeEntity;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author zeplh
 */
@Stateless
public class BadgeSessionBean implements BadgeSessionBeanLocal {

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @Override
    public List<BadgeEntity> getBadges(){
        List<BadgeEntity> badges = em.createQuery("SELECT b FROM BadgeEntity b").getResultList();
        return badges;
    }

   
}
