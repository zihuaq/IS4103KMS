import { GroupRecommendationBasedOnFollowingRsp } from './../../models/GroupRecommendationBasedOnFollowingRsp';
import { GroupService } from 'src/app/services/group.service';
import { Group } from 'src/app/classes/group';
import { ProjectService } from 'src/app/services/project.service';
import { Tag } from 'src/app/classes/tag';
import { ProjectRecommendationBasedOnFollowingRsp } from './../../models/ProjectRecommendationBasedOnFollowingRsp';
import { Project } from 'src/app/classes/project';
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
  hasFollowRecommendations: Boolean;
  loggedInUserFollowing: User[];
  loggedInUserFollowRequestMade: FollowRequest[];
  projectRecoBySDG: Project[];
  projectRecoByFollowing: ProjectRecommendationBasedOnFollowingRsp[];
  hasProjectRecommendations: Boolean;
  loggedInUserProjects: Project[];
  groupRecoBySDG: Group[];
  groupRecoByFollowing: GroupRecommendationBasedOnFollowingRsp[];
  hasGroupRecommendations: Boolean;
  loggedInUserGroups: Group[];
  constructor(
    private router: Router,
    private matchingService: MatchingService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private projectService: ProjectService,
    private groupService: GroupService,
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

  goToGroup(group: Group) {
    this.router.navigate(['/group-details/' + group.groupId]);
  }

  goToProject(project: Project) {
    this.router.navigate([
      '/project-details/' + project.projectId + '/projectfeed-tab'
    ]);
  }

  updateComponent() {
    forkJoin([
      this.matchingService.getFollowersToFollow(this.currentUser.userId),
      this.matchingService.getFollowingofFollowing(this.currentUser.userId),
      this.userService.getFollowing(this.currentUser.userId),
      this.userService.getFollowRequestMade(this.currentUser.userId),
      this.matchingService.getProjectRecommendationsBasedOnSDG(
        this.currentUser.userId
      ),
      this.matchingService.getProjectRecommendationsBasedOnFollowing(
        this.currentUser.userId
      ),
      this.userService.getProjectsJoined(this.currentUser.userId),
      this.matchingService.getGroupRecommendationsBasedOnSDG(
        this.currentUser.userId
      ),
      this.matchingService.getGroupRecommendationsBasedOnFollowing(
        this.currentUser.userId
      ),
      this.userService.getGroupsJoined(this.currentUser.userId)
    ]).subscribe((result) => {
      this.followersToFollow = result[0];
      this.followingOfFollowing = result[1];
      this.loggedInUserFollowing = result[2];
      this.loggedInUserFollowRequestMade = result[3];
      if (
        this.followingOfFollowing.length == 0 &&
        this.followersToFollow.length == 0
      ) {
        this.hasFollowRecommendations = false;
      } else {
        this.hasFollowRecommendations = true;
      }
      this.projectRecoBySDG = result[4];
      this.projectRecoByFollowing = result[5];
      this.loggedInUserProjects = result[6];
      if (
        this.projectRecoBySDG.length == 0 &&
        this.projectRecoByFollowing.length == 0
      ) {
        this.hasProjectRecommendations = false;
      } else {
        this.hasProjectRecommendations = true;
      }
      this.groupRecoBySDG = result[7];
      this.groupRecoByFollowing = result[8];
      this.loggedInUserGroups = result[9];
      if (
        this.groupRecoBySDG.length == 0 &&
        this.groupRecoByFollowing.length == 0
      ) {
        this.hasGroupRecommendations = false;
      } else {
        this.hasGroupRecommendations = true;
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

  joinProject(project: Project) {
    console.log('******** joinProject()');
    this.projectService
      .joinProject(project.projectId, this.currentUser.userId)
      .subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Welcome to the project',
            duration: 2000
          });
          toast.present();
          this.updateComponent();
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: error,
            duration: 2000
          });
          toast.present();
        }
      );
  }

  joinGroup(group: Group) {
    this.groupService
      .joinGroup(group.groupId, this.currentUser.userId)
      .subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Welcome to the group',
            duration: 2000
          });
          toast.present();
          this.updateComponent();
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: error,
            duration: 2000
          });
          toast.present();
        }
      );
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => a.tagId - b.tagId);
  }
}
