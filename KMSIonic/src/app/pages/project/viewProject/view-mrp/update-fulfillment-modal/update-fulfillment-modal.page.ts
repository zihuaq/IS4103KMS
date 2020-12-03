import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { MraType } from 'src/app/enum/mra-type.enum';
import { PaymentBasis } from 'src/app/enum/payment-basis.enum';
import { FulfillmentService } from 'src/app/services/fulfillment.service';
import { MrpService } from 'src/app/services/mrp.service';

@Component({
  selector: 'app-update-fulfillment-modal',
  templateUrl: './update-fulfillment-modal.page.html',
  styleUrls: ['./update-fulfillment-modal.page.scss'],
})
export class UpdateFulfillmentModalPage implements OnInit {

  @Input() fulfillmentToUpdate: Fulfillment;

  newTotalPledgedQuantity: number;

  constructor(public modalController: ModalController,
    private toastController: ToastController,
    private fulfillmentService: FulfillmentService,
    private mrpService: MrpService) { }

  ngOnInit() {
    this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
  }

  async updateFulfillment(updateFulfillmentForm: NgForm) {
    if(this.fulfillmentToUpdate.priceOffered <= 0 && this.fulfillmentToUpdate.mra.type != MraType.ONETIMEDONATION){
      const toast = await this.toastController.create({
        message: 'Price offered is invalid',
        color: "warning",
        duration: 3000
      });
      toast.present();
    } else if(this.newTotalPledgedQuantity <= 0){
      const toast = await this.toastController.create({
        message: 'Total pledged quantity is invalid',
        color: "warning",
        duration: 3000
      });
      toast.present();
    } else if(this.newTotalPledgedQuantity > (this.fulfillmentToUpdate.posting.lackingQuantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      const toast = await this.toastController.create({
        message: 'Total pledged quantity cannot be more than quantity required',
        color: "warning",
        duration: 3500
      });
      toast.present();
    } else {
      this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
      if (this.fulfillmentToUpdate.paymentBasis != PaymentBasis.ONCE && this.fulfillmentToUpdate.paymentBasis) {
        if (this.fulfillmentToUpdate.basisOffered == MraType.DAILY || this.fulfillmentToUpdate.basisOffered == MraType.WEEKLY) {
          this.fulfillmentToUpdate.paymentBasis = PaymentBasis.WEEKLY;
        } else if (this.fulfillmentToUpdate.basisOffered == MraType.MONTHLY) {
          this.fulfillmentToUpdate.paymentBasis = PaymentBasis.MONTHLY;
        }
      }
      console.log(this.fulfillmentToUpdate);
      this.fulfillmentService.updateFulfillment(this.fulfillmentToUpdate).subscribe(
        async response => {
          this.dismiss();
          const toast = await this.toastController.create({
            message: 'Fulfillment is updated successfully',
            color: "success",
            duration: 3500
          });
          toast.present();
        }
      )
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  get mraType(): typeof MraType {
    return MraType;
  }

}
