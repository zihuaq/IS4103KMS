import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  @Output() userChanged = new EventEmitter<User>();

  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getFollowersAndFollowing();
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
        this.getFollowersAndFollowing();
      });
  }

  unfollow() {
    this.userService
      .unfollowUser(
        this.profile.userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(() => {
        this.getFollowersAndFollowing();
      });
  }

  getFollowersAndFollowing() {
    this.userService
      .getFollowers(this.profile.userId)
      .subscribe((followers: User[]) => {
        this.profile = { ...this.profile, followers };
      });
    this.userService
      .getFollowing(this.profile.userId)
      .subscribe((following: User[]) => {
        this.profile = { ...this.profile, following };
      });
    this.userService
      .getFollowers(this.loggedInUser.userId)
      .subscribe((followers: User[]) => {
        this.loggedInUser = { ...this.loggedInUser, followers };
      });
    this.userService
      .getFollowing(this.loggedInUser.userId)
      .subscribe((following: User[]) => {
        this.loggedInUser = { ...this.loggedInUser, following };
      });
  }
}
