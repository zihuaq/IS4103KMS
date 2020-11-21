import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Donation } from 'src/app/classes/donation';
import { DonationService } from 'src/app/donation.service';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { Project } from 'src/app/classes/project';

declare let paypal: any;
declare let $: any;

@Component({
  selector: 'app-donate-to-project',
  templateUrl: './donate-to-project.component.html',
  styleUrls: ['./donate-to-project.component.css']
})
export class DonateToProjectComponent implements OnInit {

  addScript: boolean = false;
  projectId: number;
  projectToDonate: Project;

  newDonation: Donation;
  donationAmount: number;

  constructor(private donationService: DonationService,
    private projectService: ProjectService,
    private sessionService: SessionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.newDonation = new Donation();
      this.projectToDonate = new Project();
    }

  ngOnInit(): void {
    this.checkAccessRight();
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToDonate = response;
        if(!this.addScript) {
          this.addPaypalScript().then(() => {
            paypal.Buttons(this.paypalConfig).render('#paypal-checkout-btn');
          })
        }
      }, 
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        })
        this.router.navigate(["/error"]);
      }
    )
  }

  paypalConfig = {

    style: {
      shape:  'pill',
      label:  'pay',
      height: 50
    },

    createOrder: (data, actions) => {
      if (this.donationAmount == undefined || this.donationAmount == 0) {
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Invalid Donation Amount',
          autohide: true,
          delay: 4000,
          body: 'Please enter a valid donation amount',
        });
      } else if (this.donationAmount > (this.projectToDonate.monetaryFundingRequired - this.projectToDonate.monetaryFundingObtained)) {
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Invalid Donation Amount',
          autohide: true,
          delay: 4000,
          body: 'Please enter a donation amount less than project\'s funding needed',
        });
      } else {
        return actions.order.create({
          purchase_units: [{
            amount: {
              //currency_code: this.selectedCurrency,
              value: this.donationAmount
            }
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

        this.donationService.createNewDonation(this.newDonation, this.sessionService.getCurrentUser().userId, this.projectId).subscribe(
          response => {
            console.log(this.newDonation);
            this.donationAmount = null;
            this.projectService.getProjectById(this.projectId).subscribe(
              response => {
                this.projectToDonate = response;
              }, 
              error => {
                $(document).Toasts('create', {
                  class: 'bg-danger',
                  title: 'Error',
                  autohide: true,
                  delay: 2500,
                  body: error,
                })
                this.router.navigate(["/error"]);
              }
            )
            $(document).Toasts('create', {
              class: 'bg-success',
              title: 'Donation Successful',
              autohide: true,
              delay: 3000,
              body: 'Thank you for your donation, ' + details.payer.name.given_name + " " + details.payer.name.surname + '!',
            });
          }
        )
      });
    },

    onError: (err) => {
      if (this.donationAmount != undefined && this.donationAmount != 0 && this.donationAmount <= (this.projectToDonate.monetaryFundingRequired - this.projectToDonate.monetaryFundingObtained)) {
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Donation Unsuccessful',
          autohide: true,
          delay: 4000,
          body: 'An error occurred during donation',
        });
        console.log(err);
      }
      
    }
  };

  addPaypalScript() { //adding script to html page once loaded
    this.addScript = true;
    return new Promise((resolve, reject) => {
      let scripttagElement = document.createElement('script'); //<script src=""></script>
      scripttagElement.src = 'https://www.paypal.com/sdk/js?client-id=AUYlN1aHUFhSZ6teqyLKngzQ9-bpmRoHAa1CQB1Lsp9oZwKEQ20z7yfzuKi95nRrpTG7CsJwC_p2FVTm&merchant-id=' + this.projectToDonate.paypalMerchantId;
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
