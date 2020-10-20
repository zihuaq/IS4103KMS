import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController, ModalController } from '@ionic/angular';

import { CreateHrpPage } from '../create-hrp/create-hrp.page';
import { EditHrpDetailsPage } from '../edit-hrp-details/edit-hrp-details.page';

import { Tag } from 'src/app/classes/tag';
import { Project } from 'src/app/classes/project';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { TagService } from 'src/app/services/tag.service';
import { HrpService } from 'src/app/services/hrp.service';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-edit-hrp',
  templateUrl: './edit-hrp.page.html',
  styleUrls: ['./edit-hrp.page.scss'],
})
export class EditHrpPage implements OnInit {

  projectId: number;
  tags: Tag[];
  hrpList: HumanResourcePosting[];
  currentUserId: number;

  constructor(public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private tagService: TagService,
    private hrpService: HrpService,
    private authenticationService: AuthenticationService,
    private location: Location) {
      this.tags = [];
      this.hrpList = [];
    }

  ngOnInit() {
    console.log("editHrpPage: ngOnInit");
    this.refreshHrp();
  }

  refreshHrp() {
    this.hrpList = [];
    this.tags = [];
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.tagService.getAllSkillTags().subscribe(
      response => {
        this.tags = response;
      }
    );
    this.hrpList = [];
    this.hrpService.getHrpByProject(this.projectId).subscribe(
      response => {
        for (let hrp of response) {
          this.hrpService.getHrp(hrp.humanResourcePostingId).subscribe(
            response => {
              this.hrpList.push(response);
            }
          );
        }
      },
      error => {

      }
    );

  }

  formatDate(date: string) {
    var str = date.slice(0, date.indexOf("["));
    return str;
  }

  async deleteAlert(hrpId: number) {
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

  createHrp() {
    this.router.navigate(["create-hrp/" + this.projectId]);
  }

  editHrp(hrpId: number) {
    this.router.navigate(["edit-hrp-details/" + hrpId]);
  }

}
