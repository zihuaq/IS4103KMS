import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AffiliationRequest } from 'src/app/classes/affiliation-request';
import { FollowRequest } from 'src/app/classes/follow-request';
import { User } from 'src/app/classes/user';
import { AccountPrivacySettingEnum } from 'src/app/enum/account-privacy-setting.enum';
import { UserType } from 'src/app/enum/user-type.enum';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() profileChanged = new EventEmitter<User>();
  @Output() userChanged = new EventEmitter<User>();
  isFollowing: boolean;
  hasSentFollowRequest: boolean;
  isAffiliated: boolean;
  hasSentAffiliationRequest: boolean;
  UserType = UserType;

  constructor(private userService: UserService, public toastController: ToastController) { }

  ngOnInit() {
    this.getFollowersFollowingAndAffiliatedUsers();
  }

  follow() {
    this.userService
      .followUser(
        this.profile.userId.toString(),
        this.loggedInUser.userId.toString()
      )
      .subscribe(
        async (followRequest: FollowRequest) => {
          if (followRequest) {
            const toast = await this.toastController.create({
              message: 'Follow Request sent successfully.',
              duration: 2000
            });
            toast.present();
          }
          this.getFollowersFollowingAndAffiliatedUsers();
        },
        async (err: any) => {
          const toast = await this.toastController.create({
            message: err,
            duration: 2000
          });
          toast.present();
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
        this.getFollowersFollowingAndAffiliatedUsers();
      });
  }

  sendAffiliationRequest() {
    this.userService.sendAffiliateReqToUser(
      this.loggedInUser.userId,
      this.profile.userId
    ).subscribe(
      async (affiliationRequest: AffiliationRequest) => {
        if (affiliationRequest) {
          const toast = await this.toastController.create({
            message: 'Affiliation Request sent successfully.',
            duration: 2000
          });
          toast.present();
        }
        this.getFollowersFollowingAndAffiliatedUsers();
      },
      async (err: any) => {
        const toast = await this.toastController.create({
          message: err,
          duration: 2000
        });
        toast.present();
      }
    );
  }

  removeAffiliation() {
    this.userService.removeAffiliatedUser(this.loggedInUser.userId, this.profile.userId).subscribe(() => {
      this.getFollowersFollowingAndAffiliatedUsers();
    });
  }

  isPublic() {
    return (
      this.profile.accountPrivacySetting == AccountPrivacySettingEnum.PUBLIC
    );
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
      this.isAffiliated = this.profile.affiliatedUsers.map((user) => user.userId).includes(this.loggedInUser.userId);
      this.hasSentAffiliationRequest = result[5].map((affiliationRequestMade: AffiliationRequest) => {
        return affiliationRequestMade.to.userId;
      })
        .includes(this.profile.userId);
      console.log("overview" + this.profile)
    });
  }
}
