import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AffiliationRequest } from 'src/app/classes/affiliation-request';
import { FollowRequest } from 'src/app/classes/follow-request';
import { User } from 'src/app/classes/user';
import { AccountPrivacySettingEnum } from 'src/app/enum/account-privacy-setting.enum';
import { UserType } from 'src/app/enum/user-type.enum';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @Input() profile: User;
  @Input() loggedInUser: User;
  @Output() init = new EventEmitter();
  @Input() isFollowing: boolean;
  @Input() hasSentFollowRequest: boolean;
  @Input() isAffiliated: boolean;
  @Input() hasSentAffiliationRequest: boolean;
  UserType = UserType;
  profileUrl: string;

  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private socialSharing: SocialSharing
  ) {}

  ngOnInit() {
    this.profileUrl =
      'http://localhost:4200/profile/shared/' + this.profile.userId;
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
          this.init.emit();
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
        this.init.emit();
      });
  }

  sendAffiliationRequest() {
    this.userService
      .sendAffiliateReqToUser(this.loggedInUser.userId, this.profile.userId)
      .subscribe(
        async (affiliationRequest: AffiliationRequest) => {
          if (affiliationRequest) {
            const toast = await this.toastController.create({
              message: 'Affiliation Request sent successfully.',
              duration: 2000
            });
            toast.present();
          }
          this.init.emit();
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
    this.userService
      .removeAffiliatedUser(this.loggedInUser.userId, this.profile.userId)
      .subscribe(() => {
        this.init.emit();
      });
  }

  isPublic() {
    return (
      this.profile.accountPrivacySetting == AccountPrivacySettingEnum.PUBLIC
    );
  }

  sShare() {
    var options = {
      message: 'share this',
      url: this.profileUrl
    };
    this.socialSharing.shareWithOptions(options);
  }
}
