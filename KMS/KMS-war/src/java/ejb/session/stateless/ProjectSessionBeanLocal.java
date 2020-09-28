/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.CreateProjectException;
import Exception.CreateProjectReviewException;
import Exception.CreateUserReviewException;
import Exception.InvalidRoleException;
import Exception.NoResultException;
import Exception.ProjectNotFoundException;
import entity.ProjectEntity;
import entity.ReviewEntity;
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

    public void joinProject(Long projectId, Long userId) throws NoResultException;

    public void removeMember(Long projectId, Long userId) throws NoResultException, InvalidRoleException;

    public void updateProject(ProjectEntity projectToUpdate);

    public void updateStatus(Long projectId, String status);

    public void addAdmin(Long projectId, Long userId) throws NoResultException;

    public void removeAdmin(Long projectId, Long userId) throws NoResultException;

    public void changeOwner(Long projectId, Long newOwnerId) throws NoResultException;

    public List<ReviewEntity> getProjectReviews(Long projectId) throws ProjectNotFoundException;

    public Long createNewProjectReview(ReviewEntity newReview, Long projectId, Long fromUserId) throws CreateProjectReviewException;

    public Long createNewUserReview(ReviewEntity newReview, Long projectId, Long fromUserId, Long toUserId) throws CreateUserReviewException;
    
}
