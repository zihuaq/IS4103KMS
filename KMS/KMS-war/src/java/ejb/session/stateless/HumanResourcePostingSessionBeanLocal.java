/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.HumanResourcePostingEntity;
import java.util.Date;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author chai
 */
@Local
public interface HumanResourcePostingSessionBeanLocal {

    public Long createHumanResourcePostingEntity(HumanResourcePostingEntity newHrp, Long projectId, List<Long> tagIds) throws NoResultException;

    public HumanResourcePostingEntity getHrpById(Long hrpId) throws NoResultException;

    public List<HumanResourcePostingEntity> getListOfHumanResourcePostingByProjectId(Long projectId);

    public void updateHumanResourcePosting(HumanResourcePostingEntity hrpToUpdate) throws NoResultException;

    public void deleteHumanResourcePosting(Long hrpId) throws NoResultException;

    public void joinHrp(Long userId, Long hrpId) throws NoResultException;

    public void leaveHrp(Long userId, Long hrpId) throws NoResultException;

    public List<HumanResourcePostingEntity> availableHrp(Long projectId, Date startDate, Date endDate);

    public List<HumanResourcePostingEntity> getHrpByActivityId(Long activityId);
    
}
