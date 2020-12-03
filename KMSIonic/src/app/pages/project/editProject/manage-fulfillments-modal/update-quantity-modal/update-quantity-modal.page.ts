import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { FulfillmentService } from 'src/app/services/fulfillment.service';
import { MrpService } from '../../../../../services/mrp.service';
import { PayPal, PayPalConfiguration, PayPalPayment } from '@ionic-native/paypal/ngx';
import { Payment } from 'src/app/classes/payment';
import { MraType } from 'src/app/enum/mra-type.enum';
import { PaymentStatus } from 'src/app/enum/payment-status.enum';

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
  paymentAmount: number;
  newPayment: Payment;

  constructor(public modalController: ModalController,
    private payPal: PayPal,
    private toastController: ToastController,
    private fulfillmentService: FulfillmentService,
    private mrpService: MrpService) {
      this.newPayment = new Payment();
      this.mrpToFulfill = new MaterialResourcePosting();
    }

  ngOnInit() {
    this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
    this.mrpService.getMrp(this.mrpId).subscribe(
      response => {
        this.mrpToFulfill = response;
        this.maxQuantity = this.fulfillmentToUpdate.totalPledgedQuantity + this.mrpToFulfill.lackingQuantity;
      }
    )
  }

  updatePaymentAmount() {
    this.paymentAmount = this.fulfillmentToUpdate.priceOffered * this.newTotalPledgedQuantity;
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

    } else {
      this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
      if (this.fulfillmentToUpdate.totalPledgedQuantity == this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
      } else if(this.fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED && this.fulfillmentToUpdate.totalPledgedQuantity > this.fulfillmentToUpdate.receivedQuantity) {
        this.fulfillmentToUpdate.status = FulfillmentStatus.PARTIALLYFULFILLED;
      }
      this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate, null).subscribe(
        response => {
          this.toast(true, "New pledged quantity is updated successfully");
          this.dismiss();
        }
      )
    }
  }

  payWithPaypal() {
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration()).then(() => {
        let payment = new PayPalPayment(this.paymentAmount.toString(), 'USD', 'Payment for ' + this.mrpToFulfill.name, 'sale');

        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          this.newPayment = new Payment();
          this.newPayment.dueDate = null;
          this.newPayment.previousDueDate = null;
          this.newPayment.paypalOrderId = res.response.id;
          this.newPayment.amount = this.paymentAmount;
          this.newPayment.status = PaymentStatus.COMPLETED;
          this.newPayment.isLast = true;

          console.log(this.newPayment);
          this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
          this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
          this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate, this.newPayment).subscribe(
            async response => {
              this.dismiss();
              const toast = await this.toastController.create({
                message: 'Payment for ' + this.mrpToFulfill.name + ' is successful',
                color: "success",
                duration: 3500
              })
              toast.present();
            }
          )
          // Successfully paid
        }, (err) => {
          // Error or render dialog closed without being successful
          console.log("Error or render dialog closed without being successful");
          console.log(err);
          this.paypalError();
        });
      }, (err) => {
        // Error in configuration
        console.log("Error in configuration")
        console.log(err);
      });
    }, (err) => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log("Error in initialization, maybe PayPal isn't supported or something else")
      console.log(err);
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async toast(success: boolean, body: string) {
    if (success) {
      const toast = await this.toastController.create({
        message: body,
        color: 'success',
        duration: 3500
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: body,
        color: 'warning',
        duration: 3500
      });
      toast.present();
    } 
  }

  async paypalError() {
    const toast = await this.toastController.create({
      message: 'Payment unsuccessful',
      color: "danger",
      duration: 3000
    });
    toast.present();
  }

  get mraType(): typeof MraType {
    return MraType;
  }
  
  roundToTwoDecimal(amount) {
    return Math.round(amount * 100)/100;
  }

}
