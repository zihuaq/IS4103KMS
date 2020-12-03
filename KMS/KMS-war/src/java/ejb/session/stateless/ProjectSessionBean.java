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
import Exception.UserNotFoundException;
import entity.ActivityEntity;
import entity.AwardEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourcePostingEntity;
import entity.PostEntity;
import entity.ProjectEntity;
import entity.ReportEntity;
import entity.ReviewEntity;
import entity.TagEntity;
import entity.TaskEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.ProjectStatusEnum;

/**
 *
 * @author chai
 */
@Stateless
public class ProjectSessionBean implements ProjectSessionBeanLocal {


    @EJB
    private AwardSessionBeanLocal awardSessionBean;

    @EJB
    private ReportSessionBeanLocal reportSessionBean;

    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @EJB(name = "ActivitySessionBeanLocal")
    private ActivitySessionBeanLocal activitySessionBeanLocal;
    
    @EJB(name = "UserSessionBeanLocal")
    private UserSessionBeanLocal userSessionBeanLocal;
    
    @EJB(name = "PostSessionBeanLocal")
    private PostSessionBeanLocal postSessionBeanLocal;
    
    @EJB(name = "TagSessionBeanLocal")
    private TagSessionBeanLocal tagSessionBeanLocal;
    
    @EJB(name = "HumanResourcePostingSessionBeanLocal")
    private HumanResourcePostingSessionBeanLocal humanResourcePostingSessionBeanLocal;

    @EJB(name = "MaterialResourcePostingSessionBeanLocal")
    private MaterialResourcePostingSessionBeanLocal materialResourcePostingSessionBeanLocal;
    
    @EJB(name = "TaskSessionBeanLocal")
    private TaskSessionBeanLocal taskSessionBeanLocal;
    
    
    
    
    
    @Override
    public Long createNewProject(ProjectEntity newProject, Long userId, List<Long> tagIds) throws CreateProjectException {
        try {
            UserEntity user = userSessionBeanLocal.getUserById(userId);
            em.persist(newProject);
            em.flush();
            user.setCountOfProjectsCreated(user.getCountOfProjectsCreated() + 1);
            user.setReputationPoints(user.getReputationPoints() + 5);
            newProject.setIsActive(Boolean.TRUE);
            user.getProjectsOwned().add(newProject);
            newProject.setProjectOwner(user);
            newProject.getProjectAdmins().add(user);
            user.getProjectsManaged().add(newProject);
            newProject.getProjectMembers().add(user);
            user.getProjectsJoined().add(newProject);
            
            for (Long tagId : tagIds) {
                TagEntity tag = tagSessionBeanLocal.getTagById(tagId);
                newProject.getSdgs().add(tag);
            }
            
            return newProject.getProjectId();
        } catch (NoResultException ex) {
            throw new CreateProjectException("User not found");
        }
    }
    
//    @Override
//    public Long createNewProjectReview(ReviewEntity newReview, Long projectId, Long fromUserId)throws CreateProjectReviewException{
//        try {
//            UserEntity user = userSessionBeanLocal.getUserById(fromUserId);
//            ProjectEntity project = getProjectById(projectId);
//            em.persist(newReview);
//            em.flush();
//            
//            user.getReviewsGiven().add(newReview);
//            project.getReviews().add(newReview);
//            newReview.setFrom(user);
//            newReview.setProject(project);
//            
//            return newReview.getReviewId();
//        } catch (NoResultException ex) {
//            throw new CreateProjectReviewException("User not found");
//        }
//    }
//    
//    public Long createNewUserReview(ReviewEntity newReview, Long projectId, Long fromUserId, Long toUserId)throws CreateUserReviewException{
//        try {
//            UserEntity fromUser = userSessionBeanLocal.getUserById(fromUserId);
//            UserEntity toUser = userSessionBeanLocal.getUserById(toUserId);
//            ProjectEntity project = getProjectById(projectId);
//            em.persist(newReview);
//            em.flush();
//            
//            fromUser.getReviewsGiven().add(newReview);
//            toUser.getReviewsGiven().add(newReview);
//            project.getReviews().add(newReview);
//            newReview.setFrom(fromUser);
//            newReview.setTo(toUser);
//            newReview.setProject(project);
//            
//            return newReview.getReviewId();
//        } catch (NoResultException ex) {
//            throw new CreateUserReviewException("User not found");
//        }
//    }
    
    @Override
    public List<ProjectEntity> retrieveAllProject() {
        Query query = em.createQuery("SELECT p FROM ProjectEntity p");
        
        return query.getResultList();
    }
    
    @Override
    public List<ProjectEntity> retrieveProjectByStatus(ProjectStatusEnum status) {
        Query query = em.createQuery("SELECT p from ProjectEntity p WHERE p.status = :inStatus");
        query.setParameter("inStatus", status);
        
        return query.getResultList();
    }
    
    @Override
    public ProjectEntity getProjectById(Long projectId) throws NoResultException {
        ProjectEntity project = em.find(ProjectEntity.class, projectId);
        if (project != null) {
            return project;
        } else {
            throw new NoResultException("Project does not exists");
        }
    }
    
    //User join project
    @Override
    public void joinProject(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        user.setCountOfProjectsJoined(user.getCountOfProjectsJoined() + 1);
        user.setReputationPoints(user.getReputationPoints() + 1);
        user.getProjectsJoined().add(project);
        project.getProjectMembers().add(user); 

    }
    
    //Admin/Member leave project or Admin remove Admin/Member from project
    @Override
    public void removeMember(Long projectId, Long userId) throws NoResultException, InvalidRoleException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        if (project.getProjectOwner().getUserId().equals(userId)) {
            throw new InvalidRoleException("Owner cannot leave the project");

        } else {
            if (project.getProjectAdmins().contains(user)) {
                project.getProjectAdmins().remove(user);
                user.setCountOfProjectsJoined(user.getCountOfProjectsJoined() - 1);
                user.setReputationPoints(user.getReputationPoints() - 1);
                user.getProjectsManaged().remove(project);
            }
            user.getProjectsJoined().remove(project);
            project.getProjectMembers().remove(user);
        }
        
    }
    
    @Override
    public void updateProject(ProjectEntity projectToUpdate) throws NoResultException {
        ProjectEntity project = getProjectById(projectToUpdate.getProjectId());
        
        project.setName(projectToUpdate.getName());
        project.setDescription(projectToUpdate.getDescription());
        project.setCountry(projectToUpdate.getCountry());
        project.setMonetaryFundingRequired(projectToUpdate.getMonetaryFundingRequired());
        project.setPaypalEmail(projectToUpdate.getPaypalEmail());
        for (int i = 0; i < projectToUpdate.getSdgs().size(); i++) {
            TagEntity tag = em.find(TagEntity.class, projectToUpdate.getSdgs().get(i).getTagId());
           if (tag == null) {
               throw new NoResultException("SDG tag not found.");
           }
        }
        project.setSdgs(projectToUpdate.getSdgs());
        project.setStatus(projectToUpdate.getStatus());
        project.setProfilePicture(projectToUpdate.getProfilePicture());
        project.setIsActive(projectToUpdate.getIsActive());
        
    }
    
    //Change project status
    @Override
    public void updateStatus(Long projectId, String status) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);

        project.setStatus(ProjectStatusEnum.valueOf(status));
    }
    
    //Promote Member to Admin
    @Override
    public void addAdmin(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getProjectAdmins().add(user);
        user.getProjectsManaged().add(project);
    }
    
    //Demote Admin to Member
    @Override
    public void removeAdmin(Long projectId, Long userId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(userId);
        
        project.getProjectAdmins().remove(user);
        user.getProjectsManaged().remove(project);
    }
    
    //Pass Owner status to Admin
    @Override
    public void changeOwner(Long projectId, Long newOwnerId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        UserEntity user = userSessionBeanLocal.getUserById(newOwnerId);
        user.setCountOfGroupsCreated(user.getCountOfGroupsCreated() + 1);
        user.setReputationPoints(user.getReputationPoints() + 5);
        
        project.getProjectOwner().getProjectsOwned().remove(project);
        project.getProjectOwner().setCountOfGroupsCreated(project.getProjectOwner().getCountOfGroupsCreated() - 1);
        project.getProjectOwner().setReputationPoints(project.getProjectOwner().getReputationPoints() - 5);
        
        project.setProjectOwner(user);
        user.getProjectsOwned().add(project);
    }
    
    @Override
    public void deleteProject(Long projectId)  throws NoResultException {
        ProjectEntity projectToDelete = getProjectById(projectId);
        
        projectToDelete.getProjectOwner().getProjectsOwned().remove(projectToDelete);
        Long projectOwnerId = projectToDelete.getProjectOwner().getUserId();
        projectToDelete.getProjectOwner().setCountOfGroupsCreated(projectToDelete.getProjectOwner().getCountOfGroupsCreated() - 1);
         projectToDelete.getProjectOwner().setReputationPoints( projectToDelete.getProjectOwner().getReputationPoints() + 5);
        projectToDelete.setProjectOwner(null);
        
        for (UserEntity user : projectToDelete.getProjectAdmins()) {
            user.getProjectsManaged().remove(projectToDelete);
        }
        projectToDelete.getProjectAdmins().clear();

        for (UserEntity user : projectToDelete.getProjectMembers()) {
            user.getProjectsJoined().remove(projectToDelete);
            if(user.getUserId() != projectOwnerId){
                user.setCountOfGroupsJoined(user.getCountOfGroupsJoined() - 1);
            }
        }
        projectToDelete.getProjectMembers().clear();
        
//        List<Long> activityIds = new ArrayList<>();
//        for (ActivityEntity activity: projectToDelete.getActivities()) {
//            activityIds.add(activity.getActivityId());
//        }
//        
//        for (Long activityId: activityIds) {
//            activitySessionBeanLocal.deleteActivity(activityId);
//        }
        for (ActivityEntity activity: projectToDelete.getActivities()) {
            activity.setProject(null);
            activitySessionBeanLocal.deleteActivity(activity.getActivityId());
        }
        
        for (AwardEntity award: projectToDelete.getAwards()){
            awardSessionBean.deleteProjectAward(award.getAwardId());
        }
        
        projectToDelete.getActivities().clear();
                
        for (HumanResourcePostingEntity hrp : projectToDelete.getHumanResourcePostings()) {
            hrp.setProject(null);
            humanResourcePostingSessionBeanLocal.deleteHumanResourcePosting(hrp.getHumanResourcePostingId());
        }
        projectToDelete.getHumanResourcePostings().clear();

        for (MaterialResourcePostingEntity mrp : projectToDelete.getMaterialResourcePostings()) {
            mrp.setProject(null);
            materialResourcePostingSessionBeanLocal.deleteMaterialResourcePosting(mrp.getMaterialResourcePostingId());
        }
        projectToDelete.getMaterialResourcePostings().clear();

        for (TaskEntity task : projectToDelete.getTasks()) {
            task.setProject(null);
            taskSessionBeanLocal.deleteTask(task.getId());
        }
        projectToDelete.getTasks().clear();

        for (PostEntity post : projectToDelete.getPosts()) {
            postSessionBeanLocal.deletePostInProjectFeed(post.getPostId());
        }
        projectToDelete.getPosts().clear();
        
        try{
            List<ReportEntity> reports = reportSessionBean.getProjectReports();
            
            List<Long> reportIds = new ArrayList<>();
            for(ReportEntity report: reports){
                if(report.getReportedProject().getProjectId() == projectId){
                    reportIds.add(report.getReportId());
                }
            }
            for(int i = 0; i < reportIds.size(); i++){
                reportSessionBean.deleteReport(reportIds.get(i));
            }
        }
        catch(NoResultException ex){
            System.out.println("No reports  made against project");
        }
        
        em.remove(projectToDelete);
    }
    
    @Override
    public List<ReviewEntity> getProjectReviews(Long projectId) throws NoResultException {
        ProjectEntity project = getProjectById(projectId);
        project.getReviews().size();
        return project.getReviews();
        
    }
    
   
}
