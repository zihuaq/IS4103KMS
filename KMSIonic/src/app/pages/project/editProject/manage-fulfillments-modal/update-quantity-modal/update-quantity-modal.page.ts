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

  mrpToFulfill: MaterialResourcePosting;
  newTotalPledgedQuantity: number;
  maxQuantity: number;

  constructor(public modalController: ModalController,
    private toastController: ToastController,
    private fulfillmentService: FulfillmentService,
    private mrpService: MrpService) { }

  ngOnInit() {
    this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
    this.mrpService.getMrp(this.mrpId).subscribe(
      response => {
        this.mrpToFulfill = response;
        this.maxQuantity = Math.max((this.fulfillmentToUpdate.totalPledgedQuantity + this.mrpToFulfill.lackingQuantity), (this.fulfillmentToUpdate.totalPledgedQuantity + this.fulfillmentToUpdate.mra.quantity));
      }
    )
  }

  async updateQuantity() {
    if(this.newTotalPledgedQuantity < this.fulfillmentToUpdate.receivedQuantity) {
      const toast = await this.toastController.create({
        message: "New pledged quantity cannot be less than quantity received",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else if(this.newTotalPledgedQuantity > (this.mrpToFulfill.lackingQuantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      const toast = await this.toastController.create({
        message: "New pledged quantity cannot be more than quantity required",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else if(this.newTotalPledgedQuantity > (this.fulfillmentToUpdate.mra.quantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      const toast = await this.toastController.create({
        message: "New pledged quantity cannot be more than available quantity of user",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else {
      this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
      if (this.fulfillmentToUpdate.totalPledgedQuantity == this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
      } else if(this.fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED && this.fulfillmentToUpdate.totalPledgedQuantity > this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
      }
      this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: "New pledged quantity is updated successfully",
            duration: 3500
          });
          toast.present();
          this.dismiss();
        }
      )
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
