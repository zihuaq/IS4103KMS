/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourcePostingEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author chai
 */
@Local
public interface MaterialResourcePostingSessionBeanLocal {

    public Long createMaterialResourcePosting(MaterialResourcePostingEntity newMrp, Long projectId, List<Long> tagIds) throws NoResultException;

    public MaterialResourcePostingEntity getMrpById(Long mrpId) throws NoResultException;

    public List<MaterialResourcePostingEntity> getListOfMaterialResourcePostingByProjectId(Long projectId);

    public void updateMaterialResourcePosting(MaterialResourcePostingEntity mrpToUpdate);

    public void deleteMaterialResourcePosting(Long mrpId) throws NoResultException;
    
}