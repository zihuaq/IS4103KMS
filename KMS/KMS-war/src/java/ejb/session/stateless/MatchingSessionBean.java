/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.GroupEntity;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourceAvailableEntity;
import entity.MaterialResourcePostingEntity;
import entity.ProjectEntity;
import entity.TagEntity;
import entity.UserEntity;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import static java.util.stream.Collectors.toMap;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.apache.commons.text.similarity.FuzzyScore;
import util.enumeration.ProjectStatusEnum;
import ws.restful.model.FollowingOfFollowingRsp;
import ws.restful.model.GroupRecommendationBasedOnFollowingRsp;
import ws.restful.model.ProjectMatchesRsp;
import ws.restful.model.ProjectRecommendationBasedOnFollowingRsp;

/**
 *
 * @author Cassie
 */
@Stateless
public class MatchingSessionBean implements MatchingSessionBeanLocal {
    
    @EJB
    private ProjectSessionBeanLocal projectSessionBean;
    
    @EJB
    private GroupSessionBeanLocal groupSessionBean;
    
    @EJB
    private UserSessionBeanLocal userSessionBean;
    
    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @EJB
    private MaterialResourcePostingSessionBeanLocal materialResourcePostingSessionBean;
    
    @EJB
    private MaterialResourceAvailableSessionBeanLocal materialResourceAvailableSessionBean;
    
    @EJB
    private HumanResourcePostingSessionBeanLocal humanResourcePostingSessionBean;
    
    private List<String> stopwords = new ArrayList<>();
    private String filePath = "stopwords.txt";
    
    @PostConstruct
    public void loadStopWords() {
        try {
            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
            URL input = classLoader.getResource(filePath);
            stopwords = Files.readAllLines(Paths.get(input.toURI()));
        } catch (IOException | URISyntaxException ex) {
            Logger.getLogger(MatchingSessionBean.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    @Override
    public List<MaterialResourceAvailableEntity> getMatchesForMrp(long mrpId) throws NoResultException {
        MaterialResourcePostingEntity mrp = materialResourcePostingSessionBean.getMrpById(mrpId);
        String mrpString = removeStopWords(mrp.getName()) + removeStopWords(mrp.getDescription());
        System.out.println(mrpString);
        
        List<MaterialResourceAvailableEntity> allMras = materialResourceAvailableSessionBean.getAllMaterialResourceAvailable();
        Map<MaterialResourceAvailableEntity, Integer> mras = new HashMap<>();
        
        for (int i = 0; i < allMras.size(); i++) {
            if (hasMatchingTags(mrp.getTags(), allMras.get(i).getTags())) {
                String mraString = removeStopWords(allMras.get(i).getName()) + removeStopWords(allMras.get(i).getDescription());
                int maxFuzzyScore = getMaxFuzzyScore(mrpString.length());
                double fuzzyScore = new FuzzyScore(Locale.getDefault()).fuzzyScore(mrpString, mraString);
                if (fuzzyScore >= maxFuzzyScore / 4) {
                    mras.put(allMras.get(i), (int) Math.round(fuzzyScore / maxFuzzyScore * 100));
                }
            }
        }
        System.out.println(mras);
        LinkedHashMap<MaterialResourceAvailableEntity, Integer> sortedMras = new LinkedHashMap<>();
        mras.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).forEachOrdered(x -> sortedMras.put(x.getKey(), x.getValue()));
        System.out.println(sortedMras);
        List<MaterialResourceAvailableEntity> matches = new ArrayList<>(sortedMras.keySet());
        return matches;
    }
    
    @Override
    public List<UserEntity> getMatchesForHrp(long hrpId) throws NoResultException {
        HumanResourcePostingEntity hrp = humanResourcePostingSessionBean.getHrpById(hrpId);
        System.out.println("HRP Tags:" + hrp.getTags());
        List<UserEntity> allUsers = userSessionBean.getAllUsers();
        Map<UserEntity, Integer> hrpMatches = new HashMap<>();
        
        for (int i = 0; i < allUsers.size(); i++) {
            if (!hrp.getAppliedUsers().contains(allUsers.get(i))) {
                int numMatches = getNumTagMatches(hrp.getTags(), allUsers.get(i).getSkills());
                if (numMatches > 0) {
                    hrpMatches.put(allUsers.get(i), numMatches);
                }
            }
        }
        System.out.println(hrpMatches);
        LinkedHashMap<UserEntity, Integer> sortedHrpMatches = new LinkedHashMap<>();
        hrpMatches.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).forEachOrdered(x -> sortedHrpMatches.put(x.getKey(), x.getValue()));
        System.out.println(sortedHrpMatches);
        List<UserEntity> matches = new ArrayList<>(sortedHrpMatches.keySet());
        return matches;
    }
    
    @Override
    public List<ProjectMatchesRsp> getMatchesForProjects(long projectId) throws NoResultException {
        ProjectEntity project = projectSessionBean.getProjectById(projectId);
        String projectString = removeStopWords(project.getName()) + removeStopWords(project.getDescription());
        
        List<ProjectEntity> completedProjects = projectSessionBean.retrieveAllProject();
        Map<ProjectEntity, Long> projects = new HashMap<>();
        
        for (int i = 0; i < completedProjects.size(); i++) {
            if (hasMatchingTags(project.getSdgs(), completedProjects.get(i).getSdgs()) && completedProjects.get(i).getProjectId() != project.getProjectId()) {
                String projectString2 = removeStopWords(completedProjects.get(i).getName()) + removeStopWords(completedProjects.get(i).getDescription());
                int maxFuzzyScore = getMaxFuzzyScore(projectString.length());
                System.out.println(projectString);
                System.out.println(projectString2);
                System.out.println(maxFuzzyScore);
                double fuzzyScore = new FuzzyScore(Locale.getDefault()).fuzzyScore(projectString, projectString2);
                System.out.println(fuzzyScore);
                if (fuzzyScore >= maxFuzzyScore / 4) {
                    projects.put(completedProjects.get(i), Math.round(fuzzyScore / maxFuzzyScore * 100));
                    System.out.println(fuzzyScore);
                    System.out.println("rounded: " + Math.round(fuzzyScore / maxFuzzyScore * 100));
                }
            }
        }
        System.out.println(projects);
        LinkedHashMap<ProjectEntity, Long> sortedProjects = new LinkedHashMap<>();
        projects.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).forEachOrdered(x -> sortedProjects.put(x.getKey(), x.getValue()));
        
        List<ProjectMatchesRsp> matches = new ArrayList<>();
        for (Map.Entry<ProjectEntity, Long> entry : sortedProjects.entrySet()) {
            ProjectMatchesRsp response = new ProjectMatchesRsp();
            response.setMatchingProject(entry.getKey());
            response.setPercentageMatch(entry.getValue());
            System.out.println("Value: " + entry.getValue());
            matches.add(response);
        }
        return matches;
    }
    
    @Override
    public List<FollowingOfFollowingRsp> getFollowingofFollowing(long userId) throws NoResultException {
        UserEntity user = userSessionBean.getUserById(userId);
        List<UserEntity> following = user.getFollowing();
        Map<UserEntity, List<UserEntity>> result = new HashMap<>();
        
        List<UserEntity> followersToFollow = getFollowersToFollow(userId);
        
        for (int i = 0; i < following.size(); i++) {
            List<UserEntity> followingFollowing = following.get(i).getFollowing();
            for (int j = 0; j < followingFollowing.size(); j++) {
                if (!following.contains(followingFollowing.get(j)) && userId != followingFollowing.get(j).getUserId() && !followersToFollow.contains(followingFollowing.get(j))) {
                    if (result.containsKey(followingFollowing.get(j))) {
                        List<UserEntity> value = result.get(followingFollowing.get(j));
                        value.add(following.get(i));
                        result.replace(followingFollowing.get(j), value);
                    } else {
                        List<UserEntity> value = new ArrayList<>();
                        value.add(following.get(i));
                        result.put(followingFollowing.get(j), value);
                    }
                }
            }
        }
        
        result = result.entrySet().stream().sorted((e1, e2) -> Integer.compare(e2.getValue().size(), e1.getValue().size()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
        List<FollowingOfFollowingRsp> responses = new ArrayList<>();
        for (Map.Entry<UserEntity, List<UserEntity>> entry : result.entrySet()) {
            FollowingOfFollowingRsp rsp = new FollowingOfFollowingRsp();
            rsp.setUserToRecommend(entry.getKey());
            rsp.setUsersFollowing(entry.getValue());
            responses.add(rsp);
        }
        
        return responses;
    }
    
    @Override
    public List<UserEntity> getFollowersToFollow(long userId) throws NoResultException {
        UserEntity user = userSessionBean.getUserById(userId);
        List<UserEntity> followers = user.getFollowers();
        List<UserEntity> followersToFollow = new ArrayList<>();
        
        for (int i = 0; i < followers.size(); i++) {
            UserEntity follower = followers.get(i);
            if (!follower.getFollowers().contains(user)) {
                followersToFollow.add(follower);
            }
        }
        return followersToFollow;
    }
    
    @Override
    public List<GroupEntity> getGroupRecommendationsBasedOnSDG(long userId) throws NoResultException {
        UserEntity user = userSessionBean.getUserById(userId);
        List<GroupEntity> groupsJoined = user.getGroupsJoined();
        List<GroupEntity> allGroups = groupSessionBean.retrieveAllGroup();
        Map<GroupEntity, Integer> matches = new HashMap<>();
        
        for (int i = 0; i < allGroups.size(); i++) {
            if (!groupsJoined.contains(allGroups.get(i))) {
                int numMatches = getNumTagMatches(user.getSdgs(), allGroups.get(i).getSdgs());
                if (numMatches > 0) {
                    matches.put(allGroups.get(i), numMatches);
                }
            }
        }
        LinkedHashMap<GroupEntity, Integer> sortedMatches = new LinkedHashMap<>();
        matches.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).forEachOrdered(x -> sortedMatches.put(x.getKey(), x.getValue()));
        List<GroupEntity> groupMatches = new ArrayList<>(sortedMatches.keySet());
        return groupMatches;
    }
    
    @Override
    public List<GroupRecommendationBasedOnFollowingRsp> getGroupRecommendationsBasedOnFollowing(long userId) throws NoResultException {
        UserEntity user = userSessionBean.getUserById(userId);
        List<GroupEntity> groupsJoined = user.getGroupsJoined();
        List<UserEntity> following = user.getFollowing();
        Map<GroupEntity, List<UserEntity>> result = new HashMap<>();
        
        List<GroupEntity> recoBasedOnSDG = getGroupRecommendationsBasedOnSDG(userId);
        
        for (int i = 0; i < following.size(); i++) {
            List<GroupEntity> followingGroups = following.get(i).getGroupsJoined();
            for (int j = 0; j < followingGroups.size(); j++) {
                if (!groupsJoined.contains(followingGroups.get(j)) && !recoBasedOnSDG.contains(followingGroups.get(j))) {
                    if (result.containsKey(followingGroups.get(j))) {
                        List<UserEntity> value = result.get(followingGroups.get(j));
                        value.add(following.get(i));
                        result.replace(followingGroups.get(j), value);
                    } else {
                        List<UserEntity> value = new ArrayList<>();
                        value.add(following.get(i));
                        result.put(followingGroups.get(j), value);
                    }
                }
            }
        }
        
        result = result.entrySet().stream().sorted((e1, e2) -> Integer.compare(e2.getValue().size(), e1.getValue().size()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
        
        List<GroupRecommendationBasedOnFollowingRsp> responses = new ArrayList<>();
        for (Map.Entry<GroupEntity, List<UserEntity>> entry : result.entrySet()) {
            GroupRecommendationBasedOnFollowingRsp rsp = new GroupRecommendationBasedOnFollowingRsp();
            rsp.setGroupToRecommend(entry.getKey());
            rsp.setFollowingInGroup(entry.getValue());
            responses.add(rsp);
        }
        return responses;
    }
    
    @Override
    public List<ProjectEntity> getProjectRecommendationsBasedOnSDG(long userId) throws NoResultException {
        UserEntity user = userSessionBean.getUserById(userId);
        List<ProjectEntity> projectsJoined = user.getProjectsJoined();
        
        List<ProjectEntity> activeProjects = projectSessionBean.retrieveProjectByStatus(ProjectStatusEnum.ACTIVE);
        Map<ProjectEntity, Integer> matches = new HashMap<>();
        
        for (int i = 0; i < activeProjects.size(); i++) {
            if (!projectsJoined.contains(activeProjects.get(i))) {
                int numMatches = getNumTagMatches(user.getSdgs(), activeProjects.get(i).getSdgs());
                if (numMatches > 0) {
                    matches.put(activeProjects.get(i), numMatches);
                }
            }
        }
        LinkedHashMap<ProjectEntity, Integer> sortedMatches = new LinkedHashMap<>();
        matches.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).forEachOrdered(x -> sortedMatches.put(x.getKey(), x.getValue()));
        List<ProjectEntity> projectMatches = new ArrayList<>(sortedMatches.keySet());
        return projectMatches;
    }
    
    @Override
    public List<ProjectRecommendationBasedOnFollowingRsp> getProjectRecommendationsBasedOnFollowing(long userId) throws NoResultException {
        UserEntity user = userSessionBean.getUserById(userId);
        List<UserEntity> following = user.getFollowing();
        List<ProjectEntity> projectsJoined = user.getProjectsJoined();
        Map<ProjectEntity, List<UserEntity>> result = new HashMap<>();
        List<ProjectEntity> projectRecosBasedOnSDG = getProjectRecommendationsBasedOnSDG(userId);
        
        for (int i = 0; i < following.size(); i++) {
            List<ProjectEntity> followingProjects = following.get(i).getProjectsJoined();
            for (int j = 0; j < followingProjects.size(); j++) {
                if (!projectsJoined.contains(followingProjects.get(j)) && !projectRecosBasedOnSDG.contains(followingProjects.get(j))) {
                    if (result.containsKey(followingProjects.get(j))) {
                        List<UserEntity> value = result.get(followingProjects.get(j));
                        value.add(following.get(i));
                        result.replace(followingProjects.get(j), value);
                    } else {
                        List<UserEntity> value = new ArrayList<>();
                        value.add(following.get(i));
                        result.put(followingProjects.get(j), value);
                    }
                }
            }
        }
        
        result = result.entrySet().stream().sorted((e1, e2) -> Integer.compare(e2.getValue().size(), e1.getValue().size()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
        
        List<ProjectRecommendationBasedOnFollowingRsp> responses = new ArrayList<>();
        for (Map.Entry<ProjectEntity, List<UserEntity>> entry : result.entrySet()) {
            ProjectRecommendationBasedOnFollowingRsp rsp = new ProjectRecommendationBasedOnFollowingRsp();
            rsp.setProjectToRecommend(entry.getKey());
            rsp.setFollowingInProject(entry.getValue());
            responses.add(rsp);
        }
        return responses;
    }
    
    private String removeStopWords(String original) {
        ArrayList<String> allWords;
        
        if (original != null) {
            allWords = Stream.of(original.toLowerCase().split(" ")).collect(Collectors.toCollection(ArrayList<String>::new));
        } else {
            return "";
        }
        allWords.removeAll(stopwords);
        String result = allWords.stream().collect(Collectors.joining(""));
        return result;
    }
    
    private boolean hasMatchingTags(List<TagEntity> tagsToMatch, List<TagEntity> tagsToCheck) {
        for (int i = 0; i < tagsToCheck.size(); i++) {
            if (tagsToMatch.contains(tagsToCheck.get(i))) {
                return true;
            }
        }
        return false;
    }
    
    private int getNumTagMatches(List<TagEntity> tagsToMatch, List<TagEntity> tagsToCheck) {
        int result = 0;
        
        for (int i = 0; i < tagsToMatch.size(); i++) {
            if (tagsToCheck.contains(tagsToMatch.get(i))) {
                result += 1;
            }
        }
        return result;
    }
    
    private int getMaxFuzzyScore(int stringLength) {
        return stringLength + (2 * (stringLength - 1));
    }
}
