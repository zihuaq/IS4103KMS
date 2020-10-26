import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { Project } from 'src/app/classes/project';
import { User } from 'src/app/classes/user';
import { FulfillmentService } from 'src/app/services/fulfillment.service';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-my-fulfillments',
  templateUrl: './view-my-fulfillments.page.html',
  styleUrls: ['./view-my-fulfillments.page.scss'],
})
export class ViewMyFulfillmentsPage implements OnInit {

  loggedInUser: User;
  projectId: number;

  fulfillmentList: Fulfillment[];

  constructor(private projectService: ProjectService,
    private fulfillmentService: FulfillmentService,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController) {
      this.fulfillmentList = [];
     }

  ngOnInit() {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.loggedInUser = user;  
        this.fulfillmentService.getListOfFulfillmentsByUserAndProject(this.loggedInUser.userId, this.projectId).subscribe(
          response => {
            this.fulfillmentList = response;
          }
        );    
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

  async clickDelete(fulfillment: Fulfillment) {
    if (fulfillment.status == FulfillmentStatus.PARTIALLYFULFILLED || fulfillment.status == FulfillmentStatus.FULFILLED) {
      this.toast(false, "Ongoing fulfillments cannot be deleted");
    } else {
      const alert = await this.alertController.create({
        header: 'Delete Fulfillment?',
        message: 'This action cannot be undone',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Confirm',
            handler: () => {
              this.deleteFulfillment(fulfillment.fulfillmentId);
            }
          }
        ]
      });
      await alert.present();
    }
  }

  deleteFulfillment(fulfillmentId: number) {
    this.fulfillmentService.deleteFulfillment(fulfillmentId).subscribe(
      response => {
        this.toast(true, "Fulfillment is deleted successfully");
        this.fulfillmentService.getListOfFulfillmentsByUserAndProject(this.loggedInUser.userId, this.projectId).subscribe(
          response => {
            this.fulfillmentList = response;
          }
        );
      },
      error => {
        this.toast(false, error);
      }
    )
  }

  async toast(success: boolean, body: string) {
    if (success) {
      const toast = await this.toastController.create({
        message: body,
        duration: 3500
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: body,
        color: 'danger',
        duration: 3500
      });
      toast.present();
    }
    
  }

}
