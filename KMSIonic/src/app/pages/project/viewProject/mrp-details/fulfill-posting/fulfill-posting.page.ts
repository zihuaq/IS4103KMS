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
import { MraType } from 'src/app/enum/mra-type.enum';
import { NgForm } from '@angular/forms';
import { PaymentBasis } from 'src/app/enum/payment-basis.enum';
import * as moment from 'moment';

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

  clickSelectMra(mra: MaterialResourceAvailable) {
    console.log(mra);
    this.selectedMra = mra;
    this.newFulfillment = new Fulfillment();
    if (this.selectedMra.type != MraType.ONETIMEDONATION && this.selectedMra.type != MraType.ONETIMEPAYMENT) {
      this.newFulfillment.basisOffered = this.selectedMra.type;
    }
    if (this.selectedMra.units == this.mrp.unit) {
      this.newFulfillment.priceOffered = this.selectedMra.price;
    }
  }

  clickReselect() {
    this.selectedMra = null;
  }

  async submitFulfillPosting(fulfillPostingForm: NgForm) { 
    if(this.newFulfillment.priceOffered <= 0 && this.selectedMra.type != MraType.ONETIMEDONATION){
      const toast = await this.toastController.create({
        message: "Price offered is invalid",
        color: "warning",
        duration: 3500
      });
      toast.present();
    } else if(!(this.newFulfillment.totalPledgedQuantity > 0)){
      const toast = await this.toastController.create({
        message: "Pledged quantity is invalid",
        color: "warning",
        duration: 3500
      });
      toast.present();
    } else if(this.newFulfillment.totalPledgedQuantity > this.mrp.lackingQuantity){
      const toast = await this.toastController.create({
        message: "Donated quantity cannot be more than required quantity",
        color: "warning",
        duration: 3500
      });
      toast.present();
    } else {
      if (this.selectedMra.type != MraType.ONETIMEDONATION && this.selectedMra.type != MraType.ONETIMEPAYMENT) { //recurring
        if (!this.mrp.endDate) { //no end date
          if (this.newFulfillment.basisOffered == MraType.DAILY || this.newFulfillment.basisOffered == MraType.WEEKLY) {
            this.newFulfillment.paymentBasis = PaymentBasis.WEEKLY;
          } else if (this.newFulfillment.basisOffered == MraType.MONTHLY) {
            this.newFulfillment.paymentBasis = PaymentBasis.MONTHLY;
          }
        } else { //have end date
          var startDate = moment(this.mrp.startDate.toString().slice(0,15));
          var endDate = moment(this.mrp.endDate.toString().slice(0,15));
          var diff = endDate.diff(startDate, 'months', true);
          if (diff > 1) { //more than a month, pay in installments
            if (this.newFulfillment.basisOffered == MraType.DAILY || this.newFulfillment.basisOffered == MraType.WEEKLY) {
              this.newFulfillment.paymentBasis = PaymentBasis.WEEKLY;
            } else if (this.newFulfillment.basisOffered == MraType.MONTHLY) {
              this.newFulfillment.paymentBasis = PaymentBasis.MONTHLY;
            }
          } else { //a month or less, pay in full
            this.newFulfillment.paymentBasis = PaymentBasis.ONCE;
          }
        }
      }
      if (!this.newFulfillment.priceOffered) {
        this.newFulfillment.priceOffered = 0.0
      }
      if (!this.newFulfillment.basisOffered) {
        this.newFulfillment.basisOffered = null
      }
      if (!this.newFulfillment.paymentBasis) {
        this.newFulfillment.paymentBasis = null
      }
      console.log(this.newFulfillment);
      this.fulfillmentService.createNewFulfillment(this.newFulfillment, this.loggedInUser.userId, this.mrp.materialResourcePostingId, this.selectedMra.mraId).subscribe(
        response => {
          this.selectedMra = null;
          this.newFulfillment = new Fulfillment();
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
        color: "success",
        duration: 2500
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: "Unable to create Fulfill Posting",
        color: "warning",
        duration: 3500
      });
      toast.present();
    }
  }
  
  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    return url;
  }

}
