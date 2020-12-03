import { forkJoin } from 'rxjs';
import { AuthenticationService } from './../../services/authentication.service';
import { LeaderboardService } from './../../services/leaderboard.service';
import { User } from './../../classes/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss']
})
export class LeaderboardPage implements OnInit {
  loggedInUserId: number;
  isGlobalReputationPointsLeaderBoard: boolean = true;
  reputationPointsleaderboardUsers: User[];
  followingReputationPointsleaderboardUsers: User[];
  isGlobalProjectLeaderBoard: boolean = true;
  projectleaderboardUsers: User[];
  followingProjectleaderboardUsers: User[];
  isGlobalWeeklyDonationAmountLeaderBoard: boolean = true;
  weeklyDonationAmountleaderboardUsers: User[];
  followingWeeklyDonationAmountleaderboardUsers: User[];
  constructor(
    private authenticationService: AuthenticationService,
    private leaderboardService: LeaderboardService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then((user) => {
      this.loggedInUserId = user.userId;
      forkJoin([
        this.leaderboardService.getReputationPointLeaderboard(),
        this.leaderboardService.getReputationPointLeaderboardForFollowing(
          this.loggedInUserId
        ),
        this.leaderboardService.getProjectLeaderboard(),
        this.leaderboardService.getProjectLeaderboardForFollowing(
          this.loggedInUserId
        ),
        this.leaderboardService.getWeeklyDonationAmountLeaderboard(),
        this.leaderboardService.getWeeklyDonationAmountLeaderboardForFollowing(
          this.loggedInUserId
        )
      ]).subscribe((result) => {
        this.reputationPointsleaderboardUsers = result[0];
        this.followingReputationPointsleaderboardUsers = result[1];
        this.projectleaderboardUsers = result[2];
        this.followingProjectleaderboardUsers = result[3];
        this.weeklyDonationAmountleaderboardUsers = result[4];
        this.followingWeeklyDonationAmountleaderboardUsers = result[5];
      });
    });
  }
}
