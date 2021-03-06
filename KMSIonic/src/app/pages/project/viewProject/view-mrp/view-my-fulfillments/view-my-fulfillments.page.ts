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
import { MraType } from 'src/app/enum/mra-type.enum';
import { UpdateFulfillmentModalPage } from '../update-fulfillment-modal/update-fulfillment-modal.page';

@Component({
  selector: 'app-view-my-fulfillments',
  templateUrl: './view-my-fulfillments.page.html',
  styleUrls: ['./view-my-fulfillments.page.scss'],
})
export class ViewMyFulfillmentsPage implements OnInit {

  loggedInUser: User;
  projectId: number;

  fulfillmentList: Fulfillment[];
  filteredList: Fulfillment[];
  searchInput: string;
  statusSelected: [];

  constructor(private projectService: ProjectService,
    private fulfillmentService: FulfillmentService,
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController) {
      this.fulfillmentList = [];
      this.filteredList = [];
      this.statusSelected = [];
     }

  ngOnInit() {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.loggedInUser = user;  
        this.refreshFulfillments(this.loggedInUser.userId, this.projectId);
      }
    );
  }

  refreshFulfillments(userId: number, projectId: number) {
    this.fulfillmentService.getListOfFulfillmentsByUserAndProject(userId, projectId).subscribe(
      response => {
        this.fulfillmentList = response;
        this.filter();
      }
    ); 
  }

  filter() {
    this.filteredList = this.fulfillmentList;

    if (this.searchInput && this.searchInput != "") {
      this.filteredList = this.fulfillmentList.filter(
        (fulfillment: Fulfillment) => {
          if (fulfillment.posting.description) {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.posting.name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.posting.description.toLowerCase().includes(this.searchInput.toLowerCase());
          } else {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.posting.name.toLowerCase().includes(this.searchInput.toLowerCase());
          }
        }
      )
    }

    var statusSelectedEnums: FulfillmentStatus[] = [];
    this.statusSelected.forEach(
      (status: string) => {
        statusSelectedEnums.push(FulfillmentStatus[status]);
      }
    )
    if (statusSelectedEnums.length != 0 && statusSelectedEnums.length != 7) {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
        return statusSelectedEnums.indexOf(fulfillment.status) > -1;
      });
    }
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    return url;
  }

  get mraType(): typeof MraType {
    return MraType;
  }

  get fulfillmentStatus(): typeof FulfillmentStatus{
    return FulfillmentStatus;
  }

  async clickUpdate(fulfillmentToUpdate: Fulfillment) {
    if (fulfillmentToUpdate.status != FulfillmentStatus.PLEDGED) {
      this.toast(false, "Only pledged fulfillments can be updated");
    } else {
      const modal = await this.modalController.create({
        component: UpdateFulfillmentModalPage,
        cssClass: 'manage-fulfillment-modal',
        showBackdrop: true,
        swipeToClose: true,
        componentProps: {
          fulfillmentToUpdate: fulfillmentToUpdate
        }
      });
      modal.present();
      modal.onDidDismiss().then(() => {
        this.refreshFulfillments(this.loggedInUser.userId, this.projectId);
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
        this.refreshFulfillments(this.loggedInUser.userId, this.projectId);
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
        color: 'success',
        duration: 3500
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: body,
        color: 'warning',
        duration: 3500
      });
      toast.present();
    } 
  }

}
