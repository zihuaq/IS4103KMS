import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Donation } from '../classes/donation';
import { SessionService } from '../session.service';
import { DonationService } from '../donation.service';

declare let paypal: any;
declare let $: any;

@Component({
  selector: 'app-donate-to-platform',
  templateUrl: './donate-to-platform.component.html',
  styleUrls: ['./donate-to-platform.component.css']
})
export class DonateToPlatformComponent implements OnInit, AfterViewChecked {

  newDonation: Donation;

  constructor(private donationService: DonationService,
    private sessionService: SessionService,
    private router: Router) {
      this.newDonation = new Donation();
     }

  ngOnInit(): void {
    this.checkAccessRight();
  }

  addScript: boolean = false;

  donationAmount: number;

  paypalConfig = {

    style: {
      shape:  'pill',
      label:  'pay',
      height: 50
    },

    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: this.donationAmount
          }
        }]
      });
    },
    onApprove: (data, actions) =>  {
      return actions.order.capture().then((details) => {
        //alert('Transaction completed by ' + details.payer.name.given_name + '!');
        //console.log("Amount(Capture):" + details.purchase_units[0].payments.captures[0].amount.value);
        this.newDonation.paypalOrderId = details.id;
        this.newDonation.dateDonated = new Date(details.create_time);
        this.newDonation.amount = details.purchase_units[0].amount.value;
        this.newDonation.currency = details.purchase_units[0].amount.currency_code;

        this.donationService.createNewDonation(this.newDonation, this.sessionService.getCurrentUser().userId, null).subscribe(
          response => {
            console.log(this.newDonation);
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Donation Successful',
              autohide: true,
              delay: 3000,
              body: 'Thank you for your donation, ' + details.payer.name.given_name + " " + details.payer.name.surname + '!',
            });
          }
        )
        //Actions taken after successful transaction
      });
    },

    onError: (err) => {
      console.log(err);
    }
  };
  
  ngAfterViewChecked(): void {
    if(!this.addScript) {
      this.addPaypalScript().then(() => {
        paypal.Buttons(this.paypalConfig).render('#paypal-checkout-btn');
      })
    }
  }

  addPaypalScript() { //adding script to html page once loaded
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script'); //<script src=""></script>
      scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm&currency=SGD';
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement); 
    })
  }

  checkAccessRight() {
    console.log(this.sessionService.getIsLogin);
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
