import { Component, Input, OnInit } from '@angular/core';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { ModalController, ToastController } from '@ionic/angular';
import { FulfillmentService } from '../../../../../services/fulfillment.service';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { PayPal, PayPalConfiguration, PayPalPayment } from '@ionic-native/paypal/ngx';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { Payment } from 'src/app/classes/payment';
import { PaymentStatus } from 'src/app/enum/payment-status.enum';
import { MraType } from 'src/app/enum/mra-type.enum';

@Component({
  selector: 'app-receive-resource-modal',
  templateUrl: './receive-resource-modal.page.html',
  styleUrls: ['./receive-resource-modal.page.scss'],
})
export class ReceiveResourceModalPage implements OnInit {

  @Input() fulfillmentToUpdate: Fulfillment;
  @Input() mrp: MaterialResourcePosting;

  quantityReceived: number;
  paymentAmount: number;
  newPayment: Payment;

  constructor(public modalController: ModalController,
    private payPal: PayPal,
    private toastController: ToastController,
    private fulfillmentService: FulfillmentService) {
      this.newPayment = new Payment();
    }

  ngOnInit() {
    this.paymentAmount = this.fulfillmentToUpdate.priceOffered * this.fulfillmentToUpdate.totalPledgedQuantity;
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
    } else if (this.quantityReceived > this.fulfillmentToUpdate.unreceivedQuantity) {
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
            message: "Quantity received is updated successfully",
            color: "success",
            duration: 3500
          })
          toast.present();
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
        let payment = new PayPalPayment(this.paymentAmount.toString(), 'USD', 'Payment for ' + this.mrp.name, 'sale');

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
          this.fulfillmentToUpdate.receivedQuantity += this.quantityReceived;
          this.fulfillmentToUpdate.unreceivedQuantity = 0;
          this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
          this.fulfillmentService.receiveResource(this.fulfillmentToUpdate, this.newPayment).subscribe(
            async response => {
              this.dismiss();
              const toast = await this.toastController.create({
                message: 'Payment for ' + this.mrp.name + ' is successful',
                color: "success",
                duration: 3500
              });
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
