/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.BadgeEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author zeplh
 */
@Local
public interface BadgeSessionBeanLocal {

    public List<BadgeEntity> getBadges();
    
    //public Long createNewBadge(Long badgeId, String name, String description, Integer tierOneRequirement, Integer tierTwoRequirement, Integer tierThreeRequirement);

    public Long createNewBadge(BadgeEntity badge);

    
}
