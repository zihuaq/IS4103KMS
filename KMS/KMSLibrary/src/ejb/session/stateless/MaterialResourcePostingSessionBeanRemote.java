/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourcePostingEntity;
import java.util.List;

/**
 *
 * @author chai
 */
public interface MaterialResourcePostingSessionBeanRemote {
    public Long createMaterialResourcePosting(MaterialResourcePostingEntity newMrp, Long projectId, List<Long> tagIds) throws NoResultException;

    public MaterialResourcePostingEntity getMrpById(Long mrpId) throws NoResultException;

    public List<MaterialResourcePostingEntity> getListOfMaterialResourcePostingByProjectId(Long projectId);

    public void updateMaterialResourcePosting(MaterialResourcePostingEntity mrpToUpdate) throws NoResultException;

    public void deleteMaterialResourcePosting(Long mrpId) throws NoResultException;
    
    public List<MaterialResourcePostingEntity> getListOfAvailableMrp(Long projectId, Long activityId) throws NoResultException;
}
