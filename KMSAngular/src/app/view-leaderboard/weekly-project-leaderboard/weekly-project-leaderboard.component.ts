import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { LeaderboardService } from 'src/app/leaderboard.service';
import { SessionService } from 'src/app/session.service';

declare var $: any;

@Component({
  selector: 'app-weekly-project-leaderboard',
  templateUrl: './weekly-project-leaderboard.component.html',
  styleUrls: ['./weekly-project-leaderboard.component.css']
})
export class WeeklyProjectLeaderboardComponent implements OnInit {

  loggedInUser: User;
  isGlobalLeaderBoard: boolean = true;
  leaderboardUsers: User[];

  constructor(
    private sessionService: SessionService,
    private leaderboardService: LeaderboardService
  ) { }

  ngOnInit(): void {
    $('#project-bootstrap-switch').bootstrapSwitch({
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
