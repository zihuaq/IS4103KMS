/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.TagNameExistException;
import ejb.session.singleton.DataInitializationSessionBean;
import entity.GroupEntity;
import entity.ReviewEntity;
import entity.TagEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.ejb.embeddable.EJBContainer;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import util.enumeration.TagTypeEnum;

/**
 *
 * @author Jeremy
 */
public class GroupSessionBeanTest {

    private TagSessionBeanLocal tagSessionBean;

    private GroupSessionBeanLocal groupSessionBean;

    public GroupSessionBeanTest() {
    }

    @BeforeClass
    public static void setUpClass() {
    }

    @AfterClass
    public static void tearDownClass() {
    }

    @Before
    public void setUp() {
        System.out.println("@Before setUp");
        groupSessionBean = new GroupSessionBean();
        tagSessionBean = new TagSessionBean();
        try {
            tagSessionBean.createNewTag(new TagEntity("SDG 1", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 2", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 3", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 4", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 5", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 6", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 7", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 8", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 9", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 10", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 11", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 12", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 13", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 14", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 15", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 16", TagTypeEnum.SDG));
            tagSessionBean.createNewTag(new TagEntity("SDG 17", TagTypeEnum.SDG));
        } catch (TagNameExistException ex) {
            Logger.getLogger(GroupSessionBeanTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @After
    public void tearDown() {
        System.out.println("@After tearDown");
        groupSessionBean = null;
        tagSessionBean = null;
    }

    /**
     * Test of createNewGroup method, of class GroupSessionBean.
     */
    @Test
    public void testCreateNewGroup() throws Exception {
        System.out.println("createNewGroup");
        GroupEntity newGroup = new GroupEntity("group 1", "this is group 1", "singapore");
        Long userId = 1l;
        List<TagEntity> sdgs = tagSessionBean.getAllSDGTags();
        List<Long> tagIds = new ArrayList<>();
        tagIds.add(sdgs.get(0).getTagId());
        tagIds.add(sdgs.get(3).getTagId());
        Long expResult = 1l;
        Long result = groupSessionBean.createNewGroup(newGroup, userId, tagIds);
        assertEquals(expResult, result);
    }

    /**
     * Test of createNewUserReview method, of class GroupSessionBean.
     */
    @Test
    public void testCreateNewUserReview() throws Exception {
        System.out.println("createNewUserReview");
        ReviewEntity newReview = null;
        Long groupId = null;
        Long fromUserId = null;
        Long toUserId = null;
        GroupSessionBean instance = new GroupSessionBean();
        Long expResult = null;
        Long result = instance.createNewUserReview(newReview, groupId, fromUserId, toUserId);
        assertEquals(expResult, result);
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of retrieveAllGroup method, of class GroupSessionBean.
     */
    @Test
    public void testRetrieveAllGroup() throws Exception {
        System.out.println("retrieveAllGroup");
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        List<GroupEntity> expResult = null;
        List<GroupEntity> result = instance.retrieveAllGroup();
        assertEquals(expResult, result);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of getGroupById method, of class GroupSessionBean.
     */
    @Test
    public void testGetGroupById() throws Exception {
        System.out.println("getGroupById");
        Long groupId = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        GroupEntity expResult = null;
        GroupEntity result = instance.getGroupById(groupId);
        assertEquals(expResult, result);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of joinGroup method, of class GroupSessionBean.
     */
    @Test
    public void testJoinGroup() throws Exception {
        System.out.println("joinGroup");
        Long groupId = null;
        Long userId = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        instance.joinGroup(groupId, userId);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of removeMember method, of class GroupSessionBean.
     */
    @Test
    public void testRemoveMember() throws Exception {
        System.out.println("removeMember");
        Long groupId = null;
        Long userId = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        instance.removeMember(groupId, userId);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of updateGroup method, of class GroupSessionBean.
     */
    @Test
    public void testUpdateGroup() throws Exception {
        System.out.println("updateGroup");
        GroupEntity groupToUpdate = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        instance.updateGroup(groupToUpdate);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of addAdmin method, of class GroupSessionBean.
     */
    @Test
    public void testAddAdmin() throws Exception {
        System.out.println("addAdmin");
        Long groupId = null;
        Long userId = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        instance.addAdmin(groupId, userId);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of removeAdmin method, of class GroupSessionBean.
     */
    @Test
    public void testRemoveAdmin() throws Exception {
        System.out.println("removeAdmin");
        Long groupId = null;
        Long userId = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        instance.removeAdmin(groupId, userId);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of changeOwner method, of class GroupSessionBean.
     */
    @Test
    public void testChangeOwner() throws Exception {
        System.out.println("changeOwner");
        Long groupId = null;
        Long newOwnerId = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        instance.changeOwner(groupId, newOwnerId);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }

    /**
     * Test of deleteGroup method, of class GroupSessionBean.
     */
    @Test
    public void testDeleteGroup() throws Exception {
        System.out.println("deleteGroup");
        Long groupId = null;
        EJBContainer container = javax.ejb.embeddable.EJBContainer.createEJBContainer();
        GroupSessionBeanLocal instance = (GroupSessionBeanLocal) container.getContext().lookup("java:global/classes/GroupSessionBean");
        instance.deleteGroup(groupId);
        container.close();
        // TODO review the generated test code and remove the default call to fail.
        fail("The test case is a prototype.");
    }
}
