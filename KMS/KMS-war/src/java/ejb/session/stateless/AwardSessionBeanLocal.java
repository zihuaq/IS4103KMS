/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.AwardEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author zeplh
 */
@Local
public interface AwardSessionBeanLocal {

    public AwardEntity getAwardById(Long awardId) throws NoResultException;

    public void withdrawAwardfromUser(Long awardId, Long userId) throws NoResultException;

    public void editAward(AwardEntity awardUpdates) throws NoResultException;

    public void issueAwardToUser(Long awardId, Long userId) throws NoResultException;

    public void deleteProjectAward(Long awardId) throws NoResultException;

    public Long createNewProjectAward(AwardEntity newAward, Long projectId) throws NoResultException;

    public List<AwardEntity> getProjectAwards(Long projectId) throws NoResultException;
    
}
