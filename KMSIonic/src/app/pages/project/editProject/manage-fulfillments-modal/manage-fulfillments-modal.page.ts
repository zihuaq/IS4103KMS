import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { FulfillmentService } from '../../../../services/fulfillment.service';
import { Fulfillment } from '../../../../classes/fulfillment';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { ReceiveResourceModalPage } from './receive-resource-modal/receive-resource-modal.page';
import { UpdateQuantityModalPage } from './update-quantity-modal/update-quantity-modal.page';
import { MraType } from 'src/app/enum/mra-type.enum';
import { MrpService } from 'src/app/services/mrp.service';
import { MaterialResourcePosting } from '../../../../../../../KMSAngular/src/app/classes/material-resource-posting';
import { PaymentService } from 'src/app/services/payment.service';
import * as moment from 'moment';
import { Payment } from 'src/app/classes/payment';
import { MakePaymentModalPage } from './make-payment-modal/make-payment-modal.page';

@Component({
  selector: 'app-manage-fulfillments-modal',
  templateUrl: './manage-fulfillments-modal.page.html',
  styleUrls: ['./manage-fulfillments-modal.page.scss'],
})
export class ManageFulfillmentsModalPage implements OnInit {

  @Input() mrpId: number;

  fulfillmentList: Fulfillment[];
  filteredList: Fulfillment[];
  searchInput: string
  statusSelected: [];
  mrp: MaterialResourcePosting;

  constructor(private modalController: ModalController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private fulfillmentService: FulfillmentService,
    private mrpService: MrpService,
    private paymentService: PaymentService) {
      this.fulfillmentList = [];
      this.filteredList = [];
      this.statusSelected = [];
      this.mrp = new MaterialResourcePosting();
     }

  ngOnInit() {
    console.log("ngOnInit");
    this.refreshFulfillments();
  }

  refreshFulfillments() {
    this.fulfillmentService.getFulfillmentsByMrp(this.mrpId).subscribe(
      response => {
        this.fulfillmentList = response;
        var list: Fulfillment[] = [];
        this.fulfillmentList.forEach((element) => {
          if (element.status != FulfillmentStatus.REJECTED) {
            list.push(element);
          }
        });
        this.fulfillmentList = list;
        this.filter();
        console.log(this.fulfillmentList)
      }
    )
    this.mrpService.getMrp(this.mrpId).subscribe(
      response => {
        this.mrp = response;
      }
    )
  }

  filter() {
    this.filteredList = this.fulfillmentList;

    if (this.searchInput && this.searchInput != "") {
      this.filteredList = this.fulfillmentList.filter(
        (fulfillment: Fulfillment) => {
          var name = fulfillment.fulfillmentOwner.firstName + " " + fulfillment.fulfillmentOwner.lastName;
          if (fulfillment.mra.description) {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || name.toLowerCase().includes(this.searchInput.toLowerCase()) || fulfillment.mra.description.toLowerCase().includes(this.searchInput.toLowerCase());
          } else {
            return fulfillment.mra.name.toLowerCase().includes(this.searchInput.toLowerCase()) || name.toLowerCase().includes(this.searchInput.toLowerCase());
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
    if (statusSelectedEnums.length != 0 && statusSelectedEnums.length != 6) {
      this.filteredList = this.filteredList.filter(
        (fulfillment: Fulfillment) => {
        return statusSelectedEnums.indexOf(fulfillment.status) > -1;
      });
    }
  }

  async handleFulfillmentActionSheet(fulfillmentToUpdate: Fulfillment) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Manage Fulfillments',
      buttons: this.buttons(fulfillmentToUpdate)
    });
    await actionSheet.present();
  }

  buttons(fulfillmentToUpdate: Fulfillment) {
    var buttons = [];
    if (fulfillmentToUpdate.status == FulfillmentStatus.PLEDGED) { //pledged
      buttons.push(
        {
          text: 'Accept',
          handler: async () => {
            if ((!moment(new Date()).isBefore(this.mrp.startDate.toString().slice(0,15)))) { //if not before start date
              const toast = await this.toastController.create({
                message: 'Fulfillment cannot be accepted as posting has started',
                color: 'warning',
                duration: 3500
              });
              toast.present();
            } else {
              this.paymentService.getListOfOutstandingPaymentsByProject(this.mrp.project.projectId).subscribe(
                async response => {
                  if (response.length > 0) { //has outstanding payments
                    const toast = await this.toastController.create({
                      message: 'Please complete all outstanding payments before accepting new fulfillments',
                      color: 'warning',
                      duration: 4000
                    });
                    toast.present();
                  } else {
                    this.acceptAlert(fulfillmentToUpdate.fulfillmentId);
                  }
                }
              )
            };
          }
        }, {
          text: 'Reject',
          handler: () => {
            this.rejectAlert(fulfillmentToUpdate.fulfillmentId);
          }
        }
      )
    } else if ((fulfillmentToUpdate.mra.type == MraType.ONETIMEDONATION || fulfillmentToUpdate.mra.type == MraType.ONETIMEPAYMENT) && //One-Time Payment and One-Time Donations
      (fulfillmentToUpdate.status == FulfillmentStatus.ACCEPTED || fulfillmentToUpdate.status == FulfillmentStatus.PARTIALLYFULFILLED)) {
      buttons.push(
        {
          text: 'Receive Resource',
          handler: () => {
            this.receiveResourceModal(fulfillmentToUpdate); 
          }
        }, {
          text: 'Update Quantity',
          handler: () => {
            this.updateQuantityModal(fulfillmentToUpdate); 
          }
        }
      )
    } else if (fulfillmentToUpdate.mra.type != MraType.ONETIMEDONATION && fulfillmentToUpdate.mra.type != MraType.ONETIMEPAYMENT) { //Recurring 
      if (fulfillmentToUpdate.status == FulfillmentStatus.ONGOING || fulfillmentToUpdate.status == FulfillmentStatus.ENDED) {
        buttons.push({
          text: 'Make Payment',
          handler: () => {
            this.paymentService.getListOfNotCompletedPaymentsByFulfillmentNewestToOldest(fulfillmentToUpdate.fulfillmentId).subscribe(
              async response => {
                var paymentList: Payment[] = response;
                if (paymentList.length > 0) {
                  this.makePaymentModal(fulfillmentToUpdate, paymentList);
                } else {
                  const toast = await this.toastController.create({
                    message: 'No payment needs to be made',
                    color: 'warning',
                    duration: 3000
                  });
                  toast.present();
                }
              }
            );
          }
        });
      }
      if (fulfillmentToUpdate.status == FulfillmentStatus.ONGOING && !this.mrp.endDate) {
        buttons.push({
          text: 'End Subscription',
          handler: () => {
            this.endSubscriptionAlert(fulfillmentToUpdate.fulfillmentId);
          }
        });
      }
    }
    buttons.push({
      text: 'Cancel',
      role: 'cancel'
    });
    return buttons;
  }

  async acceptAlert(fulfillmentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Accept Fulfillment?',
      cssClass: 'acceptAlertCss',
      message: 'This action cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Confirm',
          handler: () => {
            this.fulfillmentService.acceptFulfillment(fulfillmentId).subscribe(
              async response => {
                const toast = await this.toastController.create({
                  message: "Fulfillment is accepted sucessfully",
                  duration: 3000
                });
                toast.present();
                this.refreshFulfillments();
              }
            )
          }
        }
      ]
    });
    await alert.present();
  }

  async rejectAlert(fulfillmentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Reject Fulfillment?',
      message: 'This action cannot be undone',
      cssClass: 'rejectAlertCss',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Reject',
          cssClass: 'reject-button',
          handler: () => {
            this.fulfillmentService.rejectFulfillment(fulfillmentId).subscribe(
              async response => {
                const toast = await this.toastController.create({
                  message: "Fulfillment is rejected sucessfully",
                  duration: 3000
                });
                toast.present();
                this.refreshFulfillments();
              }
            )
          }
        }
      ]
    });
    await alert.present();
  }

  async receiveResourceModal(fulfillmentToUpdate: Fulfillment) {
    const modal = await this.modalController.create({
      component: ReceiveResourceModalPage,
      cssClass: 'manage-fulfillment-modal',
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        fulfillmentToUpdate: fulfillmentToUpdate,
        mrp: this.mrp
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshFulfillments();
    });
  }

  async updateQuantityModal(fulfillmentToUpdate: Fulfillment) {
    const modal = await this.modalController.create({
      component: UpdateQuantityModalPage,
      cssClass: 'manage-fulfillment-modal',
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        mrpId: this.mrpId,
        fulfillmentToUpdate: fulfillmentToUpdate
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshFulfillments();
    });
  }

  async makePaymentModal(fulfillmentToUpdate: Fulfillment, paymentList: Payment[]) {
    const modal = await this.modalController.create({
      component: MakePaymentModalPage,
      cssClass: 'manage-fulfillment-modal',
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        fulfillmentToUpdate: fulfillmentToUpdate,
        mrp: this.mrp,
        paymentList: paymentList
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshFulfillments();
    });
  }

  async endSubscriptionAlert(fulfillmentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm End Subscription?',
      cssClass: 'acceptAlertCss',
      message: 'This action cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Confirm',
          handler: () => {
            this.fulfillmentService.endSubscription(fulfillmentId).subscribe(
              async response => {
                var payment: Payment = response;
                var dueDate = payment.dueDate.toString();
                const toast = await this.toastController.create({
                  message: 'Remember to make all payments by ' + moment(dueDate.slice(0, dueDate.indexOf("["))).format("MMM D, YYYY") + '!',
                  duration: 4000
                });
                toast.present();
                this.refreshFulfillments();
              }
            )
          }
        }
      ]
    });
    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  get fulfillmentStatus(): typeof FulfillmentStatus{
    return FulfillmentStatus;
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    return url;
  }

  get mraType(): typeof MraType {
    return MraType;
  }


}
