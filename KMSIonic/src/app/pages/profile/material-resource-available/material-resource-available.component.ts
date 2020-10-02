import { MaterialResourceAvailable } from "./../../../classes/material-resource-available"
import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core"
import { User } from "src/app/classes/user"
import { MaterialResourceAvailableService } from 'src/app/services/material-resource-available.service'
import { AlertController } from '@ionic/angular';

@Component({
  selector: "app-material-resource-available",
  templateUrl: "./material-resource-available.component.html",
  styleUrls: ["./material-resource-available.component.scss"]
})
export class MaterialResourceAvailableComponent implements OnInit {
  @Input() profile: User
  @Input() loggedInUser: User
  @Output() profileChanged = new EventEmitter<User>()
  seeAll: boolean = false
  profileIsLoggedInUser = false
  top2Mras: MaterialResourceAvailable[]

  constructor(private mraService: MaterialResourceAvailableService, public alertController: AlertController) {}

  ngOnInit() {
    this.top2Mras = this.profile.mras.slice(0, 2)
    this.profileIsLoggedInUser = this.profile.userId == this.loggedInUser.userId
  }

  toggleSeeAll() {
    this.seeAll = !this.seeAll
  }

  deleteMra(mraId: number) {
    this.mraService
      .deleteMaterialResourceAvailable(this.profile.userId, mraId)
      .subscribe((responsedata) => {
        this.profile.mras = responsedata;
        this.top2Mras = this.profile.mras.slice(0, 2);
        this.profileChanged.emit(this.profile);
      });
  }

  async deleteClicked(mraId: number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Material Resource Available?',
      message: 'This action cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirm',
          handler: () => {
            this.deleteMra(mraId);
          }
        }
      ]
    });
    await alert.present();
  }
}
