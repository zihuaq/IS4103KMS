import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { SessionService } from 'src/app/session.service';
import { LeaderboardService } from 'src/app/leaderboard.service';

@Component({
  selector: 'app-reputation-points-leaderboard',
  templateUrl: './reputation-points-leaderboard.component.html',
  styleUrls: ['./reputation-points-leaderboard.component.css']
})
export class ReputationPointsLeaderboardComponent implements OnInit {

  loggedInUser: User;
  isGlobalLeaderBoard: boolean = true;
  leaderboardUsers: User[];

  constructor(private sessionService: SessionService, private leaderboardService: LeaderboardService) { }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.updateLeaderboard();
  }

  setIsGlobal() {
    this.isGlobalLeaderBoard = true;
    this.updateLeaderboard();
  }

  setNotGlobal() {
    this.isGlobalLeaderBoard = false;
    this.updateLeaderboard();
  }

  private updateLeaderboard() {
    if (this.isGlobalLeaderBoard) {
      this.leaderboardService.getReputationPointLeaderboard().subscribe(
        (result) => {
          this.leaderboardUsers = result;
        }
      )
    } else {
      this.leaderboardService.getReputationPointLeaderboardForFollowing(this.loggedInUser.userId).subscribe(
        (result) => {
          this.leaderboardUsers = result;
        }
      )
    }
  }
}
