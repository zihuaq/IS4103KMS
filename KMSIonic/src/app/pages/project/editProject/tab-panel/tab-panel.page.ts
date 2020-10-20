import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HumanResourcePosting } from 'src/app/classes/human-resource-posting';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { HrpService } from 'src/app/services/hrp.service';

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
  tags: Tag[];
  hrpList: HumanResourcePosting[];

  constructor(public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private tagService: TagService,
    private hrpService: HrpService,
    private location: Location) { 
      this.projectToEdit = new Project();
      this.owner = new User();
      this.segment = "details";
      this.tags = [];
      this.hrpList = [];
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
    console.log(this.projectId);
    this.router.navigate(["create-hrp/" + this.projectId]);
  }

  editHrp(hrpId: number) {
    this.router.navigate(["edit-hrp-details/" + hrpId]);
  }
}
