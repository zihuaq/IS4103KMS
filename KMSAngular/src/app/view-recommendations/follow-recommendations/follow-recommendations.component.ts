import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/classes/user';
import { MatchingService } from 'src/app/matching.service';
import { SessionService } from 'src/app/session.service';
import { FollowingOfFollowingRsp } from 'src/app/models/FollowingOfFollowingRsp';
import { UserService } from 'src/app/user.service';
import { FollowRequest } from 'src/app/classes/follow-request';

declare var $: any;

@Component({
  selector: 'app-follow-recommendations',
  templateUrl: './follow-recommendations.component.html',
  styleUrls: ['./follow-recommendations.component.css']
})
export class FollowRecommendationsComponent implements OnInit {

  currentUser: User;
  followersToFollow: User[];
  followingOfFollowing: FollowingOfFollowingRsp[];
  hasRecommendations: Boolean;
  hasMoreRecommendations: Boolean;
  loggedInUserFollowing: User[];
  loggedInUserFollowRequestMade: FollowRequest[];
  fullView: boolean = false;

  constructor(private sessionService: SessionService, private matchingService: MatchingService, private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.sessionService.getCurrentUser();
    this.updateComponent();
  }

  follow(userId: number) {
    this.userService
      .followUser(userId.toString(), this.currentUser.userId.toString())
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
        this.updateComponent();
      });
  }

  updateComponent() {
    forkJoin([
      this.matchingService.getFollowersToFollow(this.currentUser.userId),
      this.matchingService.getFollowingofFollowing(this.currentUser.userId),
      this.userService.getFollowing(this.currentUser.userId),
      this.userService.getFollowRequestMade(this.currentUser.userId),
    ]).subscribe((result) => {
      this.followersToFollow = result[0];
      this.followingOfFollowing = result[1];
      this.loggedInUserFollowing = result[2];
      this.loggedInUserFollowRequestMade = result[3];
      if (this.followingOfFollowing.length > 0 || this.followersToFollow.length > 0) {
        this.hasRecommendations = true;
        if(this.followingOfFollowing.length > 2 || this.followersToFollow.length > 2){
          this.hasMoreRecommendations = true;
        }
      } else {
        this.hasRecommendations = false;
      }
    })
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

  toggleFullView(){
    this.fullView = !this.fullView;
  }
}
