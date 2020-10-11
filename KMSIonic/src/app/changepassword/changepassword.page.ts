import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { AuthenticationService } from '../services/authentication.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AlertController} from '@ionic/angular';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

  status = ['Active', 'Deactive'];
  passwordUpdated = false;
  passwordError = false;
  passwordErrorMessage: string;
  passwordSuccessMessage = 'Password successfully changed';
  loggedInUser: any;

  constructor(private route: Router,
    public authenticationService: AuthenticationService,
    private userService: UserService,
    public alertController: AlertController) { }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then((user: any) => {
      this.loggedInUser = user;
    });
  }

  goBackToUserSettings(){
    this.route.navigate(["/user-setting"])
  }
  
  changePassword(passwordForm: NgForm) {
    if (passwordForm.valid) {
      let email = this.loggedInUser.email;
      let oldPassword = passwordForm.value.oldPassword;
      let newPassword = passwordForm.value.newPassword;
      let confirmNewPassword = passwordForm.value.confirmNewPassword;
      if (confirmNewPassword == newPassword) {
        this.userService
          .updateCustomerPassword(email, oldPassword, newPassword)
          .subscribe(
            (responsedata) => {
              this.passwordUpdated = true;
              this.passwordError = false;
            },
            (error) => {
              this.passwordError = true;
              this.passwordUpdated = false;
              this.passwordErrorMessage = 'Incorrect passward';
            }
          );
      } else {
        this.passwordError = true;
        this.passwordUpdated = false;
        this.passwordErrorMessage = 'passwords do not match';
      }
      console.log(passwordForm);
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Password Updated',
      message: 'Password Updated Successfully!',
      buttons: ['OK']
    });

    await alert.present()
    let result = await alert.onDidDismiss();
    console.log(result);
    this.route.navigate(['/index']);
  }

}
