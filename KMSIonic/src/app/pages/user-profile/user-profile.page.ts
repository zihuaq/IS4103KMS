import { AffiliationRequest } from './../../classes/affiliation-request';
import { FollowRequest } from './../../classes/follow-request';
import { Post } from './../../classes/post';
import { PostService } from './../../services/post.service';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from './../../services/authentication.service';
import { forkJoin } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ReportProfileComponent } from './report-profile/report-profile.component';
import { MaterialResourceAvailableService } from './../../services/material-resource-available.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss']
})
export class UserProfilePage implements OnInit {
  profile: User;
  loggedInUser: User;
  loggedInUserId: number;
  status = ['Active', 'Deactive'];
  passwordUpdated = false;
  passwordError = false;
  passwordErrorMessage: string;
  passwordSuccessMessage = 'Password successfully changed';
  newsfeedPosts: Post[];
  isFollowing: boolean;
  hasSentFollowRequest: boolean;
  isAffiliated: boolean;
  hasSentAffiliationRequest: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private mraService: MaterialResourceAvailableService,
    private modalController: ModalController,
    private app: ApplicationRef,
    private router: Router,
    private postService: PostService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    let profileid = this.activatedRoute.snapshot.params.userid;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId;
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId;
        forkJoin([
          this.userService.getUser(profileid),
          this.userService.getSkillsForProfile(profileid),
          this.userService.getSDGsForProfile(profileid),
          this.mraService.getMaterialResourceAvailable(profileid),
          this.postService.getPostForProfileNewsfeed(profileid)
        ]).subscribe((result) => {
          this.profile = result[0];
          this.loggedInUser = result[0];
          this.profile.skills = result[1];
          this.profile.sdgs = result[2];
          this.profile.mras = result[3];
          this.newsfeedPosts = result[4];
          this.getFollowersFollowingAndAffiliatedUsers();
          this.app.tick();
        });
      } else {
        forkJoin([
          this.userService.getUser(this.loggedInUserId.toString()),
          this.userService.getUser(profileid),
          this.userService.getSkillsForProfile(profileid),
          this.userService.getSDGsForProfile(profileid),
          this.mraService.getMaterialResourceAvailable(profileid),
          this.postService.getPostForProfileNewsfeed(profileid)
        ]).subscribe((result) => {
          this.loggedInUser = result[0];
          this.profile = result[1];
          this.profile.skills = result[2];
          this.profile.sdgs = result[3];
          this.profile.mras = result[4];
          this.newsfeedPosts = result[5];
          this.getFollowersFollowingAndAffiliatedUsers();
          this.app.tick();
        });
      }
    });
  }

  async presentReportProfileModal() {
    const modal = await this.modalController.create({
      component: ReportProfileComponent,
      componentProps: {
        profileId: this.profile.userId,
        loggedInUserId: this.loggedInUserId
      }
    });
    return await modal.present();
  }

  goToSetting() {
    this.router.navigate(['/user-setting']);
  }

  getFollowersFollowingAndAffiliatedUsers() {
    forkJoin([
      this.userService.getFollowers(this.profile.userId),
      this.userService.getFollowing(this.profile.userId),
      this.userService.getFollowing(this.loggedInUser.userId),
      this.userService.getFollowRequestMade(this.loggedInUser.userId),
      this.userService.getAffiliatedUsers(this.profile.userId),
      this.userService.getAffiliationRequestMade(this.loggedInUser.userId)
    ]).subscribe((result) => {
      this.profile = { ...this.profile, followers: result[0] };
      this.profile = { ...this.profile, following: result[1] };
      this.loggedInUser = { ...this.loggedInUser, following: result[2] };
      this.isFollowing = this.loggedInUser.following
        .map((user) => user.userId)
        .includes(this.profile.userId);
      this.hasSentFollowRequest = result[3]
        .map((followRequestMade: FollowRequest) => {
          return followRequestMade.to.userId;
        })
        .includes(this.profile.userId);
      this.profile = { ...this.profile, affiliatedUsers: result[4] };
      this.isAffiliated = this.profile.affiliatedUsers
        .map((user) => user.userId)
        .includes(this.loggedInUser.userId);
      this.hasSentAffiliationRequest = result[5]
        .map((affiliationRequestMade: AffiliationRequest) => {
          return affiliationRequestMade.to.userId;
        })
        .includes(this.profile.userId);
    });
  }
}
