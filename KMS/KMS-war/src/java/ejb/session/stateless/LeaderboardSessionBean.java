/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import entity.ActivityEntity;
import entity.DonationEntity;
import entity.UserEntity;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import util.enumeration.ActivityStatusEnum;

/**
 *
 * @author Jeremy
 */
@Stateless
public class LeaderboardSessionBean implements LeaderboardSessionBeanLocal {
    
    @PersistenceContext(unitName = "KMS-warPU")
    private EntityManager em;
    
    @Override
    public List<UserEntity> getReputationPointLeaderboard() {
        Query query = em.createQuery("SELECT u FROM UserEntity u ORDER BY u.reputationPoints DESC");
        List<UserEntity> leaderboardUsers = query.getResultList();
        if (leaderboardUsers != null && !leaderboardUsers.isEmpty()) {
            return leaderboardUsers;
        } else {
            return new ArrayList<>();
        }
    }
    
    @Override
    public List<UserEntity> getAllTimeDonationAmountLeaderboard() {
        Query query = em.createQuery("SELECT u FROM UserEntity u");
        List<UserEntity> leaderboardUsers = query.getResultList();
        if (leaderboardUsers != null && !leaderboardUsers.isEmpty()) {
            Collections.sort(leaderboardUsers, (UserEntity o1, UserEntity o2) -> {
                Double o1DonationAmount = 0.0;
                List<DonationEntity> o1Donations = o1.getDonations();
                for (int i = 0; i < o1Donations.size(); i++) {
                    o1DonationAmount += o1Donations.get(i).getAmount();
                }
                Double o2DonationAmount = 0.0;
                List<DonationEntity> o2Donations = o2.getDonations();
                for (int i = 0; i < o2Donations.size(); i++) {
                    o2DonationAmount += o2Donations.get(i).getAmount();
                }
                return o2DonationAmount.compareTo(o1DonationAmount);
            });
            return leaderboardUsers;
        } else {
            return new ArrayList<>();
        }
    }
    
    @Override
    public List<UserEntity> getWeeklyDonationAmountLeaderboard() {
        Query query = em.createQuery("SELECT u FROM UserEntity u");
        List<UserEntity> leaderboardUsers = query.getResultList();
        if (leaderboardUsers != null && !leaderboardUsers.isEmpty()) {
            Collections.sort(leaderboardUsers, (UserEntity o1, UserEntity o2) -> {
                Double o1DonationAmount = 0.0;
                List<DonationEntity> o1Donations = o1.getDonations();
                for (int i = 0; i < o1Donations.size(); i++) {
                    if (isDateInCurrentWeek(o1Donations.get(i).getDateDonated())) {
                        o1DonationAmount += o1Donations.get(i).getAmount();
                    }
                }
                Double o2DonationAmount = 0.0;
                List<DonationEntity> o2Donations = o2.getDonations();
                for (int i = 0; i < o2Donations.size(); i++) {
                    if (isDateInCurrentWeek(o1Donations.get(i).getDateDonated())) {
                        o2DonationAmount += o2Donations.get(i).getAmount();
                    }
                }
                return o2DonationAmount.compareTo(o1DonationAmount);
            });
            return leaderboardUsers;
        } else {
            return new ArrayList<>();
        }
    }
    
    @Override
    public List<UserEntity> getProjectLeaderboard() {
        Query query = em.createQuery("SELECT u FROM UserEntity u");
        List<UserEntity> leaderboardUsers = query.getResultList();
        if (leaderboardUsers != null && !leaderboardUsers.isEmpty()) {
            Collections.sort(leaderboardUsers, (UserEntity o1, UserEntity o2) -> {
                Integer o1numProjectActivities = 0;
                List<ActivityEntity> o1Activities = o1.getActivityJoined();
                for (int i = 0; i < o1Activities.size(); i++) {
                    if (isDateInCurrentWeek(o1Activities.get(i).getEndDate()) && o1Activities.get(i).getActivityStatus().equals(ActivityStatusEnum.COMPLETED)) {
                        o1numProjectActivities++;
                    }
                }
                Integer o2numProjectActivities = 0;
                List<ActivityEntity> o2Activities = o2.getActivityJoined();
                for (int i = 0; i < o2Activities.size(); i++) {
                    if (isDateInCurrentWeek(o2Activities.get(i).getEndDate()) && o2Activities.get(i).getActivityStatus().equals(ActivityStatusEnum.COMPLETED)) {
                        o2numProjectActivities++;
                    }
                }
                return o2numProjectActivities.compareTo(o1numProjectActivities);
            });
            return leaderboardUsers;
        } else {
            return new ArrayList<>();
        }
    }
    
    private static boolean isDateInCurrentWeek(Date date) {
        Calendar currentCalendar = Calendar.getInstance();
        int week = currentCalendar.get(Calendar.WEEK_OF_YEAR);
        int year = currentCalendar.get(Calendar.YEAR);
        Calendar targetCalendar = Calendar.getInstance();
        targetCalendar.setTime(date);
        int targetWeek = targetCalendar.get(Calendar.WEEK_OF_YEAR);
        int targetYear = targetCalendar.get(Calendar.YEAR);
        return week == targetWeek && year == targetYear;
    }
    
}
