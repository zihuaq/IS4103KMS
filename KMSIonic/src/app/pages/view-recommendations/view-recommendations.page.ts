import { FollowingOfFollowingRsp } from './../../models/FollowingOfFollowingRsp';
import { FollowRequest } from './../../classes/follow-request';
import { User } from './../../classes/user';
import { UserService } from './../../services/user.service';
import { AuthenticationService } from './../../services/authentication.service';
import { MatchingService } from './../../services/matching.service';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-recommendations',
  templateUrl: './view-recommendations.page.html',
  styleUrls: ['./view-recommendations.page.scss']
})
export class ViewRecommendationsPage implements OnInit {
  currentUser: User;
  followersToFollow: User[];
  followingOfFollowing: FollowingOfFollowingRsp[];
  hasRecommendations: Boolean;
  loggedInUserFollowing: User[];
  loggedInUserFollowRequestMade: FollowRequest[];
  constructor(
    private router: Router,
    private matchingService: MatchingService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.currentUser = user;
      this.updateComponent();
    });
  }

  follow(userId: number, event) {
    event.stopPropagation();
    this.userService
      .followUser(userId.toString(), this.currentUser.userId.toString())
      .subscribe(async (followRequest: FollowRequest) => {
        if (followRequest) {
          const toast = await this.toastController.create({
            message: 'Sent Follow Request',
            duration: 2000
          });
          toast.present();
        } else {
          const toast = await this.toastController.create({
            message: 'Followed successfully',
            duration: 2000
          });
          toast.present();
        }
        this.updateComponent();
      });
  }

  goToProfile(user: User) {
    this.router.navigate(['/user-profile/' + user.userId]);
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
      if (
        this.followingOfFollowing.length == 0 &&
        this.followersToFollow.length == 0
      ) {
        this.hasRecommendations = false;
      } else {
        this.hasRecommendations = true;
      }
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
}
