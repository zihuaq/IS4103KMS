/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.TaskEntity;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

/**
 *
 * @author chai
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class TaskSessionBeanTest {

    TaskSessionBeanRemote taskSessionBean = lookupTaskSessionBeanRemote();

    public TaskSessionBeanTest() {
    }
    
    @Test
    public void test01GetTaskByProject() throws NoResultException {
        List result = taskSessionBean.getTasksByProject(4l);
        
        assertEquals(4, result.size());
    }
    
    @Test(expected=NoResultException.class)
    public void test02GetTaskByProject() throws NoResultException {
        List result = taskSessionBean.getTasksByProject(20l);
        
        assertEquals(4, result.size());
    }
    
    @Test
    public void test03GetTaskById() throws NoResultException {
        Long expResult = 1l;
        
        TaskEntity result = taskSessionBean.getTaskById(expResult);
        
        assertEquals(expResult, result.getId());
    }
    
    @Test(expected=NoResultException.class)
    public void test04GetTaskById() throws NoResultException {
        Long expResult = 10l;
        
        TaskEntity result = taskSessionBean.getTaskById(expResult);
        
        assertEquals(expResult, result.getId());
    }
    
    @Test
    public void test05CreateNewTask() throws NoResultException {
        
        Date startDate = new Date();
        Date endDate = new Date();
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-01 8:00");
            endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-12-28 12:00");
        } catch (ParseException ex) {
            System.out.println("Wrong format");
        }
        Long result = taskSessionBean.createNewTask(new TaskEntity("Budget Planning", startDate, endDate, 0.3, 0l), 3l);
        
        assertNotNull(result);
    }
    
    @Test(expected=NoResultException.class)
    public void test06CreateNewTask() throws NoResultException {
        
        Date startDate = new Date();
        Date endDate = new Date();
        try {
            startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-10-01 8:00");
            endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm").parse("2020-12-28 12:00");
        } catch (ParseException ex) {
            System.out.println("Wrong format");
        }
        Long result = taskSessionBean.createNewTask(new TaskEntity("Test", startDate, endDate, 0.3, 0l), 20l);
        
        assertNotNull(result);
    }
    
    @Test
    public void test07UpdateTask() throws NoResultException {
        String expResult = "Test Task";
        
        Long taskId = 5l;
        TaskEntity task = taskSessionBean.getTaskById(taskId);
        task.setText(expResult);
        
        taskSessionBean.updateTask(task);
        
        TaskEntity result = taskSessionBean.getTaskById(taskId);
        
        assertEquals(expResult, result.getText());
    }
    
    @Test(expected=NoResultException.class)
    public void test08UpdateTask() throws NoResultException {
        String expResult = "Test Task";
        
        Long taskId = 10l;
        TaskEntity task = taskSessionBean.getTaskById(taskId);
        task.setText(expResult);
        
        taskSessionBean.updateTask(task);
        
        TaskEntity result = taskSessionBean.getTaskById(taskId);
        
        assertEquals(expResult, result.getText());
    }
    
    @Test(expected=NoResultException.class)
    public void test09DeleteTask() throws NoResultException {
        Long taskToDeleteId = 5l;
        
        taskSessionBean.deleteTask(taskToDeleteId);
        
        TaskEntity result = taskSessionBean.getTaskById(taskToDeleteId);
    }

    private TaskSessionBeanRemote lookupTaskSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (TaskSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/TaskSessionBean!ejb.session.stateless.TaskSessionBeanRemote");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
    
    
}
