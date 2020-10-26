import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fulfillment } from 'src/app/classes/fulfillment';
import { Project } from 'src/app/classes/project';
import { User } from 'src/app/classes/user';
import { FulfillmentService } from 'src/app/services/fulfillment.service';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { UpdateQuantityModalPage } from '../../../editProject/manage-fulfillments-modal/update-quantity-modal/update-quantity-modal.page';

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
    private modalController: ModalController,
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

  async clickUpdate(fulfillmentToUpdate: Fulfillment) {
    if (fulfillmentToUpdate.status == FulfillmentStatus.ACCEPTED) {
      this.toast(false, "Accepted fulfillments cannot be updated");
    } else if (fulfillmentToUpdate.status == FulfillmentStatus.PARTIALLYFULFILLED) {
      this.toast(false, "Ongoing fulfillments cannot be updated");
    } else if (fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED) {
      this.toast(false, "Completed fulfillments cannot be updated");
    } else if (fulfillmentToUpdate.status == FulfillmentStatus.REJECTED) {
      this.toast(false, "Rejected fulfillments cannot be updated");
    } else {
      const modal = await this.modalController.create({
        component: UpdateQuantityModalPage,
        cssClass: 'manage-fulfillment-modal',
        showBackdrop: true,
        swipeToClose: true,
        componentProps: {
          mrpId: fulfillmentToUpdate.posting.materialResourcePostingId,
          fulfillmentToUpdate: fulfillmentToUpdate,
          byUser: true
        }
      });
      modal.present();
      modal.onDidDismiss().then(() => {
        this.fulfillmentService.getListOfFulfillmentsByUserAndProject(this.loggedInUser.userId, this.projectId).subscribe(
          response => {
            this.fulfillmentList = response;
          }
        );
      });
    }
  }

  async clickDelete(fulfillment: Fulfillment) {
    if (fulfillment.status == FulfillmentStatus.PARTIALLYFULFILLED) {
      this.toast(false, "Ongoing fulfillments cannot be deleted");
    } else if (fulfillment.status == FulfillmentStatus.FULFILLED) {
      this.toast(false, "Completed fulfillments cannot be deleted");
    } else {
      const alert = await this.alertController.create({
        header: 'Confirm Delete Fulfillment?',
        message: 'This action cannot be undone',
        cssClass: 'rejectAlertCss',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'reject-button'
          }, {
            text: 'Delete',
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
