import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FollowRequest } from '../classes/follow-request';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';
import { AccountPrivacySettingEnum } from '../classes/privacy-settings.enum';
import { Router } from '@angular/router';
import { UserType } from '../classes/user-type.enum';

declare var $: any;

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css'],
})
export class SearchUsersComponent implements OnInit {
  allUsers: User[];
  filteredUsers: User[];
  searchString: string;
  loggedInUserId: number;
  loggedInUserFollowing: User[];
  loggedInUserFollowRequestMade: FollowRequest[];
  user: User;
  query: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let userId = this.activatedRoute.snapshot.params.userid;
    this.query = this.activatedRoute.snapshot.url[1]?.path;
    this.loggedInUserId = this.sessionService.getCurrentUser().userId;
    if (this.query && userId) {
      if (this.query == 'followers') {
        forkJoin([
          this.userService.getFollowers(parseInt(userId)),
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getUser(userId),
        ]).subscribe((result) => {
          this.allUsers = result[0];
          this.filteredUsers = this.allUsers;
          this.loggedInUserFollowing = result[1];
          this.loggedInUserFollowRequestMade = result[2];
          this.user = result[3];
          if (
            this.loggedInUserId != userId &&
            this.user.accountPrivacySetting ==
            AccountPrivacySettingEnum.PRIVATE &&
            !this.loggedInUserFollowing
              .map((user) => user.userId)
              .includes(this.user.userId)
          ) {
            this.router.navigate(['/index']);
          }
        });
      } else if (this.query == 'following') {
        forkJoin([
          this.userService.getFollowing(parseInt(userId)),
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getUser(userId),
        ]).subscribe((result) => {
          this.allUsers = result[0];
          this.filteredUsers = this.allUsers;
          this.loggedInUserFollowing = result[1];
          this.loggedInUserFollowRequestMade = result[2];
          this.user = result[3];
        });
      } else if (this.query == 'affiliated') {
        forkJoin([
          this.userService.getFollowing(this.loggedInUserId),
          this.userService.getFollowRequestMade(this.loggedInUserId),
          this.userService.getAffiliatedUsers(parseInt(userId)),
          this.userService.getUser(userId)
        ]).subscribe((result) => {
          this.loggedInUserFollowing = result[0];
          this.loggedInUserFollowRequestMade = result[1];
          this.allUsers = result[2];
          this.filteredUsers = this.allUsers;
          this.user = result[3];
        });
      }
    } else {
      forkJoin([
        this.userService.getAllUsers(),
        this.userService.getFollowing(this.loggedInUserId),
        this.userService.getFollowRequestMade(this.loggedInUserId),
      ]).subscribe((result) => {
        this.allUsers = result[0];
        this.filteredUsers = this.allUsers;
        this.loggedInUserFollowing = result[1];
        this.loggedInUserFollowRequestMade = result[2];
      });
    }
  }

  handleSearchStringChanged(event) {
    this.searchString = event;
    this.filteredUsers = [];
    for (var user of this.allUsers) {
      console.log(user);
      if (
        user.userType == UserType.INDIVIDUAL ||
        user.userType == UserType.ADMIN
      ) {
        if (
          user.firstName
            .toLowerCase()
            .includes(this.searchString.toLowerCase()) ||
          user.lastName.toLowerCase().includes(this.searchString.toLowerCase())
        ) {
          this.filteredUsers.push(user);
        }
      } else if (user.userType == UserType.INSTITUTE) {
        if (
          user.firstName.toLowerCase().includes(this.searchString.toLowerCase())
        ) {
          this.filteredUsers.push(user);
        }
      }
    }
  }

  follow(userId: number) {
    this.userService
      .followUser(userId.toString(), this.loggedInUserId.toString())
      .subscribe((followRequest: FollowRequest) => {
        if (followRequest) {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Sent Follow Request',
            autohide: true,
            delay: 2500,
            body: 'Follow Request sent successfully',
          });
        }
        this.updateLoginUserAndUser(userId);
      });
  }

  unfollow(userId: number) {
    this.userService
      .unfollowUser(userId.toString(), this.loggedInUserId.toString())
      .subscribe(() => {
        this.updateLoginUserAndUser(userId);
      });
  }

  checkLoginUserHasFollowed(userId: number) {
    return this.loggedInUserFollowing
      .map((user) => user.userId)
      .includes(userId);
  }

  checkLoginUserHaveSentFollowReq(userId: number) {
    return this.loggedInUserFollowRequestMade
      .map((f) => f.to.userId)
      .includes(userId);
  }

  private updateLoginUserAndUser(userId: number) {
    forkJoin([
      this.userService.getFollowers(userId),
      this.userService.getFollowing(userId),
      this.userService.getFollowers(this.loggedInUserId),
      this.userService.getFollowing(this.loggedInUserId),
      this.userService.getFollowRequestMade(this.loggedInUserId),
    ]).subscribe((result) => {
      this.loggedInUserFollowing = result[3];
      this.loggedInUserFollowRequestMade = result[4];
      let userUpdated = false;
      let loggedInUserUpdated = false;
      for (var user of this.filteredUsers) {
        if (user.userId == userId) {
          user.followers = result[0];
          user.following = result[1];
          userUpdated = true;
        }
        if (user.userId == this.loggedInUserId) {
          user.followers = result[2];
          user.following = result[3];
          loggedInUserUpdated = true;
        }
        if (userUpdated && loggedInUserUpdated) {
          return;
        }
      }
    });
  }
}
