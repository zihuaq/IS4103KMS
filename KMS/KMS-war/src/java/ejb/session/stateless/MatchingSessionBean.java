/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.NoResultException;
import entity.HumanResourcePostingEntity;
import entity.MaterialResourceAvailableEntity;
import entity.MaterialResourcePostingEntity;
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

/**
 *
 * @author Cassie
 */
@Stateless
public class MatchingSessionBean implements MatchingSessionBeanLocal {

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
        Map<MaterialResourceAvailableEntity, Double> mras = new HashMap<>();

        for (int i = 0; i < allMras.size(); i++) {
            if (hasMatchingTags(mrp.getTags(), allMras.get(i).getTags())) {
                String mraString = removeStopWords(allMras.get(i).getName()) + removeStopWords(allMras.get(i).getDescription());
                double fuzzyScore = new FuzzyScore(Locale.getDefault()).fuzzyScore(mraString, mrpString);
                if (fuzzyScore > 3) {
                    mras.put(allMras.get(i), fuzzyScore);
                }
            }
        }
        System.out.println(mras);
        LinkedHashMap<MaterialResourceAvailableEntity, Double> sortedMras = new LinkedHashMap<>();
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
            int numMatches = getNumTagMatches(hrp.getTags(), allUsers.get(i).getSkills());
            if (numMatches > 0) {
                hrpMatches.put(allUsers.get(i), numMatches);
            }
        }
        System.out.println(hrpMatches);
        LinkedHashMap<UserEntity, Integer> sortedHrpMatches = new LinkedHashMap<>();
        hrpMatches.entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).forEachOrdered(x -> sortedHrpMatches.put(x.getKey(), x.getValue()));
        System.out.println(sortedHrpMatches);
        List<UserEntity> matches = new ArrayList<>(sortedHrpMatches.keySet());
        return matches;
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
}
