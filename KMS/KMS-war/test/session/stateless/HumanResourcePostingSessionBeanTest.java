/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session.stateless;

import Exception.NoResultException;
import ejb.session.stateless.HumanResourcePostingSessionBeanLocal;
import entity.HumanResourcePostingEntity;
import entity.UserEntity;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
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

    HumanResourcePostingSessionBeanLocal humanResourcePostingSessionBean = lookupHumanResourcePostingSessionBeanLocal();
    
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
//        Date startDate = new Date();
//        Date endDate = new Date();
//        try {            
//            startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-31");
//            endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-11-31");
//        } catch (ParseException ex) {
//            System.out.println("Wrong format");
//        }
//        HumanResourcePostingEntity expResult = new HumanResourcePostingEntity();
//        expResult.setName("Volunteer");
//        expResult.setTotalSlots(10);
//        expResult.setObtainedSlots(0);
//        expResult.setLackingSlots(0);
//        expResult.setDescription("No Skills Needed");
//        expResult.setStartDate(startDate);
//        expResult.setEndDate(endDate);
//        expResult.setLatitude(1.3008);
//        expResult.setLongitude(103.9122);

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
        assertEquals(2, result.size());
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
        Date startDate = new Date();
        Date endDate = new Date();
        try {            
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-31");
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-11-31");
        } catch (ParseException ex) {
            System.out.println("Wrong format");
        }
        
        List result = humanResourcePostingSessionBean.availableHrp(4l, startDate, endDate);
        
        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
    }
    
    @Test
    public void testGetHrpByActivityId() {
        Long activityId = 4l;
        
        List result = humanResourcePostingSessionBean.getHrpByActivityId(activityId);
        
        assertFalse(result.isEmpty());
        assertEquals(2, result.size());
    }

    private HumanResourcePostingSessionBeanLocal lookupHumanResourcePostingSessionBeanLocal() {
        try {
            Context c = new InitialContext();
            return (HumanResourcePostingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/HumanResourcePostingSessionBean!ejb.session.stateless.HumanResourcePostingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
    
}
