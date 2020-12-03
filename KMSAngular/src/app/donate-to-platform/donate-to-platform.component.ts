import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Donation } from '../classes/donation';
import { SessionService } from '../session.service';
import { DonationService } from '../donation.service';

declare let paypal: any;
declare let $: any;
declare let require: any;

@Component({
  selector: 'app-donate-to-platform',
  templateUrl: './donate-to-platform.component.html',
  styleUrls: ['./donate-to-platform.component.css']
})
export class DonateToPlatformComponent implements OnInit, AfterViewChecked {

  addScript: boolean = false;

  newDonation: Donation;
  selectedCurrency: string = "USD";
  currencySymbol: string = "$";
  donationAmount: number;
  noDecimal: boolean = false;

  constructor(private donationService: DonationService,
    private sessionService: SessionService,
    private router: Router) {
      this.newDonation = new Donation();
    }

  ngOnInit(): void {
    this.checkAccessRight();
 
    //var cc = require('currency-codes');
    // var cc = [
    //   {id: 'AUD', text: 'Australian Dollar (AUD)'},
    //   {id: 'BRL', text: 'Brazilian Real (BRL)'},
    //   {id: 'CAD', text: 'Canadian Dollar (CAD)'},
    //   {id: 'CNY', text: 'Chinese Renmenbi (CNY)'},
    //   {id: 'CZK', text: 'Czech Koruna (CZK)'},
    //   {id: 'DKK', text: 'Danish Krone (DKK)'},
    //   {id: 'EUR', text: 'Euro (EUR)'},
    //   {id: 'HKD', text: 'Hong Kong Dollar (HKD)'},
    //   {id: 'HUF', text: 'Hungarian Forint (HUF)'},
    //   {id: 'INR', text: 'Indian Rupee (INR)'},
    //   {id: 'ILS', text: 'Israeli New Shekel (ILS)'},
    //   {id: 'JPY', text: 'Japanese Yen (JPY)'},
    //   {id: 'MYR', text: 'Malaysian Ringgit (MYR)'},
    //   {id: 'MXN', text: 'Mexican Peso (MXN)'},
    //   {id: 'TWD', text: 'New Taiwan Dollar (TWD)'},
    //   {id: 'NZD', text: 'New Zealand Dollar (NZD)'},
    //   {id: 'NOK', text: 'Norwegian Krone (NOK)'},
    //   {id: 'PHP', text: 'Philippine Peso (PHP)'},
    //   {id: 'PLN', text: 'Polish Złoty (PLN)'},
    //   {id: 'GBP', text: 'Pound Sterling (GBP)'},
    //   {id: 'RUB', text: 'Russian Ruble (RUB)'},
    //   {id: 'SGD', text: 'Singapore Dollar (SGD)'},
    //   {id: 'SEK', text: 'Swedish Krona (SEK)'},
    //   {id: 'CHF', text: 'Swiss Franc (CHF)'},
    //   {id: 'THB', text: 'Thai Baht (THB)'},
    //   {id: 'USD', text: 'United States Dollar (USD)'},
    // ];
    // $('.ccselect2').select2({
    //   data: cc,
    //   allowClear: true,
    //   theme: "classic"
    // });
    // $('.ccselect2').val(this.selectedCurrency).trigger('change');

    // $('.ccselect2').on('select2:select', () => {
    //   this.selectedCurrency = $('.ccselect2').val();
    //   console.log(this.selectedCurrency);
    //   this.addPaypalScript().then(() => {
    //     paypal.Buttons(this.paypalConfig).render('#paypal-checkout-btn');
    //   });
    //   var getSymbolFromCurrency = require('currency-symbol-map')
    //   this.currencySymbol = getSymbolFromCurrency(this.selectedCurrency);
    //   if(this.selectedCurrency == "HUF" || this.selectedCurrency == "JPY" || this.selectedCurrency == "TWD") {
    //     this.noDecimal = true;
    //   } else {
    //     this.noDecimal = false;
    //   }
    // });
  }

  paypalConfig = {

    style: {
      shape:  'pill',
      label:  'pay',
      height: 50
    },

    createOrder: (data, actions) => {
      if (this.donationAmount == undefined) {
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Empty Donation Amount',
          autohide: true,
          delay: 4000,
          body: 'Please enter your donation amount',
        });
      } else if (this.donationAmount <= 0) {
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Invalid Donation Amount',
          autohide: true,
          delay: 4000,
          body: 'Please enter a donation amount more than $0',
        });
      } else {
        return actions.order.create({
          purchase_units: [{
            amount: {
              //currency_code: this.selectedCurrency,
              value: this.donationAmount
            },
            description: 'Donation to KMS Platform'
          }]
        });
      }
      
    },
    onApprove: (data, actions) =>  {
      return actions.order.capture().then((details) => {
        //alert('Transaction completed by ' + details.payer.name.given_name + '!');
        //console.log("Amount(Capture):" + details.purchase_units[0].payments.captures[0].amount.value);
        this.newDonation.paypalOrderId = details.id;
        this.newDonation.dateDonated = new Date(details.create_time);
        this.newDonation.amount = details.purchase_units[0].amount.value;
        //this.newDonation.currency = details.purchase_units[0].amount.currency_code;
        console.log(details);
        //console.log(details.purchase_units[0].payments.captures)
        //console.log("Seller Receivable Breakdown:" + details.purchase_units[0].payments.captures[0].seller_receivable_breakdown);
        //console.log("Currency(Net):" + details.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.currency_code);
        //console.log("Currency(Receivable):" + details.purchase_units[0].payments.captures[0].seller_receivable_breakdown.receivable_amount.currency_code);

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
      // $(document).Toasts('create', {
      //   class: 'bg-warning',
      //   title: 'Unsupported Currency',
      //   autohide: true,
      //   delay: 4000,
      //   body: 'Selected currency is not accepted by the platform\'s PayPal account',
      // });
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Donation Unsuccessful',
        autohide: true,
        delay: 4000,
        body: 'An error occurred during donation',
      });
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
      scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm';
      //scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm&currency=' + this.selectedCurrency;
      scripttagElement.onload = resolve;
      document.body.appendChild(scripttagElement); 
    })
  }

  onSelect() {
    this.addPaypalScript().then(() => {
      paypal.Buttons(this.paypalConfig).render('#paypal-checkout-btn');
    })
  }

  checkAccessRight() {
    console.log(this.sessionService.getIsLogin);
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
