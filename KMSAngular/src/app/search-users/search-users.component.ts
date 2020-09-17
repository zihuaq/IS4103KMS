import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { FollowRequest } from '../classes/follow-request';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

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
    private sessionService: SessionService
  ) {}

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
      if (
        user.firstName
          .toLowerCase()
          .includes(this.searchString.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchString.toLowerCase())
      ) {
        this.filteredUsers.push(user);
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
      this.userService.getFollowing(this.loggedInUserId),
      this.userService.getFollowRequestMade(this.loggedInUserId),
    ]).subscribe((result) => {
      this.loggedInUserFollowing = result[2];
      this.loggedInUserFollowRequestMade = result[3];
      for (var user of this.filteredUsers) {
        if (user.userId == userId) {
          user.followers = result[0];
          user.following = result[1];
          return;
        }
      }
    });
  }
}
