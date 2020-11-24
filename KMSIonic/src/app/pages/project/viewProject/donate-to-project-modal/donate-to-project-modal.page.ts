import { Component, Input, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { Platform, ToastController, ModalController } from '@ionic/angular';
import { Donation } from 'src/app/classes/donation';
import { Project } from 'src/app/classes/project';
import { User } from 'src/app/classes/user';
import { DonationService } from 'src/app/services/donation.service';

declare let paypal: any;

@Component({
  selector: 'app-donate-to-project-modal',
  templateUrl: './donate-to-project-modal.page.html',
  styleUrls: ['./donate-to-project-modal.page.scss'],
})
export class DonateToProjectModalPage implements OnInit {

  @Input() loggedInUser: User;
  @Input() project: Project;

  addScript: boolean = false;
  isHybrid: boolean;
  donationAmount: number;
  newDonation: Donation;

  constructor(private platform: Platform,
    private payPal: PayPal,
    private toastController: ToastController,
    private modalController: ModalController,
    private donationService: DonationService) {
    this.newDonation = new Donation();
   }

  ngOnInit() {
    if (this.platform.is("hybrid")) {
      this.isHybrid = true;
    } else {
      this.isHybrid = false;
    }
    //console.log("isHybrid: ", this.isHybrid);
    //console.log(this.project);
    if(!this.isHybrid && !this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Buttons(this.paypalConfig).render('#paypal-checkout-btn');
      })
    }

  }

  paypalConfig = {

    style: {
      shape:  'rect',
      label:  'pay',
    },

    createOrder: (data, actions) => {
      if (this.checkAmountValid()) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.donationAmount
            },
            description: 'Donation to ' + this.project.name
          }]
        });
      }
      
    },
    onApprove: (data, actions) =>  {
      return actions.order.capture().then((details) => {
        this.newDonation.paypalOrderId = details.id;
        this.newDonation.dateDonated = new Date(details.create_time);
        this.newDonation.amount = details.purchase_units[0].amount.value;
        console.log(details);

        this.donationService.createNewDonation(this.newDonation, this.loggedInUser.userId, this.project.projectId).subscribe(
          async response => {
            console.log(this.newDonation);
            this.dismiss();
            const toast = await this.toastController.create({
              message: 'Thank you for your donation, ' + details.payer.name.given_name + " " + details.payer.name.surname + '!',
              color: "success",
              duration: 3000
            });
            toast.present();
          }
        )
      });
    },

    onError: async (err) => {
      if (this.donationAmount != undefined && this.donationAmount != 0 && this.donationAmount <= (this.project.monetaryFundingRequired - this.project.monetaryFundingObtained)) {
        const toast = await this.toastController.create({
          message: 'An error occurred during donation',
          color: "danger",
          duration: 4000
        });
        toast.present();
        console.log(err);
      }  
    }
  };

  addPaypalScript() { //adding script to html page once loaded
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script'); //<script src=""></script>
      scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm&merchant-id=' + this.project.paypalEmail;
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement); 
    })
  }

  async checkAmountValid() {
    //console.log(this.donationAmount);
    if (this.donationAmount == undefined || this.donationAmount == 0) {
      const toast = await this.toastController.create({
        message: 'Please enter a valid donation amount',
        color: "danger",
        duration: 4000
      });
      toast.present();
      return false;
    } else if (this.donationAmount > (this.project.monetaryFundingRequired - this.project.monetaryFundingObtained)) {
      const toast = await this.toastController.create({
        message: 'Please enter a donation amount less than project\'s funding needed',
        color: "danger",
        duration: 4000
      });
      toast.present();
      return false;
    } else {
      return true;
    }
  }

  payWithPaypal() {
    console.log("Pay with PayPal in Mobile Device");
    if (this.checkAmountValid()) {
      this.payPal.init({
        PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
        PayPalEnvironmentSandbox: 'AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm'
      }).then(() => {
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration()).then(() => {
          let payment = new PayPalPayment(this.donationAmount.toString(), 'USD', 'Donation to ' + this.project.name, 'sale');
          payment.payeeEmail = this.project.paypalEmail;

          this.payPal.renderSinglePaymentUI(payment).then((res) => {
            console.log(res);
            this.newDonation.paypalOrderId = res.response.id;
            this.newDonation.dateDonated = new Date(res.response.create_time);
            this.newDonation.amount = this.donationAmount;

            this.donationService.createNewDonation(this.newDonation, this.loggedInUser.userId, this.project.projectId).subscribe(
              async response => {
                console.log(this.newDonation);
                this.dismiss();
                const toast = await this.toastController.create({
                  message: 'Thank you for your donation, ' + this.loggedInUser.firstName + " " + this.loggedInUser.lastName + '!',
                  color: 'success',
                  duration: 3000
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
  }

  async paypalError() {
    const toast = await this.toastController.create({
      message: 'An error occurred during donation',
      color: "danger",
      duration: 4000
    });
    toast.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
