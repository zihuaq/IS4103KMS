/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session.stateless;

import Exception.CreateGroupException;
import Exception.NoResultException;
import ejb.session.stateless.GroupSessionBeanRemote;
import entity.GroupEntity;
import entity.TagEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import ejb.session.stateless.TagSessionBeanRemote;

/**
 *
 * @author Jeremy
 */
public class GroupSessionBeanTest {

    TagSessionBeanRemote tagSessionBean = lookupTagSessionBeanRemote();

    GroupSessionBeanRemote groupSessionBean = lookupGroupSessionBeanRemote();

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
    }

    @After
    public void tearDown() {
        System.out.println("@After tearDown");
    }

    @Test
    public void testCreateNewGroupSuccess() throws CreateGroupException, NoResultException {
        System.out.println("testCreateNewGroupSuccess");
        GroupEntity newGroup = new GroupEntity("group 1", "this is group 1", "singapore");
        Long userId = 1l;
        List<TagEntity> sdgs = tagSessionBean.getAllSDGTags();
        List<Long> tagIds = new ArrayList<>();
        tagIds.add(sdgs.get(0).getTagId());
        tagIds.add(sdgs.get(3).getTagId());
        Long result = groupSessionBean.createNewGroup(newGroup, userId, tagIds);
        GroupEntity group = groupSessionBean.getGroupById(result);
        assertNotNull(group);
    }

    @Test(expected = CreateGroupException.class)
    public void testCreateNewGroupInvalidUser() throws CreateGroupException {
        System.out.println("testCreateNewGroupInvalidUser");
        GroupEntity newGroup = new GroupEntity("group 1", "this is group 1", "singapore");
        Long userId = -1l;
        List<TagEntity> sdgs = tagSessionBean.getAllSDGTags();
        List<Long> tagIds = new ArrayList<>();
        tagIds.add(sdgs.get(0).getTagId());
        tagIds.add(sdgs.get(3).getTagId());
        groupSessionBean.createNewGroup(newGroup, userId, tagIds);
    }


    @Test
    public void testRetrieveAllGroup() throws Exception {
        
        List<GroupEntity> groups = groupSessionBean.retrieveAllGroup();
        assertEquals(0, groups.size());
    }

    @Test
    public void testGetGroupById() throws Exception {

    }

    @Test
    public void testJoinGroup() throws Exception {

    }

    @Test
    public void testRemoveMember() throws Exception {

    }

    @Test
    public void testUpdateGroup() throws Exception {

    }

    @Test
    public void testAddAdmin() throws Exception {
    }

    @Test
    public void testRemoveAdmin() throws Exception {
    }

    @Test
    public void testChangeOwner() throws Exception {
    }

    @Test
    public void testDeleteGroup() throws Exception {
    }

    private GroupSessionBeanRemote lookupGroupSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (GroupSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/GroupSessionBean!ejb.session.stateless.GroupSessionBeanRemote");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
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
}
