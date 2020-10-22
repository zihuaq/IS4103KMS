import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../classes/user';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.page.html',
  styleUrls: ['./user-setting.page.scss']
})
export class UserSettingPage implements OnInit {
  user: User;

  constructor(
    private route: Router,
    private userService: UserService,
    public authenticationService: AuthenticationService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    this.authenticationService.getCurrentUser().then((user: any) => {
      this.user = user;
    });
  }

  changePassword() {
    this.route.navigate(['/changepassword']);
  }
  activateAndDeactivate() {
    this.route.navigate(['/deactivate-account']);
  }

  async alertUserOnDelete() {
    const alert = await this.alertController.create({
      header: 'Delete Successfully',
      message: 'Your Account has been Deleted.',
      buttons: ['OK']
    });

    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
    this.route.navigate(['/login']);
  }

  refresh(): void {
    window.location.reload();
  }

  runDelete() {
    console.log(this.user.userId);
    this.userService.deleteUser(this.user.userId).subscribe((response) => {
      console.log(response);
    });
    this.authenticationService.logout();
  }
}
