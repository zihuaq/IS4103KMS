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
  segment: string;
  reputationPointsSegment: string;
  projectSegment: string;
  donationSegment: string;
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
  ) {
    this.segment = 'reputation-points';
    this.reputationPointsSegment = 'global';
    this.projectSegment = 'global';
    this.donationSegment = 'global';
  }

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
        this.reputationPointsleaderboardUsers.splice(10);
        this.followingReputationPointsleaderboardUsers = result[1];
        this.followingReputationPointsleaderboardUsers.splice(10);
        this.projectleaderboardUsers = result[2];
        this.projectleaderboardUsers.splice(10);
        this.followingProjectleaderboardUsers = result[3];
        this.followingProjectleaderboardUsers.splice(10);
        this.weeklyDonationAmountleaderboardUsers = result[4];
        this.weeklyDonationAmountleaderboardUsers.splice(10);
        this.followingWeeklyDonationAmountleaderboardUsers = result[5];
        this.followingWeeklyDonationAmountleaderboardUsers.splice(10);
      });
    });
  }
  async segmentChanged() {
    this.segment;
  }
  async reputationPointsSegmentChanged() {
    this.reputationPointsSegment;
  }
  async projectSegmentChanged() {
    this.projectSegment;
  }
  async donationSegmentChanged() {
    this.donationSegment;
  }
}
