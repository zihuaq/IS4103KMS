import { Component, OnInit, AfterViewChecked } from '@angular/core';

declare let paypal: any;

@Component({
  selector: 'app-donate-to-platform',
  templateUrl: './donate-to-platform.component.html',
  styleUrls: ['./donate-to-platform.component.css']
})
export class DonateToPlatformComponent implements OnInit, AfterViewChecked {

  constructor() { }

  ngOnInit(): void {
  }

  addScript: boolean = false;

  donationAmount: number = 1;

  paypalConfig = {

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
        //Console.log('Pay)
        //Redirect user after successful transaction
      });
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

}
