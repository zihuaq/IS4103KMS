import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { SessionService } from 'src/app/session.service';
import { LeaderboardService } from 'src/app/leaderboard.service';

declare var $: any;

@Component({
  selector: 'app-reputation-points-leaderboard',
  templateUrl: './reputation-points-leaderboard.component.html',
  styleUrls: ['./reputation-points-leaderboard.component.css'],
})
export class ReputationPointsLeaderboardComponent implements OnInit {
  loggedInUser: User;
  isGlobalLeaderBoard: boolean = true;
  leaderboardUsers: User[];

  constructor(
    private sessionService: SessionService,
    private leaderboardService: LeaderboardService
  ) { }

  ngOnInit(): void {
    $('#rep-points-bootstrap-switch').bootstrapSwitch({
      state: this.isGlobalLeaderBoard,
      onSwitchChange: (event, state) => {
        event.preventDefault();
        this.isGlobalLeaderBoard = state;
        this.updateLeaderboard();
      },
      onText: "Global",
      offText: "Following"
    });
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.updateLeaderboard();
  }

  private updateLeaderboard() {
    this.leaderboardUsers = [];
    if (this.isGlobalLeaderBoard) {
      this.leaderboardService
        .getReputationPointLeaderboard()
        .subscribe((result) => {
          this.leaderboardUsers = result;
          this.leaderboardUsers.splice(10);
        });
    } else {
      this.leaderboardService
        .getReputationPointLeaderboardForFollowing(this.loggedInUser.userId)
        .subscribe((result) => {
          this.leaderboardUsers = result;
          this.leaderboardUsers.splice(10);
        });
    }
  }
}
