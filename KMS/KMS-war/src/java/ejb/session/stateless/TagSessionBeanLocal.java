/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.TagEntity;
import Exception.TagNameExistException;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface TagSessionBeanLocal {

    public TagEntity getTagById(long tagId) throws NoResultException;
    
    public void createNewTag (TagEntity tag) throws TagNameExistException;
    
    public List<TagEntity> getAllSkillTags();
    
    public List<TagEntity> getAllMaterialResourceTags();
    
    public List<TagEntity> getAllSDGTags();
    
    public List<TagEntity> getAllReportTags();

}
