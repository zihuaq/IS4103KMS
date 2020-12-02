import { Component, Input, OnInit } from '@angular/core';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { ModalController, ToastController } from '@ionic/angular';
import { FulfillmentService } from '../../../../../services/fulfillment.service';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';

@Component({
  selector: 'app-receive-resource-modal',
  templateUrl: './receive-resource-modal.page.html',
  styleUrls: ['./receive-resource-modal.page.scss'],
})
export class ReceiveResourceModalPage implements OnInit {

  @Input() fulfillmentToUpdate: Fulfillment;

  quantityReceived: number;
  maxQuantity: number;

  constructor(public modalController: ModalController,
    private toastController: ToastController,
    private fulfillmentService: FulfillmentService) { }

  ngOnInit() {
    this.maxQuantity = this.fulfillmentToUpdate.unreceivedQuantity;
  }

  async receiveFulfillment() {
    if(this.quantityReceived == null){
      const toast = await this.toastController.create({
        message: "Please enter quantity received",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else if(!(this.quantityReceived > 0)){
      const toast = await this.toastController.create({
        message: "Quantity received is invalid",
        color: "danger",
        duration: 3500
      });
      toast.present();
    } else if (this.quantityReceived > this.maxQuantity) {
      const toast = await this.toastController.create({
        message: "Quantity received cannot be more than quantity unreceived",
        color: "danger",
        duration: 3500
      })
      toast.present();
    } else {
      this.fulfillmentToUpdate.receivedQuantity += this.quantityReceived;
      if (this.quantityReceived == this.fulfillmentToUpdate.unreceivedQuantity) { //fully received
        this.fulfillmentToUpdate.unreceivedQuantity = 0;
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
      } else { //partially received
        this.fulfillmentToUpdate.unreceivedQuantity -= this.quantityReceived;
        this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
      }
      this.fulfillmentService.receiveResource(this.fulfillmentToUpdate, null).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: "Quantity received is updated sucessfully",
            duration: 3500
          })
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
