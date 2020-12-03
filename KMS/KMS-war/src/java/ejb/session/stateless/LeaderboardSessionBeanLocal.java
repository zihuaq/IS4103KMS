/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ejb.session.stateless;

import Exception.UserNotFoundException;
import entity.UserEntity;
import java.util.List;
import javax.ejb.Local;

/**
 *
 * @author Jeremy
 */
@Local
public interface LeaderboardSessionBeanLocal {

    public List<UserEntity> getReputationPointLeaderboard();

    public List<UserEntity> getReputationPointLeaderboardForFollowing(Long userId) throws UserNotFoundException;

    public List<UserEntity> getAllTimeDonationAmountLeaderboard();

    public List<UserEntity> getWeeklyDonationAmountLeaderboard();

    public List<UserEntity> getWeeklyDonationAmountLeaderboardForFollowing(long userId) throws UserNotFoundException;

    public List<UserEntity> getProjectLeaderboard();
    
    public List<UserEntity> getProjectLeaderboardForFollowing(long userId) throws UserNotFoundException;

}
