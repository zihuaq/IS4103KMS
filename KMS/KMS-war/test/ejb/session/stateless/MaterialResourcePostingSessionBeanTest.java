/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.MaterialResourcePostingEntity;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
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
public class MaterialResourcePostingSessionBeanTest {

    MaterialResourcePostingSessionBeanRemote materialResourcePostingSessionBean = lookupMaterialResourcePostingSessionBeanRemote();

    public MaterialResourcePostingSessionBeanTest() {
    }
    
    @Test
    public void test01CreateMaterialPosting() throws NoResultException {        
        Date startDate = new Date();
        Date endDate = new Date();
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-12-15");
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-12-31");
        } catch (ParseException ex) {
            System.out.println("Wrong format");
        }
        MaterialResourcePostingEntity mrp = new MaterialResourcePostingEntity("Test Mrp", "kg", 100.0, 0.0, 100.0, "Test", startDate, endDate, 7.8731, 80.7718);
        
        Long result = materialResourcePostingSessionBean.createMaterialResourcePosting(mrp, 4l, new ArrayList<>(Arrays.asList(23l)));
        
        assertNotNull(result);
    }
    
    @Test(expected=NoResultException.class)
    public void test02CreateMaterialPosting() throws NoResultException {        
        Date startDate = new Date();
        Date endDate = new Date();
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-12-15");
            endDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-12-31");
        } catch (ParseException ex) {
            System.out.println("Wrong format");
        }
        MaterialResourcePostingEntity mrp = new MaterialResourcePostingEntity("Test Mrp", "kg", 100.0, 0.0, 100.0, "Test", startDate, endDate, 7.8731, 80.7718);
        
        Long result = materialResourcePostingSessionBean.createMaterialResourcePosting(mrp, 20l, new ArrayList<>(Arrays.asList(23l)));
        
        assertNotNull(result);
    }
    
    @Test
    public void test03GetMrpById() throws NoResultException {
        Long expResult = 1l;
        
        MaterialResourcePostingEntity result = materialResourcePostingSessionBean.getMrpById(expResult);
        
        assertEquals(expResult, result.getMaterialResourcePostingId());
    }
    
    @Test(expected=NoResultException.class)
    public void test04GetMrpById() throws NoResultException {
        Long expResult = 20l;
        
        MaterialResourcePostingEntity result = materialResourcePostingSessionBean.getMrpById(expResult);
        
        assertEquals(expResult, result.getMaterialResourcePostingId());
    }
    
    @Test
    public void test05GetListOfMaterialResourcePostingByProjectId() {
        List result = materialResourcePostingSessionBean.getListOfMaterialResourcePostingByProjectId(4l);
        
        assertFalse(result.isEmpty());
        assertEquals(4, result.size());
    }
    
    @Test
    public void test06UpdateMaterialResourcePosting() throws NoResultException{
        String expResult = "Test Description";
        
        Long mrpId = 4l;
        
        MaterialResourcePostingEntity mrp = materialResourcePostingSessionBean.getMrpById(mrpId);
        mrp.setDescription(expResult);
        
        materialResourcePostingSessionBean.updateMaterialResourcePosting(mrp);
        
        MaterialResourcePostingEntity result = materialResourcePostingSessionBean.getMrpById(mrpId);
        
        assertEquals(expResult, result.getDescription());
    }
    
    @Test(expected=NoResultException.class)
    public void test07UpdateMaterialResourcePosting() throws NoResultException{
        String expResult = "Test Description";
        
        Long mrpId = 20l;
        
        MaterialResourcePostingEntity mrp = materialResourcePostingSessionBean.getMrpById(mrpId);
        mrp.setDescription(expResult);
        
        materialResourcePostingSessionBean.updateMaterialResourcePosting(mrp);
        
        MaterialResourcePostingEntity result = materialResourcePostingSessionBean.getMrpById(mrpId);
        
        assertEquals(expResult, result.getDescription());
    }
    
    @Test(expected=NoResultException.class)
    public void test08DeleteMaterialResourcePosting() throws NoResultException {
        Long mrpToDeleteId = 4l;
        
        materialResourcePostingSessionBean.deleteMaterialResourcePosting(mrpToDeleteId);
        
        MaterialResourcePostingEntity result = materialResourcePostingSessionBean.getMrpById(mrpToDeleteId);
    }
    
    @Test
    public void test09GetListOfAvailableMrp() throws NoResultException {
        List result = materialResourcePostingSessionBean.getListOfAvailableMrp(4l, 3l);
        
        assertEquals(3, result.size());
    }
    
    @Test(expected=NoResultException.class)
    public void test10GetListOfAvailableMrp() throws NoResultException {
        List result = materialResourcePostingSessionBean.getListOfAvailableMrp(4l, 10l);
        
        assertEquals(1, result.size());
    }
    
    @Test
    public void test11GetAllMaterialResourcePosting() {
        List result = materialResourcePostingSessionBean.getAllMaterialResourcePosting();
        
        assertEquals(3, result.size());
    }
    

    private MaterialResourcePostingSessionBeanRemote lookupMaterialResourcePostingSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (MaterialResourcePostingSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/MaterialResourcePostingSessionBean!ejb.session.stateless.MaterialResourcePostingSessionBeanRemote");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
