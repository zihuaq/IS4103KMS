import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  @Input() profile: User;
  loggedInUser: User;

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
    console.log(this.loggedInUser.userId);
  }

  checkfollowing() {
    return this.loggedInUser.following
      .map((user) => user.userId)
      .includes(this.profile.userId);
  }

  follow() {
    this.userService
      .followUser(
        this.profile.userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(() => {
        this.userService
          .getUser(this.profile.userId.toString())
          .subscribe((data: User) => {
            this.profile = data;
          });
      });
  }

  unfollow() {
    this.userService
      .unfollowUser(
        this.profile.userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(() => {
        this.userService
          .getUser(this.profile.userId.toString())
          .subscribe((data: User) => {
            this.profile = data;
          });
      });
  }
}
