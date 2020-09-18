import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/user.service';
import { User } from '../../classes/user';
import { FollowRequest } from '../../classes/follow-request';

declare var $: any;

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
  canFollow: boolean;
  hasSentFollowRequest: boolean;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getFollowersAndFollowing();
  }

  follow() {
    this.userService
      .followUser(
        this.profile.userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(
        (followRequest: FollowRequest) => {
          if (followRequest) {
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Sent Follow Request',
              autohide: true,
              delay: 2500,
              body: 'Follow Request sent successfully',
            });
          }
          this.getFollowersAndFollowing();
        },
        (err: any) => {
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 2500,
            body: err,
          });
        }
      );
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
    forkJoin([
      this.userService.getFollowers(this.profile.userId),
      this.userService.getFollowing(this.profile.userId),
      this.userService.getFollowing(this.loggedInUser.userId),
      this.userService.getFollowRequestMade(this.loggedInUser.userId),
    ]).subscribe((result) => {
      this.profile = { ...this.profile, followers: result[0] };
      this.profile = { ...this.profile, following: result[1] };
      this.loggedInUser = { ...this.loggedInUser, following: result[2] };
      this.canFollow = !this.loggedInUser.following
        .map((user) => user.userId)
        .includes(this.profile.userId);
      this.hasSentFollowRequest = result[3]
        .map((followRequestMade: FollowRequest) => {
          return followRequestMade.to.userId;
        })
        .includes(this.profile.userId);
    });
  }
}
