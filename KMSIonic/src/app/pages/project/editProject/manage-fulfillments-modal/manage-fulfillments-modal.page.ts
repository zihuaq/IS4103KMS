import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { FulfillmentService } from '../../../../services/fulfillment.service';
import { Fulfillment } from '../../../../classes/fulfillment';
import { FulfillmentStatus } from 'src/app/enum/fulfillment-status.enum';
import { ReceiveResourceModalPage } from './receive-resource-modal/receive-resource-modal.page';
import { UpdateQuantityModalPage } from './update-quantity-modal/update-quantity-modal.page';

@Component({
  selector: 'app-manage-fulfillments-modal',
  templateUrl: './manage-fulfillments-modal.page.html',
  styleUrls: ['./manage-fulfillments-modal.page.scss'],
})
export class ManageFulfillmentsModalPage implements OnInit {

  @Input() mrpId: number;

  fulfillmentList: Fulfillment[];

  constructor(private modalController: ModalController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private fulfillmentService: FulfillmentService) {
      this.fulfillmentList = [];
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
        console.log(this.fulfillmentList)
      }
    )
  }

  async handleFulfillmentActionSheet(fulfillmentToUpdate: Fulfillment) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Manage Fulfillment',
      buttons: this.buttons(fulfillmentToUpdate)
    });
    await actionSheet.present();
  }

  buttons(fulfillmentToUpdate: Fulfillment) {
    var buttons = [];
    if (fulfillmentToUpdate.status == FulfillmentStatus.PLEDGED) {
      buttons = [{
        text: 'Receive Resource',
        handler: () => {
          this.receiveResourceModal(fulfillmentToUpdate); 
        }
      }, {
        text: 'Update Quantity',
        handler: () => {
          this.updateQuantityModal(fulfillmentToUpdate); 
        }
      }, {
        text: 'Reject Fulfillment',
        handler: () => {
          this.rejectAlert(fulfillmentToUpdate.fulfillmentId);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    } else if (fulfillmentToUpdate.status == FulfillmentStatus.PARTIALLYFULFILLED) {
      buttons = [{
        text: 'Receive Resource',
        handler: () => {
          this.receiveResourceModal(fulfillmentToUpdate); 
        }
      }, {
        text: 'Update Quantity',
        handler: () => {
          this.updateQuantityModal(fulfillmentToUpdate); 
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    } else if (fulfillmentToUpdate.status == FulfillmentStatus.FULFILLED) {
      buttons = [{
        text: 'Update Quantity',
        handler: () => {
          this.updateQuantityModal(fulfillmentToUpdate); 
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    }
    return buttons;
  }

  async receiveResourceModal(fulfillmentToUpdate: Fulfillment) {
    const modal = await this.modalController.create({
      component: ReceiveResourceModalPage,
      cssClass: 'manage-fulfillment-modal',
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        fulfillmentToUpdate: fulfillmentToUpdate
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

  async rejectAlert(fulfillmentId: number) {
    const alert = await this.alertController.create({
      header: 'Reject Fulfillment?',
      message: 'This action cannot be undone',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Confirm',
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

  dismiss() {
    this.modalController.dismiss();
  }

  get fulfillmentStatus(): typeof FulfillmentStatus{
    return FulfillmentStatus;
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }

}
