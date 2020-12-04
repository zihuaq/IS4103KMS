/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateGroupException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
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
import entity.UserEntity;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

/**
 *
 * @author Jeremy
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class GroupSessionBeanTest {

    UserSessionBeanRemote userSessionBean = lookupUserSessionBeanRemote();

    TagSessionBeanRemote tagSessionBean = lookupTagSessionBeanRemote();

    GroupSessionBeanRemote groupSessionBean = lookupGroupSessionBeanRemote();

    public GroupSessionBeanTest() {
    }

    @Test
    public void testCreateNewGroup() throws CreateGroupException, NoResultException {
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
    public void testRetrieveAllGroup() {
        List<GroupEntity> groups = groupSessionBean.retrieveAllGroup();
        assertFalse(groups.isEmpty());
    }

    @Test
    public void testGetGroupById() throws NoResultException {
        GroupEntity groupEntity = groupSessionBean.getGroupById(2l);
        assertTrue(groupEntity.getGroupId() == 2l);
    }

    @Test(expected = NoResultException.class)
    public void testGetGroupByIdInvalidId() throws NoResultException {
        groupSessionBean.getGroupById(-1l);
    }

    @Test
    public void testJoinGroup() throws NoResultException {
        groupSessionBean.joinGroup(2l, 11l);
        boolean hasUser = false;
        List<UserEntity> members = groupSessionBean.getGroupById(2l).getGroupMembers();
        for (int i = 0; i < members.size(); i++) {
            if (members.get(i).getUserId() == 11l) {
                hasUser = true;
            }
        }
        assertTrue(hasUser);
    }

    @Test(expected = NoResultException.class)
    public void testJoinGroupInvalidGroupId() throws NoResultException {
        groupSessionBean.joinGroup(-1l, 10l);
    }

    @Test(expected = NoResultException.class)
    public void testJoinGroupInvalidUserId() throws NoResultException {
        groupSessionBean.joinGroup(2l, -1l);
    }

    @Test
    public void testRemoveMember() throws Exception {
        groupSessionBean.joinGroup(2l, 1l);
        boolean hasUser = false;
        List<UserEntity> members = groupSessionBean.getGroupById(2l).getGroupMembers();
        for (int i = 0; i < members.size(); i++) {
            if (members.get(i).getUserId() == 1l) {
                hasUser = true;
            }
        }
        assertTrue(hasUser);
        groupSessionBean.removeMember(2l, 1l);
        hasUser = false;
        members = groupSessionBean.getGroupById(2l).getGroupMembers();
        for (int i = 0; i < members.size(); i++) {
            if (members.get(i).getUserId() == 1l) {
                hasUser = true;
            }
        }
        assertFalse(hasUser);
    }

    @Test(expected = InvalidRoleException.class)
    public void testRemoveMemberGroupOwner() throws InvalidRoleException, NoResultException {
        long ownerUserId = groupSessionBean.getGroupById(2l).getGroupOwner().getUserId();
        groupSessionBean.removeMember(2l, ownerUserId);
    }

    @Test
    public void testUpdateGroup() throws Exception {
        GroupEntity group = new GroupEntity("group test", "great group", "Malaysia");
        group.setGroupId(2l);
        List<TagEntity> sdgs = tagSessionBean.getAllSDGTags();
        List<TagEntity> tag = new ArrayList<>();
        tag.add(tagSessionBean.getTagById(sdgs.get(1).getTagId()));
        tag.add(tagSessionBean.getTagById(sdgs.get(3).getTagId()));
        group.setSdgs(tag);
        groupSessionBean.updateGroup(group);
        GroupEntity result = groupSessionBean.getGroupById(2l);
        assertEquals("group test", result.getName());
        assertEquals("great group", result.getDescription());
        assertEquals("Malaysia", result.getCountry());
    }

    @Test(expected = NoResultException.class)
    public void testUpdateGroupInvalidGroup() throws Exception {
        GroupEntity group = new GroupEntity("group test", "great group", "Malaysia");
        group.setGroupId(-1l);
        List<TagEntity> sdgs = tagSessionBean.getAllSDGTags();
        List<TagEntity> tag = new ArrayList<>();
        tag.add(tagSessionBean.getTagById(sdgs.get(1).getTagId()));
        tag.add(tagSessionBean.getTagById(sdgs.get(3).getTagId()));
        group.setSdgs(tag);
        groupSessionBean.updateGroup(group);
    }

    @Test
    public void testAddAdmin() throws Exception {
        groupSessionBean.joinGroup(1l, 5l);
        groupSessionBean.addAdmin(1l, 5l);
        List<UserEntity> admins = groupSessionBean.getGroupById(1l).getGroupAdmins();
        boolean hasUser = false;
        for (int i = 0; i < admins.size(); i++) {
            if (admins.get(i).getUserId() == 5l) {
                hasUser = true;
            }
        }
        assertTrue(hasUser);
    }

    @Test(expected = NoResultException.class)
    public void testAddAdminInvalidGroup() throws Exception {
        groupSessionBean.addAdmin(-1l, 1l);
    }

    @Test
    public void testRemoveAdmin() throws Exception {
        groupSessionBean.joinGroup(2l, 5l);
        groupSessionBean.addAdmin(2l, 5l);
        List<UserEntity> admins = groupSessionBean.getGroupById(2l).getGroupAdmins();
        boolean hasUser = false;
        for (int i = 0; i < admins.size(); i++) {
            if (admins.get(i).getUserId() == 5l) {
                hasUser = true;
            }
        }
        assertTrue(hasUser);
        groupSessionBean.removeAdmin(2l, 5l);
        admins = groupSessionBean.getGroupById(2l).getGroupAdmins();
        hasUser = false;
        for (int i = 0; i < admins.size(); i++) {
            if (admins.get(i).getUserId() == 5l) {
                hasUser = true;
            }
        }
        assertFalse(hasUser);
    }
    
    @Test(expected = NoResultException.class)
    public void testRemoveAdminInvalidGroup() throws Exception {
        groupSessionBean.removeAdmin(-1l, 1l);
    }

    @Test
    public void testChangeOwner() throws Exception {
        groupSessionBean.joinGroup(1l, 2l);
        groupSessionBean.addAdmin(1l, 2l);
        groupSessionBean.changeOwner(1l, 2l);
        long result = groupSessionBean.getGroupById(1l).getGroupOwner().getUserId();
        assertEquals(2l, result);
    }

    @Test(expected = NoResultException.class)
    public void testDeleteGroup() throws Exception {
        groupSessionBean.deleteGroup(1l);
        groupSessionBean.getGroupById(1l);
    }
    
    @Test(expected = NoResultException.class)
    public void testDeleteGroupInvalidGroup() throws Exception {
        groupSessionBean.deleteGroup(-1l);
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
