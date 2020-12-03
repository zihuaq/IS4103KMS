import { Component, Input, OnInit } from '@angular/core';
import { PayPal, PayPalConfiguration, PayPalPayment } from '@ionic-native/paypal/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { Payment } from 'src/app/classes/payment';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { MraType } from 'src/app/enum/mra-type.enum';
import { PaymentStatus } from 'src/app/enum/payment-status.enum';
import { FulfillmentService } from 'src/app/services/fulfillment.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-make-payment-modal',
  templateUrl: './make-payment-modal.page.html',
  styleUrls: ['./make-payment-modal.page.scss'],
})
export class MakePaymentModalPage implements OnInit {

  @Input() fulfillmentToUpdate: Fulfillment;
  @Input() mrp: MaterialResourcePosting;
  @Input() paymentList: Payment[];

  newPayment: Payment;
  hasIsLast: boolean = false;
  outstandingAmount: number = 0.0;
  currentAmount: number = 0.0;
  earliestDate: Date;
  latestDate: Date;
  paymentIds: number[];

  constructor(public modalController: ModalController,
    private payPal: PayPal,
    private toastController: ToastController,
    private fulfillmentService: FulfillmentService,
    private paymentService: PaymentService) {
      this.newPayment = new Payment();
      this.paymentIds = [];
    }

  ngOnInit() {
    this.paymentList.forEach((payment, index) => {
      this.paymentIds.push(payment.paymentId);
      if (payment.isLast) {
        this.hasIsLast = true;
      }
      if (payment.status == PaymentStatus.OUTSTANDING) { //outstanding payments
        this.outstandingAmount += payment.amount;
      } else { //current notdue payment
        this.currentAmount = payment.amount;
      }
      if (index == 0) { //latest date
        this.latestDate = payment.dueDate;
      } else if (this.paymentList.length > 1 && index == this.paymentList.length - 1) { //earliest date if more than one payment
        this.earliestDate = payment.dueDate;
      }
    })
  }

  payWithPaypal() {
    var description: string;
    var lastDate = this.latestDate.toString();
    if (this.earliestDate) {
      var firstDate = this.earliestDate.toString();
      description = "Payment (" + moment(firstDate.slice(0, firstDate.indexOf("["))).format("MMM D, YYYY") + " to " 
        + moment(lastDate.slice(0, lastDate.indexOf("["))).format("MMM D, YYYY")
        + ") for " + this.mrp.name;
    } else {
      description = "Payment (" + moment(lastDate.slice(0, lastDate.indexOf("["))).format("MMM D, YYYY")
        + ") for " + this.mrp.name;
    }
    var value = this.roundToTwoDecimal(this.outstandingAmount * 1.05) + this.currentAmount;

    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm'
    }).then(() => {
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration()).then(() => {
        let payment = new PayPalPayment(value.toString(), 'USD', description, 'sale');

        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);

          if (this.hasIsLast) { //if has last payment
            this.fulfillmentToUpdate.status = FulfillmentStatus.FULFILLED;
          }
          this.paymentService.makePayment(this.fulfillmentToUpdate, this.paymentIds, res.response.id).subscribe(
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
  
  roundToTwoDecimal(amount) {
    return Math.round(amount * 100)/100;
  }

}
