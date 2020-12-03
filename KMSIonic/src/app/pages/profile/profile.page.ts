import { User } from './../../classes/user';
import { AuthenticationService } from './../../services/authentication.service';
import { UserService } from './../../services/user.service';
import { ProfileService } from './../../services/profile.service';
import { Profile } from './../../classes/profile';
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  profileid: string;
  loggedInUserId: number;
  profile: Profile;
  loggedInUser: User;
  constructor(
    private activatedRoute: ActivatedRoute,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.profileid = this.activatedRoute.snapshot.params.id;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId;
      this.reloadData();
    });
  }

  makeProfileClaim(id: String): void {
    this.profileService
      .makeProfileClaim(this.loggedInUser.userId.toString(), id)
      .subscribe(async () => {
        this.reloadData();
        const toast = await this.toastController.create({
          message: 'Claim request sent!',
          duration: 2000
        });
        toast.present();
      });
  }

  canSendProfileClaimRequest() {
    if (
      this.profile.claimProfileRequestMade
        .map((claimProfileRequest) => {
          return claimProfileRequest.user.userId;
        })
        .includes(this.loggedInUser.userId)
    ) {
      return false;
    } else {
      return true;
    }
  }

  hasProfile() {
    if (this.profile.userEntity) {
      return true;
    } else {
      return false;
    }
  }

  reloadData() {
    forkJoin([
      this.userService.getUser(this.loggedInUserId.toString()),
      this.profileService.getProfile(this.profileid)
    ]).subscribe((result) => {
      this.loggedInUser = result[0];
      this.profile = result[1];
      console.log(this.profile);
      console.log(this.loggedInUser);
    });
  }
}
