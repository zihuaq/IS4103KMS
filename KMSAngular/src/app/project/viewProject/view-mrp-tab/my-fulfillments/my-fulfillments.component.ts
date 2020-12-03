import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';
import { Project } from '../../../../classes/project';
import { User } from '../../../../classes/user';
import { FulfillmentService } from '../../../../fulfillment.service';
import { Fulfillment } from '../../../../classes/fulfillment';
import { FulfillmentStatus } from 'src/app/classes/fulfillment-status.enum';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { MraType } from 'src/app/classes/mra-type.enum';
import { NgForm } from '@angular/forms';
import { MaterialResourceAvailable } from 'src/app/classes/material-resource-available';
import { PaymentBasis } from 'src/app/classes/payment-basis.enum';

declare var $: any;

@Component({
  selector: 'app-my-fulfillments',
  templateUrl: './my-fulfillments.component.html',
  styleUrls: ['./my-fulfillments.component.css']
})
export class MyFulfillmentsComponent implements OnInit {

  loggedInUser: User;
  project: Project;
  projectId: number;

  fulfillmentList: Fulfillment[];
  filteredList: Fulfillment[];
  noFulfillment: boolean = false;
  fulfillmentToUpdate: Fulfillment;
  maxQuantity: number;
  newTotalPledgedQuantity: number;

  searchInput: string;
  pledged: boolean = false;
  accepted: boolean = false;
  partiallyfulfilled: boolean = false;
  ongoing: boolean = false;
  ended: boolean = false;
  fulfilled: boolean = false;
  rejected: boolean = false;

  constructor(private projectService: ProjectService,
    private sessionService: SessionService,
    private fulfillmentService: FulfillmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.fulfillmentToUpdate = new Fulfillment();
      this.fulfillmentToUpdate.posting = new MaterialResourcePosting();
      this.fulfillmentToUpdate.mra = new MaterialResourceAvailable();
     }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
      }, 
    );

    this.refreshFulfillments(this.loggedInUser.userId, this.projectId);
  }

  refreshFulfillments(userId: number, projectId: number) {
    this.fulfillmentService.getListOfFulfillmentsByUserAndProject(userId, projectId).subscribe(
      response => {
        this.fulfillmentList = response;
        if(this.fulfillmentList.length == 0) {
          this.noFulfillment = true;
        }
        this.filter();
      }
    );
  }
  
  filter() {
    this.filteredList = this.fulfillmentList;
    if (this.searchInput && this.searchInput != "") {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
          if (fulfillment.posting.description) {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.posting.name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.posting.description.toLowerCase().includes(this.searchInput.toLowerCase());
          } else {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.posting.name.toLowerCase().includes(this.searchInput.toLowerCase());
          }
        }
      )
    }
    var statusSelected = [];
    if (this.pledged == true) {
      statusSelected.push(FulfillmentStatus.PLEDGED);
    }
    if (this.accepted == true) {
      statusSelected.push(FulfillmentStatus.ACCEPTED);
    }
    if (this.partiallyfulfilled == true) {
      statusSelected.push(FulfillmentStatus.PARTIALLYFULFILLED);
    }
    if (this.ongoing == true) {
      statusSelected.push(FulfillmentStatus.ONGOING);
    }
    if (this.ended == true) {
      statusSelected.push(FulfillmentStatus.ENDED);
    }
    if (this.fulfilled == true) {
      statusSelected.push(FulfillmentStatus.FULFILLED);
    }
    if (this.rejected == true) {
      statusSelected.push(FulfillmentStatus.REJECTED);
    }
    if (statusSelected.length != 0 && statusSelected.length != 7) {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
        return statusSelected.indexOf(fulfillment.status) > -1;
      });
    }
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  get fulfillmentStatus(): typeof FulfillmentStatus{
    return FulfillmentStatus;
  }

  clickEdit(fulfillment: Fulfillment) {
    if (fulfillment.status != FulfillmentStatus.PLEDGED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid',
        autohide: true,
        delay: 3500,
        body: 'Only pledged fulfillments can be updated',
      });
    } else {
      this.fulfillmentToUpdate = fulfillment;
      this.maxQuantity = this.fulfillmentToUpdate.totalPledgedQuantity + this.fulfillmentToUpdate.posting.lackingQuantity;
      this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
      $('#modal-update').modal('show');
    }
  }

  updateFulfillment(updateFulfillmentForm: NgForm) {
    if(this.fulfillmentToUpdate.priceOffered <= 0 && this.fulfillmentToUpdate.mra.type != MraType.ONETIMEDONATION){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Invalid Price',
        autohide: true,
        delay: 3200,
        body: 'Price offered is invalid',
      });
    } else if(this.newTotalPledgedQuantity <= 0){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3200,
        body: 'Total pledged quantity is invalid',
      });
    } else if(this.newTotalPledgedQuantity > (this.fulfillmentToUpdate.posting.lackingQuantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3500,
        body: 'Total pledged quantity cannot be more than quantity required',
      });
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
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Fulfillment is updated successfully',
          });
          this.refreshFulfillments(this.loggedInUser.userId, this.projectId);
          $('#updateModalCloseBtn').click();
        }
      )
    }
  }

  clickDelete(fulfillment: Fulfillment) {
    this.fulfillmentToUpdate = fulfillment;
    if (this.fulfillmentToUpdate.status == FulfillmentStatus.ACCEPTED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Accepted fulfillments cannot be deleted',
      });
    } else if (this.fulfillmentToUpdate.status == FulfillmentStatus.PARTIALLYFULFILLED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Ongoing fulfillments cannot be deleted',
      });
    } else if (this.fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Completed fulfillments cannot be deleted',
      });
    } else {
      $('#modal-confirm-delete-fulfillment').modal('show');
    }
  }

  deleteFulfillment() {
    this.fulfillmentService.deleteFulfillment(this.fulfillmentToUpdate.fulfillmentId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Fulfillment deleted successfully',
        });
        this.refreshFulfillments(this.loggedInUser.userId, this.projectId);
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    )
  }

  get mraType(): typeof MraType {
    return MraType;
  }

}
