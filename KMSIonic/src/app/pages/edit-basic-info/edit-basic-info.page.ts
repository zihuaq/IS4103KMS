import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { User } from 'src/app/classes/user';
import { AccountPrivacySettingEnum } from 'src/app/enum/account-privacy-setting.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-basic-info',
  templateUrl: './edit-basic-info.page.html',
  styleUrls: ['./edit-basic-info.page.scss'],
})
export class EditBasicInfoPage implements OnInit {
  loggedInUser: User;
  loggedInUserId: number;
  updatedUser: User;
  privacySettings = AccountPrivacySettingEnum;
  genders = ["Male", "Female"];

  constructor(private location: Location, private activatedRoute: ActivatedRoute, private userService: UserService, 
    private authenticationService: AuthenticationService, public toastController: ToastController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let profileid = this.activatedRoute.snapshot.params.userid;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId;
        this.userService.getUser(profileid).subscribe((data) => {
          this.loggedInUser = data;
        })
      } else {
        //error
      }
    });
  }

  onEditProfile(editForm: NgForm) {
    this.updatedUser = new User();
    if (editForm.valid) {
      console.log(editForm)
      this.updatedUser.userId = this.loggedInUser.userId;
      this.updatedUser.firstName = editForm.value.firstName;
      this.updatedUser.lastName = editForm.value.lastName;
      this.updatedUser.email = editForm.value.email;
      this.updatedUser.dob = new Date(editForm.value.dob);
      this.updatedUser.profilePicture = this.loggedInUser.profilePicture;
      this.updatedUser.gender = editForm.value.gender;
      this.updatedUser.accountPrivacySetting = editForm.value.privacySettings;
      this.userService.updateUser(this.updatedUser).subscribe(
        async (responsedata: User) => {
          console.log(responsedata);
          this.updatedUser = {...this.loggedInUser,
            firstName: responsedata.firstName,
            lastName: responsedata.lastName,
            email: responsedata.email,
            gender: responsedata.gender,
            dob: responsedata.dob,
            profilePicture: responsedata.profilePicture,
            sdgs: responsedata.sdgs,
            accountPrivacySetting: responsedata.accountPrivacySetting
          };
          const toast = await this.toastController.create({
            message: 'Your settings have been saved.',
            duration: 2000
          });
          toast.present();
          this.location.back();
        },
        async (err) => {
          const toast = await this.toastController.create({
            message: err,
            duration: 2000
          });
        }
      );
    }
  }
}
