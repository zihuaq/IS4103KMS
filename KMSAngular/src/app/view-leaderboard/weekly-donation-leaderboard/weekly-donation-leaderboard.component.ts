import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { LeaderboardService } from 'src/app/leaderboard.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  selector: 'app-weekly-donation-leaderboard',
  templateUrl: './weekly-donation-leaderboard.component.html',
  styleUrls: ['./weekly-donation-leaderboard.component.css']
})
export class WeeklyDonationLeaderboardComponent implements OnInit {

  loggedInUser: User;
  isGlobalLeaderBoard: boolean = true;
  leaderboardUsers: User[];

  constructor(private sessionService: SessionService,
    private leaderboardService: LeaderboardService) { }

  ngOnInit(): void {
    $('#donation-bootstrap-switch').bootstrapSwitch({
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
        .getProjectLeaderboard()
        .subscribe((result) => {
          this.leaderboardUsers = result;
          this.leaderboardUsers.splice(10);
        });
    } else {
      this.leaderboardService
        .getProjectLeaderboardForFollowing(this.loggedInUser.userId)
        .subscribe((result) => {
          this.leaderboardUsers = result;
          this.leaderboardUsers.splice(10);
        });
    }
  }
}
