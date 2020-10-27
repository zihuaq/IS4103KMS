import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MaterialResourceAvailableService } from 'src/app/services/material-resource-available.service';
import { MrpService } from 'src/app/services/mrp.service';
import { AddMraModalPage } from '../add-mra-modal/add-mra-modal.page';
import { Fulfillment } from '../../../../../classes/fulfillment';
import { FulfillmentService } from '../../../../../services/fulfillment.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-fulfill-posting',
  templateUrl: './fulfill-posting.page.html',
  styleUrls: ['./fulfill-posting.page.scss'],
})
export class FulfillPostingPage implements OnInit {

  loggedInUser: User;
  mrpId: number;
  mrp: MaterialResourcePosting;

  mraList: MaterialResourceAvailable[];
  selectedMra: MaterialResourceAvailable;
  newFulfillment: Fulfillment;
  maxQuantity: number;
  totalPledgedQuantity: number;

  constructor(private modalController: ModalController,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private mrpService: MrpService,
    private mraService: MaterialResourceAvailableService,
    private fulfillmentService: FulfillmentService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private location: Location) {
      this.newFulfillment = new Fulfillment();
      this.loggedInUser = new User();
      this.mrp = new MaterialResourcePosting();
      this.mraList = [];
    }

  ngOnInit() {}

  ionViewWillEnter() {
    this.refreshMraList();
  }

  refreshMraList() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.loggedInUser = user;
        this.mraService.getMaterialResourceAvailable(this.loggedInUser.userId).subscribe(
          response => {
            this.mraList = response;
          }
        );
      }
    );

    this.mrpId = parseInt(this.activatedRoute.snapshot.paramMap.get("mrpId"));
    
    this.mrpService.getMrp(this.mrpId).subscribe(
      response => {
        this.mrp = response;
      }
    );
  }

  async presentAddMraModal() {
    const modal = await this.modalController.create({
      component: AddMraModalPage,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: 'add-mra-modal',
      componentProps: {
        loggedInUser: this.loggedInUser,
        selectedMrp: this.mrp
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshMraList();
    });
  }

  async clickSelectMra(mra: MaterialResourceAvailable) {
    console.log(mra);
    if (mra.units != this.mrp.unit) {
      const toast = await this.toastController.create({
        message: "Please change the units of the resource or create a new resource",
        color: "danger",
        duration: 3000
      })
      toast.present();
      return;
    } else {
      this.maxQuantity = Math.min(mra.quantity, this.mrp.lackingQuantity);
    }
    if (mra.endDate != null && mra.endDate < new Date(this.mrp.endDate.toString().slice(0, 20))) {
      const toast = await this.toastController.create({
        message: "Donated resource will expire before the end date of the posting",
        color: "danger",
        duration: 3500
      })
      toast.present();
    } else if (mra.startDate != null && mra.startDate > new Date(this.mrp.startDate.toString().slice(0, 20))) {
      const toast = await this.toastController.create({
        message: "Donated resource is only available after the start date of the posting",
        color: "danger",
        duration: 3500
      })
      toast.present();
    } else {
      this.selectedMra = mra;
    }
  }

  clickReselect() {
    this.selectedMra = null;
    this.totalPledgedQuantity = null;
  }

  async fulfillPosting() { 
    if(this.totalPledgedQuantity == null){
      const toast = await this.toastController.create({
        message: "Please enter donated quantity",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else if(!(this.totalPledgedQuantity > 0)){
      const toast = await this.toastController.create({
        message: "Donated quantity is invalid",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else if(this.totalPledgedQuantity > this.mrp.lackingQuantity){
      const toast = await this.toastController.create({
        message: "Donated quantity cannot be more than required quantity",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else if(this.totalPledgedQuantity > this.selectedMra.quantity) {
      const toast = await this.toastController.create({
        message: "Donated quantity cannot be more than your available quantity",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else {
      this.newFulfillment.mra = new MaterialResourceAvailable();
      this.newFulfillment.posting = new MaterialResourcePosting();
      this.newFulfillment.totalPledgedQuantity = this.totalPledgedQuantity;
      this.newFulfillment.mra.quantity = this.selectedMra.quantity - this.newFulfillment.totalPledgedQuantity;
      this.newFulfillment.posting.lackingQuantity = this.mrp.lackingQuantity - this.newFulfillment.totalPledgedQuantity;
      this.fulfillmentService.createNewFulfillment(this.newFulfillment, this.loggedInUser.userId, this.mrp.materialResourcePostingId, this.selectedMra.mraId).subscribe(
        response => {
          this.selectedMra = null;
          this.totalPledgedQuantity = null;
          this.location.back();
          this.toast(true);
        },
        error => {
          this.toast(false);
        }
      )
    }
  }

  async toast(success: boolean) {
    if (success) {
      const toast = await this.toastController.create({
        message: "Fulfillment is successfully created",
        duration: 2500
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: "Unable to create Fulfill Posting",
        color: "danger",
        duration: 3500
      });
      toast.present();
    }
  }

}
