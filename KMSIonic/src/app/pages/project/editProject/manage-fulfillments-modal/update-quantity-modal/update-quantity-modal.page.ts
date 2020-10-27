import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { FulfillmentService } from 'src/app/services/fulfillment.service';
import { MrpService } from '../../../../../services/mrp.service';

@Component({
  selector: 'app-update-quantity-modal',
  templateUrl: './update-quantity-modal.page.html',
  styleUrls: ['./update-quantity-modal.page.scss'],
})
export class UpdateQuantityModalPage implements OnInit {

  @Input() mrpId: number;
  @Input() fulfillmentToUpdate: Fulfillment;
  @Input() byUser: boolean;

  mrpToFulfill: MaterialResourcePosting;
  newTotalPledgedQuantity: number;
  maxQuantity: number;

  constructor(public modalController: ModalController,
    private toastController: ToastController,
    private fulfillmentService: FulfillmentService,
    private mrpService: MrpService) { }

  ngOnInit() {
    console.log(this.byUser);
    this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
    this.mrpService.getMrp(this.mrpId).subscribe(
      response => {
        this.mrpToFulfill = response;
        this.maxQuantity = Math.max((this.fulfillmentToUpdate.totalPledgedQuantity + this.mrpToFulfill.lackingQuantity), (this.fulfillmentToUpdate.totalPledgedQuantity + this.fulfillmentToUpdate.mra.quantity));
      }
    )
  }

  async updateQuantity() {
    if(this.newTotalPledgedQuantity == null){
      this.toast(false, "New pledged quantity is required");

    } else if(!(this.newTotalPledgedQuantity > 0)){
      this.toast(false, "New pledged quantity is invalid");

    } else if(this.newTotalPledgedQuantity < this.fulfillmentToUpdate.receivedQuantity) {
      this.toast(false, "New pledged quantity cannot be less than quantity received");

    } else if(this.newTotalPledgedQuantity > (this.mrpToFulfill.lackingQuantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      this.toast(false, "New pledged quantity cannot be more than quantity required");

    } else if(this.newTotalPledgedQuantity > (this.fulfillmentToUpdate.mra.quantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      if (this.byUser == false) {
        this.toast(false, "New pledged quantity cannot be more than available quantity of user");
      } else {
        this.toast(false, "New pledged quantity cannot be more than your available quantity");
      }
    } else {
      this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
      if (this.fulfillmentToUpdate.totalPledgedQuantity == this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
      } else if(this.fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED && this.fulfillmentToUpdate.totalPledgedQuantity > this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
      }
      this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate).subscribe(
        response => {
          this.toast(true, "New pledged quantity is updated successfully");
          this.dismiss();
        }
      )
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async toast(success: boolean, body: string) {
    if (success) {
      const toast = await this.toastController.create({
        message: body,
        duration: 3500
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: body,
        color: 'danger',
        duration: 3500
      });
      toast.present();
    } 
  }

}
