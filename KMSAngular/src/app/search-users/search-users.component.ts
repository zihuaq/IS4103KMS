import { Component, OnInit } from '@angular/core';
import { FollowRequest } from '../classes/follow-request';
import { User } from '../classes/user';
import { SessionService } from '../session.service';
import { UserService } from '../user.service';

declare var $: any;

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit {

  allUsers: User[];
  filteredUsers: User[];
  searchString: string;
  loggedInUser: User;

  constructor(private userService: UserService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((response) => {
      this.allUsers = response;
      this.filteredUsers = this.allUsers;
    });
    let loggedInUserId = this.sessionService.getCurrentUser().userId;
    this.userService.getUser(loggedInUserId.toString()).subscribe((data: User) => {
      this.loggedInUser = data;
    });
  }

  handleSearchStringChanged(event) {
    this.searchString = event;
    this.filteredUsers = [];
    for (var user of this.allUsers) {
      if (user.firstName.toLowerCase().includes(this.searchString.toLowerCase()) || user.lastName.toLowerCase().includes(this.searchString.toLowerCase())) {
        this.filteredUsers.push(user);
      }
    }
  }

  follow(userId: number) {
    this.userService
      .followUser(
        userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe((followRequest: FollowRequest) => {
        if (followRequest) {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Sent Follow Request',
            autohide: true,
            delay: 2500,
            body: 'Follow Request sent successfully',
          });
          this.updateLoginUserAndUser(userId);
        }
        this.updateUserFollowRequestReceived(userId);
      });
  }

  unfollow(userId: number) {
    this.userService
      .unfollowUser(
        userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(() => {
        this.updateLoginUserAndUser(userId);
      });
  }

  checkLoginUserHasFollowed(userId: number) {
    return this.loggedInUser.following
      .map((user) => user.userId)
      .includes(userId);
  }

  checkLoginUserHaveSentFollowReq(userId: number) {
    return this.loggedInUser.followRequestMade
      .map((f) => f.from.userId)
      .includes(this.loggedInUser.userId);
  }

  private updateLoginUserAndUser(userId: number) {
    this.userService.getFollowers(userId).subscribe((response) => {
      for (var user of this.filteredUsers) {
        if (user.userId == userId) {
          user.followers = response;
          return;
        }
      }
    });
    this.userService.getFollowing(this.loggedInUser.userId).subscribe((response) => {
      this.loggedInUser.following = response;
    });
  }

  private updateUserFollowRequestReceived(userId: number) {
    this.userService.getFollowRequests(userId).subscribe((response) => {
      for (var user of this.filteredUsers) {
        if (user.userId == userId) {
          user.followRequestReceived = response;
          return;
        }
      }
    });
  }
}
