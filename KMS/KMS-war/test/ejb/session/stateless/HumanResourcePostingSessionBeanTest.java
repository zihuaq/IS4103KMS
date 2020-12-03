/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
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
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

/**
 *
 * @author chai
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class HumanResourcePostingSessionBeanTest {    

    HumanResourcePostingSessionBeanRemote humanResourcePostingSessionBean = lookupHumanResourcePostingSessionBeanRemote();

    
    public HumanResourcePostingSessionBeanTest() {
    }
    
    @Test
    public void test01CreateHumanResourcePostingEntity() throws NoResultException {
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
    
    @Test(expected=NoResultException.class)
    public void test02CreateHumanResourcePostingEntity() throws NoResultException {
        Date startDate = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        cal.add(Calendar.DAY_OF_MONTH, 1);
        Date endDate = cal.getTime();
        HumanResourcePostingEntity newHrp = new HumanResourcePostingEntity("Hrp1", 5, 0, 0, "Description", startDate, endDate, 1.3008, 103.9122);
        Long projectId = 10l;
        List<Long> tagIds = new ArrayList<>();
        tagIds.add(9l);
        Long result = humanResourcePostingSessionBean.createHumanResourcePostingEntity(newHrp, projectId, tagIds);
        
        assertNotNull(result);
    }
    
    @Test
    public void test03GetHrpById() throws NoResultException {
        Long expResult = 1l;
        
        HumanResourcePostingEntity result = humanResourcePostingSessionBean.getHrpById(1l);
        assertEquals(expResult, result.getHumanResourcePostingId());
    }
    
    @Test(expected=NoResultException.class)
    public void test04GetHrpById() throws NoResultException {
        Long hrpId = 10l;
        
        HumanResourcePostingEntity result = humanResourcePostingSessionBean.getHrpById(hrpId);
        assertNotNull(result);
    }
    
    @Test
    public void test05GetListOfHumanResourcePostingByProjectId() {
        List result = humanResourcePostingSessionBean.getListOfHumanResourcePostingByProjectId(4l);
        
        assertFalse(result.isEmpty());
        assertEquals(4, result.size());
    }
    
    @Test
    public void test06UpdateHumanResourcePosting() throws NoResultException{
        Long hrpId = 3l;
        HumanResourcePostingEntity hrpToUpdate = humanResourcePostingSessionBean.getHrpById(hrpId);
        String expResult = "Test description";
        hrpToUpdate.setDescription(expResult);
        
        humanResourcePostingSessionBean.updateHumanResourcePosting(hrpToUpdate);
        
        HumanResourcePostingEntity result = humanResourcePostingSessionBean.getHrpById(hrpId);
        
        assertEquals(expResult, result.getDescription());
    }
    
    @Test(expected=NoResultException.class)
    public void test07UpdateHumanResourcePosting() throws NoResultException{
        Long hrpId = 10l;
        HumanResourcePostingEntity hrpToUpdate = humanResourcePostingSessionBean.getHrpById(hrpId);
        String expResult = "Test description";
        hrpToUpdate.setDescription(expResult);
        
        humanResourcePostingSessionBean.updateHumanResourcePosting(hrpToUpdate);
        
        HumanResourcePostingEntity result = humanResourcePostingSessionBean.getHrpById(hrpId);
        
        assertEquals(expResult, result.getDescription());
    }
    
    @Test(expected=NoResultException.class)
    public void test08DeleteHumanResourcePosting() throws NoResultException{
        Long hrpToDeleteId = 4l;
        
        //delete hrp
        humanResourcePostingSessionBean.deleteHumanResourcePosting(hrpToDeleteId);
        
        // hrp deleted, throw NoResultException
        HumanResourcePostingEntity hrp = humanResourcePostingSessionBean.getHrpById(hrpToDeleteId);  
        
    }
    
    @Test
    public void test09JoinHrp() throws NoResultException {
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
    public void test10LeaveHrp() throws NoResultException {
        Boolean hasHrp = false;
        Long expResult = 1l;
        Long hrpId = 2l;
        humanResourcePostingSessionBean.leaveHrp(expResult, hrpId);
        
        HumanResourcePostingEntity hrp = humanResourcePostingSessionBean.getHrpById(hrpId);
        
        for (UserEntity user: hrp.getAppliedUsers()) {
            if (user.getUserId() == expResult) {
                hasHrp = true;
            }
        }
        
        assertFalse(hasHrp);
    }
    
    @Test
    public void test11AvailableHrp() {
        Date startDate = new Date();
        Date endDate = new Date();
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-11-11");
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-11-20");
        } catch (ParseException ex) {
            System.out.println("Wrong format");
        }
        List result = humanResourcePostingSessionBean.availableHrp(4l, startDate, endDate);
        
        assertEquals(1, result.size());
    }
    
    @Test
    public void test12GetHrpByActivityId() {
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
