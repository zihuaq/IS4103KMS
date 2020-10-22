import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-deactivate-account',
  templateUrl: './deactivate-account.page.html',
  styleUrls: ['./deactivate-account.page.scss']
})
export class DeactivateAccountPage implements OnInit {
  status = ['Active', 'Deactive'];
  user: any;
  log = {
    status: ''
  };
  constructor(
    private route: Router,
    public authenticationService: AuthenticationService,
    private userService: UserService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.authenticationService.getCurrentUser().then((user: any) => {
      this.user = user;
    });
  }

  goBackToUserSettings() {
    this.route.navigate(['/user-setting']);
  }

  changeStatus() {
    let status = this.log.status;
    let statusBoolean = true;
    if (status == 'true') statusBoolean = true;
    else statusBoolean = false;
    this.user.isActive = statusBoolean;
    this.userService.updateUser(this.user).subscribe((responsedata: any) => {
      console.log('res\n' + responsedata);
    });

    console.log(this.user);
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'User Status Updated',
      message: 'User Status Updated Successfully!',
      buttons: ['OK']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    this.route.navigate(['/index']);
  }
}
