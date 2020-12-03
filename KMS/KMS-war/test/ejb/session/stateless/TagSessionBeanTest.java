/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import Exception.TagNameExistException;
import entity.TagEntity;
import entity.TagRequestEntity;
import entity.UserEntity;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import util.enumeration.TagTypeEnum;

/**
 *
 * @author chai
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class TagSessionBeanTest {

    UserSessionBeanRemote userSessionBean = lookupUserSessionBeanRemote();

    TagSessionBeanRemote tagSessionBean = lookupTagSessionBeanRemote();

    public TagSessionBeanTest() {
    }
    
    @Test
    public void test01GetTagById() throws NoResultException {
        Long expResult = 1l;
        
        TagEntity result = tagSessionBean.getTagById(expResult);
        
        assertEquals(expResult, result.getTagId());
    }
    
    @Test(expected=NoResultException.class)
    public void test02GetTagById() throws NoResultException {
        Long expResult = 100l;
        
        TagEntity result = tagSessionBean.getTagById(expResult);
        
        assertEquals(expResult, result.getTagId());
    }
    
    @Test
    public void test03CreateTagRequest() throws TagNameExistException, NoResultException {
        Boolean hasCreated = false;
        String expResult = "Test tag";
        UserEntity user = userSessionBean.getUserById(4l);

        TagRequestEntity tagRequest = new TagRequestEntity("Test tag", TagTypeEnum.SKILL, user);
        tagSessionBean.createTagRequest(tagRequest);
        
        List<TagRequestEntity> list = tagSessionBean.getTagRequests();
        for (TagRequestEntity tr: list) {
            if (tr.getRequestedName().equals(expResult)) {
                hasCreated = true;
            }
        }
        
        assertTrue(hasCreated);
    }
    
    @Test(expected=TagNameExistException.class)
    public void test04CreateTagRequest() throws TagNameExistException, NoResultException {
        Boolean hasCreated = false;
        String expResult = "SDG 1";
        UserEntity user = userSessionBean.getUserById(4l);
        
        TagRequestEntity tagRequest = new TagRequestEntity("Tech Support", TagTypeEnum.SKILL, user);
        tagSessionBean.createTagRequest(tagRequest);
        
        List<TagRequestEntity> list = tagSessionBean.getTagRequests();
        for (TagRequestEntity tr: list) {
            if (tr.getRequestedName().equals(expResult)) {
                hasCreated = true;
            }
        }
        
        assertTrue(hasCreated);
    }
    
    @Test
    public void test05GetTagRequests() {
        List result = tagSessionBean.getTagRequests();
        
        assertEquals(2, result.size());
    }
    
    @Test
    public void test06RejectTagRequest() throws NoResultException {
        Boolean contains = false;
        Long expResult = 1l;
        
        tagSessionBean.rejectTagRequest(expResult);
        
        List<TagRequestEntity> result = tagSessionBean.getTagRequests();
        
        for (TagRequestEntity tr: result) {
            if (tr.getTagRequestId() == expResult) {
                contains = true;
            }
        }
        
        assertFalse(contains);
    }
    
    @Test(expected=NoResultException.class)
    public void test07RejectTagRequest() throws NoResultException {
        Boolean contains = false;
        Long expResult = 10l;
        
        tagSessionBean.rejectTagRequest(expResult);
        
        List<TagRequestEntity> result = tagSessionBean.getTagRequests();
        
        for (TagRequestEntity tr: result) {
            if (tr.getTagRequestId() == expResult) {
                contains = true;
            }
        }
        
        assertFalse(contains);
    }
    
    @Test
    public void test08AcceptTagRequest() throws NoResultException, TagNameExistException {
        tagSessionBean.acceptTagRequest(2l);
        
        TagEntity result = tagSessionBean.getTagById(77l);
        
        assertNotNull(result);
    }
    
    @Test(expected=NoResultException.class)
    public void test09AcceptTagRequest() throws NoResultException, TagNameExistException {
        tagSessionBean.acceptTagRequest(5l);
        
        TagEntity result = tagSessionBean.getTagById(77l);
        
        assertNotNull(result);
    }
    
    @Test
    public void test10CreateNewTag() throws TagNameExistException {
        TagEntity tag = new TagEntity("Test tag 2", TagTypeEnum.SDG);
        
        tagSessionBean.createNewTag(tag);
        
        TagEntity result = new TagEntity();
        try {
            result = tagSessionBean.getTagById(78l);
        } catch (NoResultException ex) {
            assertFalse(true);
        }
        
        assertNotNull(result.getTagId());
    }
    
    @Test(expected=TagNameExistException.class)
    public void test11CreateNewTag() throws TagNameExistException {
        TagEntity tag = new TagEntity("Food", TagTypeEnum.MATERIALRESOURCE);
        
        tagSessionBean.createNewTag(tag);
        
        TagEntity result = new TagEntity();
        try {
            result = tagSessionBean.getTagById(78l);
        } catch (NoResultException ex) {
            assertFalse(true);
        }
        
        assertNotNull(result.getTagId());
    }
    
    @Test
    public void test12UpdateTag() throws TagNameExistException, NoResultException {
        Long tagId = 77l;
        String expResult = "Test Tag Update";
        TagEntity tag = tagSessionBean.getTagById(tagId);
        tag.setName(expResult);
        tagSessionBean.updateTag(tag);
        
        TagEntity result = tagSessionBean.getTagById(tagId);
        
        assertEquals(expResult, result.getName());
    }
    
    @Test(expected=NoResultException.class)
    public void test13UpdateTag() throws TagNameExistException, NoResultException {
        Long tagId = 100l;
        String expResult = "Test Tag Update";
        TagEntity tag = tagSessionBean.getTagById(tagId);
        tag.setName(expResult);
        tagSessionBean.updateTag(tag);
        
        TagEntity result = tagSessionBean.getTagById(tagId);
        
        assertEquals(expResult, result.getName());
    }
    
    @Test(expected=TagNameExistException.class)
    public void test14UpdateTag() throws TagNameExistException, NoResultException {
        Long tagId = 77l;
        String expResult = "Translation";
        TagEntity tag = tagSessionBean.getTagById(tagId);
        tag.setName(expResult);
        tagSessionBean.updateTag(tag);
        
        TagEntity result = tagSessionBean.getTagById(tagId);
        
        assertEquals(expResult, result.getName());
    }
    
    @Test
    public void test15GetAllSkillTags() {
        List result = tagSessionBean.getAllSkillTags();
        
        assertEquals(11, result.size());
    }
    
    @Test
    public void test16GetAllMaterialResourceTags() {
        List result = tagSessionBean.getAllMaterialResourceTags();
        
        assertEquals(13, result.size());
    }
    
    @Test
    public void test17GetAllSDGTags() {
        List result = tagSessionBean.getAllSDGTags();
        
        assertEquals(18, result.size());
    }
    
    @Test
    public void test18GetAllProfileReportTags() {
        List result = tagSessionBean.getAllProfileReportTags();
        
        assertEquals(6, result.size());
    }
    
    @Test
    public void test19GetAllGroupReportTags() {
        List result = tagSessionBean.getAllGroupReportTags();
        
        assertEquals(6, result.size());
    }
    
    @Test
    public void test20GetAllProjectReportTags() {
        List result = tagSessionBean.getAllProjectReportTags();
        
        assertEquals(6, result.size());
    }
    
    @Test
    public void test21etAllPostReportTags() {
        List result = tagSessionBean.getAllPostReportTags();
        
        assertEquals(6, result.size());
    }
    
    @Test
    public void test22GetAllCommentReportTags() {
        List result = tagSessionBean.getAllCommentReportTags();
        
        assertEquals(6, result.size());
    }
    
    @Test
    public void test23GetAllReviewReportTag() {
        List result = tagSessionBean.getAllReviewReportTags();
        
        assertEquals(6, result.size());
    }

    private TagSessionBeanRemote lookupTagSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (TagSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/TagSessionBean!ejb.session.stateless.TagSessionBeanRemote");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    private UserSessionBeanRemote lookupUserSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (UserSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/UserSessionBean!ejb.session.stateless.UserSessionBeanRemote");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
    
}
