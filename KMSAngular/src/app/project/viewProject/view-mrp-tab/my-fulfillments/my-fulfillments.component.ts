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
  fulfilled: boolean = false;
  rejected: boolean = false;

  constructor(private projectService: ProjectService,
    private sessionService: SessionService,
    private fulfillmentService: FulfillmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.fulfillmentToUpdate = new Fulfillment();
      this.fulfillmentToUpdate.posting = new MaterialResourcePosting();
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
          return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase())
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
    if (this.fulfilled == true) {
      statusSelected.push(FulfillmentStatus.FULFILLED);
    }
    if (this.rejected == true) {
      statusSelected.push(FulfillmentStatus.REJECTED);
    }
    if (statusSelected.length != 0 && statusSelected.length != 5) {
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
    this.fulfillmentToUpdate = fulfillment;
    if (this.fulfillmentToUpdate.status == FulfillmentStatus.ACCEPTED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Accepted fulfillments cannot be updated',
      });
    } else if (this.fulfillmentToUpdate.status == FulfillmentStatus.PARTIALLYFULFILLED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Ongoing fulfillments cannot be updated',
      });
    } else if (this.fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Completed fulfillments cannot be updated',
      });
    } else if (this.fulfillmentToUpdate.status == FulfillmentStatus.REJECTED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Rejected fulfillments cannot be updated',
      });
    } else {
      this.maxQuantity = Math.max((this.fulfillmentToUpdate.totalPledgedQuantity + this.fulfillmentToUpdate.posting.lackingQuantity), (this.fulfillmentToUpdate.totalPledgedQuantity + this.fulfillmentToUpdate.mra.quantity));
      this.newTotalPledgedQuantity = this.fulfillmentToUpdate.totalPledgedQuantity;
      $('#modal-update').modal('show');
    }
  }

  updateQuantity() {
    if(this.newTotalPledgedQuantity == null){
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3200,
        body: 'Total pledged quantity is required',
      });
    } else if(!(this.newTotalPledgedQuantity > 0)){
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
    } else if(this.newTotalPledgedQuantity > (this.fulfillmentToUpdate.mra.quantity + this.fulfillmentToUpdate.totalPledgedQuantity)) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Invalid Quantity',
        autohide: true,
        delay: 3500,
        body: 'Total pledged quantity cannot be more than your available quantity',
      });
    } else {
      this.fulfillmentToUpdate.totalPledgedQuantity = this.newTotalPledgedQuantity;
      this.fulfillmentService.updateQuantity(this.fulfillmentToUpdate).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Total pledged quantity of fulfillment is updated successfully',
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

}
