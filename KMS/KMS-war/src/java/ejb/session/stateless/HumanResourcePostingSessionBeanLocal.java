/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.HumanResourcePostingEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author chai
 */
@Local
public interface HumanResourcePostingSessionBeanLocal {

    public Long createHumanResourcePostingEntity(HumanResourcePostingEntity newHrp, Long projectId) throws NoResultException;

    public HumanResourcePostingEntity getMrpById(Long mrpId) throws NoResultException;

    public List<HumanResourcePostingEntity> getListOfHumanResourcePostingByProjectId(Long projectId);

    public void updateMaterialResourcePosting(HumanResourcePostingEntity mrpToUpdate);

    public void deleteMaterialResourcePosting(Long hrpId) throws NoResultException;
    
}
