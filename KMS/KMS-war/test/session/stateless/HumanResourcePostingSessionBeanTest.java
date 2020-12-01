/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session.stateless;

import Exception.NoResultException;
import ejb.session.stateless.HumanResourcePostingSessionBeanRemote;
import entity.HumanResourcePostingEntity;
import entity.UserEntity;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import org.junit.Test;

/**
 *
 * @author chai
 */
public class HumanResourcePostingSessionBeanTest {    

    HumanResourcePostingSessionBeanRemote humanResourcePostingSessionBean = lookupHumanResourcePostingSessionBeanRemote();

    
    public HumanResourcePostingSessionBeanTest() {
    }
    
    @Test
    public void testCreateHumanResourcePostingEntity() throws NoResultException {
        Date startDate = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.DAY_OF_MONTH, 1);
        Date endDate = cal.getTime();
        HumanResourcePostingEntity newHrp = new HumanResourcePostingEntity("Hrp1", 5, 0, 0, "Description", startDate, endDate, 1.3008, 103.9122);
        Long projectId = 1l;
        List<Long> tagIds = new ArrayList<>();
        tagIds.add(9l);
        Long result = humanResourcePostingSessionBean.createHumanResourcePostingEntity(newHrp, projectId, tagIds);
        
        assertNotNull(result);
    }
    
    @Test
    public void testGetHrpById() throws NoResultException {
        Long expResult = 1l;
        
        HumanResourcePostingEntity result = humanResourcePostingSessionBean.getHrpById(1l);
        assertEquals(expResult, result.getHumanResourcePostingId());
    }
    
    @Test(expected=NoResultException.class)
    public void testGetHrpById2() throws NoResultException {
        Long hrpId = 10l;
        
        HumanResourcePostingEntity result = humanResourcePostingSessionBean.getHrpById(hrpId);
        assertNotNull(result);
    }
    
    @Test
    public void testGetListOfHumanResourcePostingByProjectId() {
        List result = humanResourcePostingSessionBean.getListOfHumanResourcePostingByProjectId(4l);
        
        assertFalse(result.isEmpty());
        assertEquals(3, result.size());
    }
    
    @Test
    public void testUpdateHumanResourcePosting() throws NoResultException{
        
    }
    
    @Test
    public void testDeleteHumanResourcePosting() throws NoResultException{
        
    }
    
    @Test
    public void testJoinHrp() throws NoResultException {
        Long expResult = 1l;
        Long hrpId = 1l;
        humanResourcePostingSessionBean.joinHrp(expResult, hrpId);
        
        HumanResourcePostingEntity hrp = humanResourcePostingSessionBean.getHrpById(hrpId);

        for (UserEntity user: hrp.getAppliedUsers()) {
            if (user.getUserId() == expResult) {
                assertEquals(expResult, user.getUserId());
            }
        }
    }
    
    @Test
    public void testLeaveHrp() throws NoResultException {
        
    }
    
    @Test
    public void testAvailableHrp() {
        Date startDate = new Date(2020, 11, 11);
        Date endDate = new Date(2020, 11, 20);
        
        List result = humanResourcePostingSessionBean.availableHrp(4l, startDate, endDate);
        
        assertEquals(1, result.size());
    }
    
    @Test
    public void testGetHrpByActivityId() {
        Long activityId = 4l;
        
        List result = humanResourcePostingSessionBean.getHrpByActivityId(activityId);
        
        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
    }

    private HumanResourcePostingSessionBeanRemote lookupHumanResourcePostingSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (HumanResourcePostingSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/HumanResourcePostingSessionBean!ejb.session.stateless.HumanResourcePostingSessionBeanRemote");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }

    
}
