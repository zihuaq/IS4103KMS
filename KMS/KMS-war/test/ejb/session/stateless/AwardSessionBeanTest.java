/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.DuplicateAwardException;
import Exception.DuplicateEmailException;
import Exception.NoResultException;
import ejb.session.stateless.AwardSessionBeanRemote;
import ejb.session.stateless.UserSessionBeanRemote;
import entity.AwardEntity;
import entity.UserEntity;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import org.junit.AfterClass;
import static org.junit.Assert.assertNotNull;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import org.junit.BeforeClass;
import util.enumeration.UserTypeEnum;
import util.enumeration.UserTypeEnum;

/**
 *
 * @author Cassie
 */
public class AwardSessionBeanTest {

    UserSessionBeanRemote userSessionBean = lookupUserSessionBeanRemote();

    AwardSessionBeanRemote awardSessionBean = lookupAwardSessionBeanRemote();

    public AwardSessionBeanTest() {
    }

    @Test
    public void testCreateNewProjectAwardSuccess() throws NoResultException {
        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long projectId = 1l;
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        AwardEntity awardRetrieved = awardSessionBean.getAwardById(result);
        assertNotNull(awardRetrieved);
        assertEquals(awardRetrieved.getAwardId(), result);
        assertEquals(awardRetrieved.getName(), "Test award");
        assertEquals(awardRetrieved.getDescription(), "Award description");
    }

    @Test(expected = NoResultException.class)
    public void testCreateNewAwardInvalidProjectId() throws NoResultException {
        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long projectId = -1l;
        awardSessionBean.createNewProjectAward(award, projectId);
    }

    @Test
    public void testGetAwardByIdSuccessfully() throws NoResultException {
        Long expResult = 1l;

        AwardEntity result = awardSessionBean.getAwardById(1l);
        assertEquals(expResult, result.getAwardId());
    }

    @Test(expected = NoResultException.class)
    public void testGetAwardByIdInvalidAwardId() throws NoResultException {
        Long awardId = -1l;
        awardSessionBean.getAwardById(awardId);
    }

    @Test
    public void testEditAwardSuccess() throws NoResultException {
        AwardEntity award = new AwardEntity();
        award.setName("Initial name");
        award.setDescription("Initial description");
        Long projectId = 1l;
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        AwardEntity awardRetrieved = awardSessionBean.getAwardById(result);

        awardRetrieved.setName("New name");
        awardRetrieved.setDescription("New description");
        awardSessionBean.editAward(awardRetrieved);
        AwardEntity updatedAward = awardSessionBean.getAwardById(result);
        assertEquals("New name", updatedAward.getName());
        assertEquals("New description", updatedAward.getDescription());
    }

    @Test(expected = NoResultException.class)
    public void testEditAwardInvalidAwardId() throws NoResultException {
        AwardEntity invalidAward = new AwardEntity();
        Long awardId = -1l;
        invalidAward.setAwardId(awardId);
        awardSessionBean.editAward(invalidAward);
    }

    //Cannot retrieve award after deleting
    @Test(expected = NoResultException.class)
    public void testDeleteProjectAwardSuccess_deletedAwardCannotBeRetrieved() throws NoResultException {
        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long projectId = 1l;
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        AwardEntity awardRetrieved = awardSessionBean.getAwardById(result);

        awardSessionBean.deleteProjectAward(result);
        awardSessionBean.getAwardById(result);
    }

    //Deleted award removed from project
    @Test
    public void testDeleteProjectAwardSuccess_deletedAwardRemovedFromProject() throws NoResultException {
        Long projectId = 1l;

        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        AwardEntity awardCreated = awardSessionBean.getAwardById(result);

        List<AwardEntity> projectAwards = awardSessionBean.getProjectAwards(projectId);
        int numAwardBeforeDeleting = projectAwards.size();

        awardSessionBean.deleteProjectAward(result);
        List<AwardEntity> updatedProjectAwards = awardSessionBean.getProjectAwards(projectId);

        assertEquals(numAwardBeforeDeleting - 1, updatedProjectAwards.size());
        assertFalse(updatedProjectAwards.contains(awardCreated));
    }

    @Test(expected = NoResultException.class)
    public void testDeleteAwardInvalidProjectId() throws NoResultException {
        Long awardId = -1l;
        awardSessionBean.deleteProjectAward(awardId);
    }

    @Test
    public void testGetProjectAwardsSuccessfully() throws NoResultException {
        Long projectId = 1l;

        List<AwardEntity> projectAwards = awardSessionBean.getProjectAwards(projectId);
        int numAwardBeforeCreating = projectAwards.size();

        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        AwardEntity awardCreated = awardSessionBean.getAwardById(result);

        List<AwardEntity> updatedProjectAwards = awardSessionBean.getProjectAwards(projectId);

        assertEquals(numAwardBeforeCreating + 1, updatedProjectAwards.size());
        assertTrue(updatedProjectAwards.contains(awardCreated));
    }

    @Test(expected = NoResultException.class)
    public void testGetProjectAwardsInvalidProjectId() throws NoResultException {
        Long projectId = -1l;
        awardSessionBean.getProjectAwards(projectId);
    }

    @Test
    public void testIssueAwardToUserSuccessfully() throws NoResultException, DuplicateAwardException, DuplicateEmailException {
        Long projectId = 1l;

        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        UserEntity user = userSessionBean.createNewUser(new UserEntity("Jeremy", "Chua", new Date(), "Male", "abcde6@gmail.com", "1", new Date(), UserTypeEnum.ADMIN));

        awardSessionBean.issueAwardToUser(user.getUserId(), result);
        AwardEntity awardRetrieved = awardSessionBean.getAwardById(result);
        UserEntity userAfterIssuingAward = userSessionBean.getUserById(user.getUserId());
        assertTrue(awardRetrieved.getUsersReceived().contains(userAfterIssuingAward));
        assertTrue(userAfterIssuingAward.getReceivedAwards().contains(awardRetrieved));
    }

    @Test(expected = NoResultException.class)
    public void testIssueAwardToUserInvalidAwardId() throws NoResultException, DuplicateAwardException {
        Long awardId = -1l;
        awardSessionBean.issueAwardToUser(1l, awardId);
    }

    @Test(expected = NoResultException.class)
    public void testIssueAwardToUserInvalidUserId() throws NoResultException, DuplicateAwardException {
        Long userId = -1l;
        awardSessionBean.issueAwardToUser(userId, 1l);
    }

    @Test(expected = DuplicateAwardException.class)
    public void testIssueAwardToUserDuplicateAward() throws NoResultException, DuplicateAwardException, DuplicateEmailException {
        Long projectId = 1l;

        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        UserEntity user = userSessionBean.createNewUser(new UserEntity("Jeremy", "Chua", new Date(), "Male", "fghij6@gmail.com", "1", new Date(), UserTypeEnum.ADMIN));

        awardSessionBean.issueAwardToUser(user.getUserId(), result);
        awardSessionBean.issueAwardToUser(user.getUserId(), result);
    }

    @Test
    public void testWithdrawAwardfromUserSuccessfully() throws NoResultException, DuplicateAwardException, DuplicateEmailException {
        Long projectId = 1l;

        AwardEntity award = new AwardEntity();
        award.setName("Test award");
        award.setDescription("Award description");
        Long result = awardSessionBean.createNewProjectAward(award, projectId);
        UserEntity user = userSessionBean.createNewUser(new UserEntity("Jeremy", "Chua", new Date(), "Male", "klmnop6@gmail.com", "1", new Date(), UserTypeEnum.ADMIN));

        awardSessionBean.issueAwardToUser(user.getUserId(), result);
        awardSessionBean.withdrawAwardfromUser(result, user.getUserId());

        AwardEntity awardRetrieved = awardSessionBean.getAwardById(result);
        UserEntity userAfterAwardWithdrew = userSessionBean.getUserById(user.getUserId());
        assertFalse(awardRetrieved.getUsersReceived().contains(userAfterAwardWithdrew));
        assertFalse(userAfterAwardWithdrew.getReceivedAwards().contains(awardRetrieved));
    }

    @Test(expected = NoResultException.class)
    public void testWithdrawAwardfromUserInvalidAwardId() throws NoResultException, DuplicateAwardException {
        Long awardId = -1l;
        awardSessionBean.withdrawAwardfromUser(1l, awardId);
    }

    @Test(expected = NoResultException.class)
    public void testWithdrawAwardfromUserInvalidUserId() throws NoResultException, DuplicateAwardException {
        Long userId = -1l;
        awardSessionBean.withdrawAwardfromUser(userId, 1l);
    }

    private AwardSessionBeanRemote lookupAwardSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (AwardSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/AwardSessionBean!ejb.session.stateless.AwardSessionBeanRemote");
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
