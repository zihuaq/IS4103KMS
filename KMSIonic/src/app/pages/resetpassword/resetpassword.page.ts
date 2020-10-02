import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {

  constructor(public alertController: AlertController,
    private route: Router) { }

  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Action Required',
      message: 'Please check your email for verification link',
      buttons: ['OK']
    });

    await alert.present()
    let result = await alert.onDidDismiss();
    console.log(result);
    this.route.navigate(['/login']);
  }

}
