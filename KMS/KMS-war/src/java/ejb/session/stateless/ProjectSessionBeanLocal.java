/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateProjectException;
import Exception.NoResultException;
import entity.ProjectEntity;
import java.util.List;
import javax.ejb.Local;
import util.enumeration.ProjectStatusEnum;

/**
 *
 * @author chai
 */
@Local
public interface ProjectSessionBeanLocal {

    public Long createNewProject(ProjectEntity newProject, Long userId) throws CreateProjectException;

    public List<ProjectEntity> retrieveAllProject();

    public List<ProjectEntity> retrieveProjectByStatus(ProjectStatusEnum status);

    public ProjectEntity getProjectById(Long projectId);

    public void addContributor(Long projectId, Long userId) throws NoResultException;

    public void removeContributor(Long projectId, Long userId) throws NoResultException;

    public void updateProject(ProjectEntity projectToUpdate);

    public void updateStatus(Long projectId, ProjectStatusEnum status);

    public void addAdmin(Long projectId, Long userId) throws NoResultException;

    public void removeAdmin(Long projectId, Long userId) throws NoResultException;

    public void changeOwner(Long projectId, Long newOwnerId) throws NoResultException;
    
}