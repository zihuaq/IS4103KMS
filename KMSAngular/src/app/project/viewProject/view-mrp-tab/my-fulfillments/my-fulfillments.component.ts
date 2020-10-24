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
  noFulfillment: boolean = false;
  fulfillmentToDelete: Fulfillment;

  constructor(private projectService: ProjectService,
    private sessionService: SessionService,
    private fulfillmentService: FulfillmentService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
      }, 
    );

    this.fulfillmentService.getListOfFulfillmentsByUserAndProject(this.loggedInUser.userId, this.projectId).subscribe(
      response => {
        this.fulfillmentList = response;
        if(this.fulfillmentList.length == 0) {
          this.noFulfillment = true;
        }
      }
    );
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

  get fulfillmentStatus(): typeof FulfillmentStatus{
    return FulfillmentStatus;
  }

  clickDelete(fulfillment: Fulfillment) {
    this.fulfillmentToDelete = fulfillment;
    if (this.fulfillmentToDelete.status == FulfillmentStatus.PARTIALLYFULFILLED) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 3500,
        body: 'Ongoing fulfillments cannot be deleted',
      });
    } else if (this.fulfillmentToDelete.status == FulfillmentStatus.FULFILLED) {
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
    this.fulfillmentService.deleteFulfillment(this.fulfillmentToDelete.fulfillmentId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Fulfillment deleted successfully',
        });
        this.fulfillmentService.getListOfFulfillmentsByUserAndProject(this.loggedInUser.userId, this.projectId).subscribe(
          response => {
            this.fulfillmentList = response;
            if(this.fulfillmentList.length == 0) {
              this.noFulfillment = true;
            }
          }
        );
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
