import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToastController,
  ActionSheetController,
  ModalController
} from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

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
import { MrpRecommendationsModalPage } from '../mrp-recommendations-modal/mrp-recommendations-modal.page';
import { FulfillmentService } from '../../../../services/fulfillment.service';
import { Document } from 'src/app/classes/document';
import { HrpRecommendationsModalPage } from '../hrp-recommendations-modal/hrp-recommendations-modal.page';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.page.html',
  styleUrls: ['./tab-panel.page.scss']
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
  aws = require('aws-sdk');
  files;
  fileToDelete;
  bucket: string = 'is4103kms';
  s3;
  hasLoad = false;
  docs: Document[];

  constructor(
    private fileChooser: FileChooser,
    public toastController: ToastController,
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
    private location: Location
  ) {
    this.projectToEdit = new Project();
    this.owner = new User();
    this.segment = 'details';
    this.hrpTags = [];
    this.hrpList = [];
    this.mrpTags = [];
    this.mrpList = [];
    this.files = [];
    this.docs = [];
  }

  ngOnInit() {
    console.log('tab-panel: ngOnInit()');
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.currentUserId = user.userId;
      console.log('currenct user: ' + this.currentUserId);
      this.refreshProject();
    });
    this.s3 = new this.aws.S3({
      signatureVersion: 'v4',
      region: 'eu-east-2',
      accessKeyId: 'AKIAIY62RH5Q6ADCWR6Q',
      secretAccessKey: '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'
    });
  }

  ionViewWillEnter() {
    console.log('tab-panel: ionViewWillEnter()');
    this.refreshHrp();
    this.refreshProject();
    this.refreshMrp();
    this.refreshDocs();
  }

  refreshProject() {
    this.projectId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('projectId')
    );
    this.projectService
      .getProjectById(this.projectId)
      .subscribe(async (response) => {
        this.projectToEdit = response;
        if (this.projectToEdit.projectOwner.userId == this.currentUserId) {
          this.isOwner = true;
          console.log('isOwner');
        }
        this.noOfMembers = this.projectToEdit.projectMembers.length;

        this.owner = this.projectToEdit.projectOwner;
        console.log('owner: ' + this.owner.userId);
        this.dateCreated = this.projectToEdit.dateCreated
          .toString()
          .slice(0, 10);
      });
  }

  refreshHrp() {
    this.hrpList = [];
    this.hrpTags = [];
    this.projectId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('projectId')
    );

    this.tagService.getAllSkillTags().subscribe((response) => {
      this.hrpTags = response;
    });
    this.hrpService.getHrpByProject(this.projectId).subscribe((response) => {
      for (let hrp of response) {
        this.hrpService
          .getHrp(hrp.humanResourcePostingId)
          .subscribe((response) => {
            this.hrpList.push(response);
          });
      }
    });
  }

  refreshMrp() {
    this.mrpTags = [];
    this.mrpList = [];
    this.projectId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('projectId')
    );

    this.tagService.getAllMaterialResourceTags().subscribe((response) => {
      this.mrpTags = response;
    });

    this.mrpService.getMrpByProject(this.projectId).subscribe((response) => {
      this.mrpList = response;
      this.mrpList.sort((a, b) =>
        a.startDate > b.startDate ? 1 : a.startDate < b.startDate ? -1 : 0
      );
      if (this.mrpList.length > 0) {
        this.noMrp = false;
      }
    });
  }

  async refreshDocs() {
    this.docs = [];
    const { Contents } = await this.s3
      .listObjectsV2({
        Bucket: this.bucket,
        Prefix: this.projectId.toString(),
        StartAfter: this.projectId.toString() + '/'
      })
      .promise();
    this.files = Contents;

    for (let i = 0; i < this.files.length; i++) {
      let doc = new Document();
      doc.key = this.files[i].Key;
      doc.timeStamp = this.files[i].LastModified;
      var par = {
        Bucket: this.bucket,
        Key: this.files[i].Key
      };
      await this.s3
        .getObjectTagging(par, function (err, data) {
          if (err) {
            // error
          } else {
            doc.author = data.TagSet[0].Value;
            doc.description = data.TagSet[1].Value;
          }
        })
        .promise()
        .then(() => {
          this.docs.push(doc);
        });
    }
    this.hasLoad = true;
  }

  async segmentChanged() {
    this.segment;
  }

  async deleteProject() {
    console.log(this.isOwner);
    if (this.isOwner) {
      this.projectService.deleteProject(this.projectId).subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Project deleted successfully.',
            duration: 2000
          });
          toast.present();
          this.router.navigate(['view-all-project']);
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: error,
            duration: 2000
          });
          toast.present();
        }
      );
    } else {
      const toast = await this.toastController.create({
        message: 'Only owner of project can delete this project',
        duration: 2000
      });
      toast.present();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Delete Project',
      message: 'Are you sure you want to delete this project?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteProject();
          }
        }
      ]
    });

    await alert.present();
  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf('['));
    return str;
  }

  async deleteHrpAlert(hrpId: number) {
    const alert = await this.alertController.create({
      header: 'Delete Hrp',
      message: 'Are you sure you want to delete this hrp?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
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
      async (response) => {
        const toast = await this.toastController.create({
          message: 'Hrp deleted successfully.',
          duration: 2000
        });
        toast.present();
        this.refreshHrp();
      },
      async (error) => {
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
      header: 'Delete Posting',
      message: 'Are you sure you want to delete this posting?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
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
      async (response) => {
        const toast = await this.toastController.create({
          message: 'Posting is deleted successfully.',
          duration: 2500
        });
        toast.present();
        this.refreshMrp();
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: error,
          color: 'danger',
          duration: 2500
        });
        toast.present();
      }
    );
  }

  async handleHrpActionSheet(hrpId: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'View Recommendations',
          icon: 'star',
          handler: () => {
            this.hrpRecommendationsModal(hrpId);
          }
        },
        {
          text: 'Edit Posting',
          icon: 'create',
          handler: () => {
            this.editHrp(hrpId);
          }
        },
        {
          text: 'Delete Posting',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteHrpAlert(hrpId);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  createHrp() {
    console.log(this.projectId);
    this.router.navigate(['create-hrp/' + this.projectId]);
  }

  editHrp(hrpId: number) {
    this.router.navigate(['edit-hrp-details/' + hrpId]);
  }

  async handleMrpActionSheet(mrpId: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Manage Fulfillments',
          icon: 'cube',
          handler: () => {
            this.manageFulfillmentsModal(mrpId);
          }
        },
        {
          text: 'View Recommendations',
          icon: 'star',
          handler: () => {
            this.mrpRecommendationsModal(mrpId);
          }
        },
        {
          text: 'Edit Posting',
          icon: 'create',
          handler: () => {
            this.router.navigate(['edit-mrp-details/' + mrpId]);
          }
        },
        {
          text: 'Delete Posting',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.fulfillmentService
              .getFulfillmentsByMrp(mrpId)
              .subscribe((response) => {
                if (response.length > 0) {
                  this.deleteError();
                } else {
                  this.deleteMrpAlert(mrpId);
                }
              });
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async deleteError() {
    const toast = await this.toastController.create({
      message: 'Posting with fulfillments cannot be deleted',
      color: 'danger',
      duration: 2500
    });
    toast.present();
  }

  createMrp() {
    console.log(this.projectId);
    this.router.navigate(['create-mrp/' + this.projectId]);
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

  async hrpRecommendationsModal(hrpId: number) {
    const modal = await this.modalController.create({
      component: HrpRecommendationsModalPage,
      showBackdrop: true,
      swipeToClose: true,
      componentProps: {
        hrpId: hrpId
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshHrp();
    });
  }

  async mrpRecommendationsModal(mrpId: number) {
    const modal = await this.modalController.create({
      component: MrpRecommendationsModalPage,
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
    var url = 'http://maps.google.com/?q=' + lat + ',' + long;
    window.open(url, '_blank');
  }

  viewFile(key) {
    var params = {
      Bucket: this.bucket,
      Key: key
    };
    let url = this.s3.getSignedUrl('getObject', params);
    window.open(url);
  }

  formatFileKey(key) {
    let index = key.indexOf('/');
    return key.substring(index + 1);
  }

  async deleteDocs(key) {
    this.fileToDelete = key;
    const alert = await this.alertController.create({
      header: 'Delete Documents',
      message: 'Are you sure you want to delete this document?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteFile();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteFile() {
    const params = {
      Bucket: this.bucket,
      Key: this.fileToDelete
    };

    this.s3
      .deleteObject(params)
      .promise()
      .then(async () => {
        const toast = await this.toastController.create({
          message: 'Document is deleted successfully.',
          duration: 2500
        });
        toast.present();
        this.refreshDocs();
      });
  }

  uploadModal() {
    this.router.navigate(['upload-doc/' + this.projectId]);
  }
}
