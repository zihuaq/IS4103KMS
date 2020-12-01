/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session.stateless;

import Exception.CreateProjectException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import ejb.session.stateless.ProjectSessionBeanRemote;
import entity.ProjectEntity;
import entity.UserEntity;
import java.util.ArrayList;
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
import util.enumeration.ProjectStatusEnum;

/**
 *
 * @author chai
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class ProjectSessionBeanTest {

    ProjectSessionBeanRemote projectSessionBean = lookupProjectSessionBeanRemote();

    public ProjectSessionBeanTest() {
    }
    
    @Test
    public void test01CreateNewProject() throws CreateProjectException {
        ProjectEntity newProject = new ProjectEntity("Test Project", "Test", new Date(), "Singapore", null, 0.0, null);
        
        Long result = projectSessionBean.createNewProject(newProject, 1l, new ArrayList<>());
        
        assertNotNull(result);
    }
    
    @Test(expected=CreateProjectException.class)
    public void test02CreateNewProject() throws CreateProjectException {
        ProjectEntity newProject = new ProjectEntity("Test Project", "Test", new Date(), "Singapore", null, 0.0, null);
        
        Long result = projectSessionBean.createNewProject(newProject, 20l, new ArrayList<>());
        
        assertNotNull(result);
    }
    
    @Test
    public void test03RetrieveAllProject() {
        List result = projectSessionBean.retrieveAllProject();
        
        assertFalse(result.isEmpty());
        assertEquals(8, result.size());
    }
    
    @Test
    public void test04RetrieveProjectByStatus() {
        List result = projectSessionBean.retrieveProjectByStatus(ProjectStatusEnum.INACTIVE);
        
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }
    
    @Test
    public void test05GetProjectById() throws NoResultException {
        Long expResult = 1l;
        
        ProjectEntity result = projectSessionBean.getProjectById(expResult);
        
        assertEquals(expResult, result.getProjectId());
    }
    
    @Test(expected=NoResultException.class)
    public void test06GetProjectById() throws NoResultException {
        Long expResult = 20l;
        
        ProjectEntity result = projectSessionBean.getProjectById(expResult);
        
        assertEquals(expResult, result.getProjectId());
    }
    
    @Test
    public void test07JoinProject() throws NoResultException {
        Long expResult = 1l;
        Long projectId = 2l;
        
        projectSessionBean.joinProject(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: result.getProjectMembers()) {
            if (user.getUserId() == expResult) {
                assertEquals(expResult, user.getUserId());
            }
        }
    }
    
    @Test(expected=NoResultException.class)
    public void test08JoinProject() throws NoResultException {
        Long expResult = 1l;
        Long projectId = 20l;
        
        projectSessionBean.joinProject(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: result.getProjectMembers()) {
            if (user.getUserId() == expResult) {
                assertEquals(expResult, user.getUserId());
            }
        }
    }
    
    @Test
    public void test09RemoveMember() throws NoResultException, InvalidRoleException {
        Boolean result = false;
        Long userId = 1l;
        Long projectId = 2l;
        
        projectSessionBean.removeMember(projectId, userId);
        
        ProjectEntity project = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: project.getProjectMembers()) {
            if (user.getUserId() == userId) {
                result = true;
            }
        }
        
        assertFalse(result);
    }
    
    @Test(expected=NoResultException.class)
    public void test10RemoveMember() throws NoResultException, InvalidRoleException {
        Boolean result = false;
        Long userId = 20l;
        Long projectId = 2l;
        
        projectSessionBean.removeMember(projectId, userId);
        
        ProjectEntity project = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: project.getProjectMembers()) {
            if (user.getUserId() == userId) {
                result = true;
            }
        }
        
        assertFalse(result);
    }
    
    @Test(expected=InvalidRoleException.class)
    public void test11RemoveMember() throws NoResultException, InvalidRoleException {
        Boolean result = false;
        Long userId = 3l;
        Long projectId = 2l;
        
        projectSessionBean.removeMember(projectId, userId);
        
        ProjectEntity project = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: project.getProjectMembers()) {
            if (user.getUserId() == userId) {
                result = true;
            }
        }
        
        assertFalse(result);
    }
    
    @Test
    public void test12UpdateProject() throws NoResultException {
        Long projectId = 7l;
        
        ProjectEntity projectEntityToUpdate = projectSessionBean.getProjectById(projectId);
        
        String expResult = "Test Description";        
        projectEntityToUpdate.setDescription(expResult);
        
        projectSessionBean.updateProject(projectEntityToUpdate);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        assertEquals(expResult, result.getDescription());
    }
    
    @Test(expected=NoResultException.class)
    public void test13UpdateProject() throws NoResultException {
        Long projectId = 20l;
        
        ProjectEntity projectEntityToUpdate = projectSessionBean.getProjectById(projectId);
        
        String expResult = "Test Description";        
        projectEntityToUpdate.setDescription(expResult);
        
        projectSessionBean.updateProject(projectEntityToUpdate);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        assertEquals(expResult, result.getDescription());
    }
    
    @Test
    public void test14UpdateStatus() throws NoResultException {
        String expResult = "ACTIVE";
        Long projectId = 7l;
        projectSessionBean.updateStatus(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        assertEquals(expResult, result.getStatus().toString());
    }
    
    @Test(expected=NoResultException.class)
    public void test15UpdateStatus() throws NoResultException {
        String expResult = "ACTIVE";
        Long projectId = 20l;
        projectSessionBean.updateStatus(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        assertEquals(expResult, result.getStatus().toString());
    }
    
    @Test
    public void test16AddAdmin() throws NoResultException {
        Long expResult = 2l;
        Long projectId = 4l;
        
        projectSessionBean.addAdmin(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: result.getProjectAdmins()) {
            if (user.getUserId() == expResult) {
                assertEquals(expResult, user.getUserId());
            }
        }
    }
    
    @Test(expected=NoResultException.class)
    public void test17AddAdmin() throws NoResultException {
        Long expResult = 2l;
        Long projectId = 20l;
        
        projectSessionBean.addAdmin(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: result.getProjectAdmins()) {
            if (user.getUserId() == expResult) {
                assertEquals(expResult, user.getUserId());
            }
        }
    }
    
    @Test
    public void test18RemoveAdmin() throws NoResultException {
        Boolean result = false;
        Long expResult = 2l;
        Long projectId = 4l;
        
        projectSessionBean.removeAdmin(projectId, expResult);
        
        ProjectEntity project = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: project.getProjectAdmins()) {
            if (user.getUserId() == expResult) {
                result = true;
            }
        }
        
        assertFalse(result);
    }
    
    @Test(expected=NoResultException.class)
    public void test19RemoveAdmin() throws NoResultException {
        Boolean result = false;
        Long expResult = 2l;
        Long projectId = 20l;
        
        projectSessionBean.removeAdmin(projectId, expResult);
        
        ProjectEntity project = projectSessionBean.getProjectById(projectId);
        
        for (UserEntity user: project.getProjectAdmins()) {
            if (user.getUserId() == expResult) {
                result = true;
            }
        }
        
        assertFalse(result);
    }
    
    @Test
    public void test20ChangeOwner() throws NoResultException {
        Long expResult = 1l;
        Long projectId = 4l;
        
        projectSessionBean.changeOwner(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        assertEquals(expResult, result.getProjectOwner().getUserId());
    }
    
    @Test(expected=NoResultException.class)
    public void test21ChangeOwner() throws NoResultException {
        Long expResult = 1l;
        Long projectId = 20l;
        
        projectSessionBean.changeOwner(projectId, expResult);
        
        ProjectEntity result = projectSessionBean.getProjectById(projectId);
        
        assertEquals(expResult, result.getProjectOwner().getUserId());
    }
    
    @Test(expected=NoResultException.class)
    public void test22DeleteProject() throws NoResultException {
        Long projectToDeleteId = 7l;
        
        projectSessionBean.deleteProject(projectToDeleteId);
        
        ProjectEntity project = projectSessionBean.getProjectById(projectToDeleteId);
    }
    
    @Test
    public void test23GetProjectReview() throws NoResultException {
        List result = projectSessionBean.getProjectReviews(4l);
        
        assertEquals(1, result.size());
    }
    
    @Test(expected=NoResultException.class)
    public void test24GetProjectReview() throws NoResultException {
        List result = projectSessionBean.getProjectReviews(20l);
        
        assertEquals(1, result.size());
    }

    private ProjectSessionBeanRemote lookupProjectSessionBeanRemote() {
        try {
            Context c = new InitialContext();
            return (ProjectSessionBeanRemote) c.lookup("java:global/KMS/KMS-war/ProjectSessionBean!ejb.session.stateless.ProjectSessionBeanRemote");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
