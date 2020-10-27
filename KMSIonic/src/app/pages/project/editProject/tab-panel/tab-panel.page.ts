import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ActionSheetController, ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { MaterialResourcePosting } from 'src/app/classes/material-resource-posting';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { HrpService } from 'src/app/services/hrp.service';
import { MrpService } from 'src/app/services/mrp.service';
import { ManageFulfillmentsModalPage } from '../manage-fulfillments-modal/manage-fulfillments-modal.page';
import { FulfillmentService } from '../../../../services/fulfillment.service';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.page.html',
  styleUrls: ['./tab-panel.page.scss'],
})
export class TabPanelPage implements OnInit {

  projectId: number;
  projectToEdit: Project;
  owner: User;
  dateCreated: string;
  noOfMembers: number;
  currentUserId: number;  
  segment: string;
  isOwner: boolean = false;
  hrpTags: Tag[];
  hrpList: HumanResourcePosting[];
  mrpTags: Tag[];
  mrpList: MaterialResourcePosting[];
  noMrp: boolean = true;

  constructor(public toastController: ToastController,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private tagService: TagService,
    private hrpService: HrpService,
    private mrpService: MrpService,
    private fulfillmentService: FulfillmentService,
    private location: Location) { 
      this.projectToEdit = new Project();
      this.owner = new User();
      this.segment = "details";
      this.hrpTags = [];
      this.hrpList = [];
      this.mrpTags = [];
      this.mrpList = [];
    }

  ngOnInit() {
    console.log("tab-panel: ngOnInit()")
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );
    this.refreshProject();
    
  }

  ionViewWillEnter() {
    console.log("tab-panel: ionViewWillEnter()")
    this.refreshHrp();
    this.refreshProject();
    this.refreshMrp();
  }

  refreshProject() {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      async response => {
        this.projectToEdit = response;
        if (this.projectToEdit.projectOwner.userId == this.currentUserId) {
          this.isOwner = true;
        }
        this.noOfMembers = this.projectToEdit.projectMembers.length;

        this.owner = this.projectToEdit.projectOwner;

        this.dateCreated = this.projectToEdit.dateCreated.toString().slice(0,10);
      }
    )
  }

  refreshHrp() {
    this.hrpList = [];
    this.hrpTags = [];
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.tagService.getAllSkillTags().subscribe(
      response => {
        this.hrpTags = response;
      }
    );
    this.hrpService.getHrpByProject(this.projectId).subscribe(
      response => {
        for (let hrp of response) {
          this.hrpService.getHrp(hrp.humanResourcePostingId).subscribe(
            response => {
              this.hrpList.push(response);
            }
          );
        }
      }
    );

  }

  refreshMrp() {
    this.mrpTags = [];
    this.mrpList = [];
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.tagService.getAllMaterialResourceTags().subscribe(
      response => {
        this.mrpTags = response;
      }
    );

    this.mrpService.getMrpByProject(this.projectId).subscribe(
      response => {
        this.mrpList = response;
        this.mrpList.sort((a, b) => (a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0));
        if (this.mrpList.length > 0) {
          this.noMrp = false;
        }
      }
    );
  }

  async segmentChanged() {
    this.segment;
  }

  deleteProject() {
    this.projectService.deleteProject(this.projectId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Project deleted successfully.',
          duration: 2000
        });
        toast.present();
        this.router.navigate(["view-all-project"]);
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          duration: 2000
        });
        toast.present();
      }
    );
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Delete Project",
      message: "Are you sure you want to delete this project?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: "Delete",
          handler: () => {
            this.deleteProject();
          }
        }
      ]
    });

    await alert.present();
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

  async deleteHrpAlert(hrpId: number) {
    const alert = await this.alertController.create({
      header: "Delete Hrp",
      message: "Are you sure you want to delete this hrp?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: "Delete",
          handler: () => {
            this.deleteHrp(hrpId);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteHrp(hrpId: number) {
    this.hrpService.deleteHrp(hrpId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Hrp deleted successfully.',
          duration: 2000
        });
        toast.present();
        this.refreshHrp();
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          duration: 2000
        });
        toast.present();
      }
    );
  }

  async deleteMrpAlert(mrpId: number) {
    const alert = await this.alertController.create({
      header: "Delete Posting",
      message: "Are you sure you want to delete this posting?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: "Delete",
          handler: () => {
            this.deleteMrp(mrpId);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteMrp(mrpId: number) {
    this.mrpService.deleteMrp(mrpId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Posting is deleted successfully.',
          duration: 2500
        });
        toast.present();
        this.refreshMrp();
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          color: "danger",
          duration: 2500
        });
        toast.present();
      }
    );
  }

  createHrp() {
    console.log(this.projectId);
    this.router.navigate(["create-hrp/" + this.projectId]);
  }

  editHrp(hrpId: number) {
    this.router.navigate(["edit-hrp-details/" + hrpId]);
  }

  async handleMrpActionSheet(mrpId: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [{
        text: 'Manage Fulfillments',
        icon: 'cube',
        handler: () => {
          this.manageFulfillmentsModal(mrpId); 
        }
      }, {
        text: 'Edit Posting',
        icon: 'create',
        handler: () => {
          this.router.navigate(["edit-mrp-details/" + mrpId]);
        }
      }, {
        text: 'Delete Posting',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.fulfillmentService.getFulfillmentsByMrp(mrpId).subscribe(
            response => {
              if (response.length > 0) {
                this.deleteError();
              } else {
                this.deleteMrpAlert(mrpId);
              }
            } 
          )
          
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async deleteError() {
    const toast = await this.toastController.create({
      message: "Posting with fulfillments cannot be deleted",
      color: "danger",
      duration: 2500
    });
    toast.present();
  }

  createMrp() {
    console.log(this.projectId);
    this.router.navigate(["create-mrp/" + this.projectId]);
  }

  async manageFulfillmentsModal(mrpId: number) {
    const modal = await this.modalController.create({
      component: ManageFulfillmentsModalPage,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        mrpId: mrpId
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshMrp();
    });
  }

  changehref(lat: number, long: number) {
    var url = "http://maps.google.com/?q=" + lat + "," + long;
    window.open(url, '_blank');
  }
}
