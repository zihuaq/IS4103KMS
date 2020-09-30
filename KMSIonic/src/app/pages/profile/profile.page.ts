import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from "./../../services/authentication.service"
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: User;
  loggedInUser: User;
  loggedInUserId: number;  
  status = ['Active', 'Deactive'];
  passwordUpdated = false;
  passwordError = false;
  passwordErrorMessage: string;
  passwordSuccessMessage = 'Password successfully changed';


  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let profileid = this.activatedRoute.snapshot.params.userid;
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUserId = user.userId
      if (!profileid || profileid == this.loggedInUserId) {
        profileid = this.loggedInUserId;
        this.userService.getUser(profileid).subscribe((data: User) => {
          this.profile = data;
          this.loggedInUser = data;
          console.log(data);
          this.userService
            .getSkillsForProfile(this.profile.userId)
            .subscribe((skills) => {
              this.profile = { ...this.profile, skills };
            });
        });
      } else {
        this.userService
          .getUser(this.loggedInUserId.toString())
          .subscribe((data: User) => {
            console.log(data)
            this.loggedInUser = data;
          });

        this.userService.getUser(profileid).subscribe((data: User) => {
          console.log(data)
          this.profile = data;
          this.userService
            .getSkillsForProfile(this.profile.userId)
            .subscribe((skills) => {
              this.profile = { ...this.profile, skills };
            });
        });
      }
    });
  }

  // changePassword(passwordForm: NgForm) {
  //   if (passwordForm.valid) {
  //     let email = this.loggedInUser.email;
  //     let oldPassword = passwordForm.value.oldPassword;
  //     let newPassword = passwordForm.value.newPassword;
  //     let confirmNewPassword = passwordForm.value.confirmNewPassword;
  //     if (confirmNewPassword == newPassword) {
  //       this.userService
  //         .updateCustomerPassword(email, oldPassword, newPassword)
  //         .subscribe(
  //           (responsedata) => {
  //             this.passwordUpdated = true;
  //             this.passwordError = false;
  //             setTimeout(() => {
  //               $('#changePasswordModalCloseBtn').click();
  //             }, 2000);
  //           },
  //           (error) => {
  //             this.passwordError = true;
  //             this.passwordUpdated = false;
  //             this.passwordErrorMessage = 'Incorrect passward';
  //           }
  //         );
  //     } else {
  //       this.passwordError = true;
  //       this.passwordUpdated = false;
  //       this.passwordErrorMessage = 'passwords do not match';
  //     }
  //     console.log(passwordForm);
  //   }
  // }
}
