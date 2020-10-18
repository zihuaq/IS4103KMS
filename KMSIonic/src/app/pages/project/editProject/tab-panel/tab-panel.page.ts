import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

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

  constructor(public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.projectToEdit = new Project();
      this.owner = new User();
      this.segment = "details";
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

  async segmentChanged() {
    this.segment;
  }

  deleteProject() {
    if (this.isOwner) {
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
}
