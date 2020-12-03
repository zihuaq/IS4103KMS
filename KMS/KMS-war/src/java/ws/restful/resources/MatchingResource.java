/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ws.restful.resources;

import Exception.NoResultException;
import ejb.session.stateless.MatchingSessionBeanLocal;
import entity.GroupEntity;
import entity.MaterialResourceAvailableEntity;
import entity.ProjectEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonObject;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import ws.restful.model.FollowingOfFollowingRsp;
import ws.restful.model.GroupRecommendationBasedOnFollowingRsp;
import ws.restful.model.ProjectMatchesRsp;
import ws.restful.model.ProjectRecommendationBasedOnFollowingRsp;

/**
 * REST Web Service
 *
 * @author Cassie
 */
@Path("matching")
public class MatchingResource {

    MatchingSessionBeanLocal matchingSessionBean = lookupMatchingSessionBeanLocal();

    @Context
    private UriInfo context;

    /**
     * Creates a new instance of MatchingResource
     */
    public MatchingResource() {
    }

    @GET
    @Path("/getMatchesForMrp/{mrpId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMatchesForMrp(@PathParam("mrpId") Long mrpId) {
        try {
            List<MaterialResourceAvailableEntity> mras = matchingSessionBean.getMatchesForMrp(mrpId);
            mras = getMraResponse(mras);
            return Response.status(200).entity(mras).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getMatchesForHrp/{hrpId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMatchesForHrp(@PathParam("hrpId") Long hrpId) {
        try {
            List<UserEntity> users = matchingSessionBean.getMatchesForHrp(hrpId);
            users = getUsersResponse(users);
            return Response.status(200).entity(users).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getMatchesForProjects/{projectId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMatchesForProjects(@PathParam("projectId") Long projectId) {
        try {
            List<ProjectMatchesRsp> matches = matchingSessionBean.getMatchesForProjects(projectId);
            matches = getProjectsMatchesResponse(matches);
            return Response.status(200).entity(matches).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getFollowingofFollowing/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowingofFollowing(@PathParam("userId") Long userId) {
        try {
            List<FollowingOfFollowingRsp> result = matchingSessionBean.getFollowingofFollowing(userId);
            for (int i = 0; i < result.size(); i++) {
                List<UserEntity> users = getUsersResponse(result.get(i).getUsersFollowing());
                result.get(i).setUsersFollowing(users);
                result.get(i).setUserToRecommend(getUserResponse(result.get(i).getUserToRecommend()));
            }
            return Response.status(200).entity(result).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getFollowersToFollow/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getFollowersToFollow(@PathParam("userId") Long userId) {
        try {
            List<UserEntity> users = matchingSessionBean.getFollowersToFollow(userId);
            users = getUsersResponse(users);
            return Response.status(200).entity(users).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getGroupRecommendationsBasedOnSDG/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroupRecommendationsBasedOnSDG(@PathParam("userId") Long userId) {
        try {
            List<GroupEntity> groups = matchingSessionBean.getGroupRecommendationsBasedOnSDG(userId);
            groups = getGroupResponse(groups);
            return Response.status(200).entity(groups).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getGroupRecommendationsBasedOnFollowing/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getGroupRecommendationsBasedOnFollowing(@PathParam("userId") Long userId) {
        try {
            List<GroupRecommendationBasedOnFollowingRsp> result = matchingSessionBean.getGroupRecommendationsBasedOnFollowing(userId);
            for (int i = 0; i < result.size(); i++) {
                List<UserEntity> users = getUsersResponse(result.get(i).getFollowingInGroup());
                result.get(i).setFollowingInGroup(users);
                GroupEntity group = result.get(i).getGroupToRecommend();
                group.getGroupAdmins().clear();
                group.getGroupMembers().clear();
                group.getPosts().clear();
                group.setGroupOwner(null);
                result.get(i).setGroupToRecommend(group);
            }
            return Response.status(200).entity(result).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getProjectRecommendationsBasedOnSDG/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectRecommendationsBasedOnSDG(@PathParam("userId") Long userId) {
        try {
            List<ProjectEntity> projects = matchingSessionBean.getProjectRecommendationsBasedOnSDG(userId);
            projects = getProjectsResponse(projects);
            return Response.status(200).entity(projects).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    @GET
    @Path("/getProjectRecommendationsBasedOnFollowing/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectRecommendationsBasedOnFollowing(@PathParam("userId") Long userId) {
        try {
            List<ProjectRecommendationBasedOnFollowingRsp> result = matchingSessionBean.getProjectRecommendationsBasedOnFollowing(userId);
            for (int i = 0; i < result.size(); i++) {
                List<UserEntity> users = getUsersResponse(result.get(i).getFollowingInProject());
                result.get(i).setFollowingInProject(users);
                ProjectEntity project = result.get(i).getProjectToRecommend();
                project.getActivities().clear();
                project.getDonations().clear();
                project.getHumanResourcePostings().clear();
                project.getMaterialResourcePostings().clear();
                project.getPosts().clear();
                project.getProjectAdmins().clear();
                project.getProjectMembers().clear();
                project.getTasks().clear();
                project.getReviews().clear();
                project.setProjectOwner(null);
                result.get(i).setProjectToRecommend(project);
            }
            return Response.status(200).entity(result).build();
        } catch (NoResultException ex) {
            JsonObject exception = Json.createObjectBuilder()
                    .add("error", ex.getMessage())
                    .build();
            return Response.status(404).entity(exception).build();
        }
    }

    private List<MaterialResourceAvailableEntity> getMraResponse(List<MaterialResourceAvailableEntity> mras) {
        for (int i = 0; i < mras.size(); i++) {
            UserEntity user = new UserEntity();
            user.setUserId(mras.get(i).getMaterialResourceAvailableOwner().getUserId());
            user.setFirstName(mras.get(i).getMaterialResourceAvailableOwner().getFirstName());
            user.setLastName(mras.get(i).getMaterialResourceAvailableOwner().getLastName());
            mras.get(i).setMaterialResourceAvailableOwner(user);
        }
        return mras;
    }

    private List<ProjectMatchesRsp> getProjectsMatchesResponse(List<ProjectMatchesRsp> matches) {
        for (ProjectMatchesRsp match : matches) {
            match.getMatchingProject().getActivities().clear();
            match.getMatchingProject().getDonations().clear();
            match.getMatchingProject().getHumanResourcePostings().clear();
            match.getMatchingProject().getMaterialResourcePostings().clear();
            match.getMatchingProject().getPosts().clear();
            match.getMatchingProject().getProjectAdmins().clear();
            match.getMatchingProject().getProjectMembers().clear();
            match.getMatchingProject().getTasks().clear();
            match.getMatchingProject().getReviews().clear();
            match.getMatchingProject().setProjectOwner(null);
        }
        return matches;
    }

    private List<ProjectEntity> getProjectsResponse(List<ProjectEntity> projects) {
        for (ProjectEntity project : projects) {
            project.getActivities().clear();
            project.getDonations().clear();
            project.getHumanResourcePostings().clear();
            project.getMaterialResourcePostings().clear();
            project.getPosts().clear();
            project.getProjectAdmins().clear();
            project.getProjectMembers().clear();
            project.getTasks().clear();
            project.getReviews().clear();
            project.setProjectOwner(null);
        }
        return projects;
    }

    private List<UserEntity> getUsersResponse(List<UserEntity> users) {
        List<UserEntity> usersResponse = new ArrayList<>();
        for (UserEntity user : users) {
            UserEntity temp = new UserEntity();
            temp.setUserId(user.getUserId());
            temp.setFirstName(user.getFirstName());
            temp.setLastName(user.getLastName());
            temp.setEmail(user.getEmail());
            temp.setDob(user.getDob());
            temp.setGender(user.getGender());
            temp.setJoinedDate(user.getJoinedDate());
            temp.setProfilePicture(user.getProfilePicture());
            temp.setSkills(user.getSkills());
            temp.setSdgs(user.getSdgs());
            temp.setUserType(user.getUserType());
            temp.setReputationPoints(user.getReputationPoints());
            usersResponse.add(temp);
        }
        return usersResponse;
    }

    private UserEntity getUserResponse(UserEntity user) {
        UserEntity temp = new UserEntity();
        temp.setUserId(user.getUserId());
        temp.setFirstName(user.getFirstName());
        temp.setLastName(user.getLastName());
        temp.setEmail(user.getEmail());
        temp.setDob(user.getDob());
        temp.setGender(user.getGender());
        temp.setJoinedDate(user.getJoinedDate());
        temp.setProfilePicture(user.getProfilePicture());
        temp.setSkills(user.getSkills());
        temp.setSdgs(user.getSdgs());
        temp.setUserType(user.getUserType());
        temp.setReputationPoints(user.getReputationPoints());
        return temp;
    }

    private List<GroupEntity> getGroupResponse(List<GroupEntity> groups) {
        for (GroupEntity group : groups) {
            group.getGroupAdmins().clear();
            group.getGroupMembers().clear();
            group.getPosts().clear();
            group.setGroupOwner(null);
        }
        return groups;
    }

    private MatchingSessionBeanLocal lookupMatchingSessionBeanLocal() {
        try {
            javax.naming.Context c = new InitialContext();
            return (MatchingSessionBeanLocal) c.lookup("java:global/KMS/KMS-war/MatchingSessionBean!ejb.session.stateless.MatchingSessionBeanLocal");
        } catch (NamingException ne) {
            Logger.getLogger(getClass().getName()).log(Level.SEVERE, "exception caught", ne);
            throw new RuntimeException(ne);
        }
    }
}
