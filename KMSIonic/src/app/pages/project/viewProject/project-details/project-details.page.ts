import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, AlertController, ModalController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProjectType } from 'src/app/enum/project-type.enum';
import { ReportProjectPage } from '../report-project/report-project.page';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {

  projectId: number;
  project: Project;
  owner: User;
  dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  noOfMembers: number;
  currentUserId: number;
  segment: string;
  hasLoaded: boolean = false;

  constructor(public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.project = new Project();
      this.owner = new User();
      this.segment = "details";
    }

  ngOnInit() {
    console.log('ngOnInit ')
    this.refreshProject();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ')
    this.refreshProject();
  }

  ionViewDidEnter() {
    this.refreshProject();
    console.log('ionViewDidEnter ')
  }

  refreshProject() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      async response => {
        this.project = response;
        this.hasLoaded = true;
        this.noOfMembers = this.project.projectMembers.length;

        this.owner = this.project.projectOwner;

        this.dateCreated = this.project.dateCreated.toString().slice(0,10);

        for (let admin of this.project.projectAdmins) {
          if (this.currentUserId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
          }
        }

        if (!this.isAdmin) {
          for (let member of this.project.projectMembers) {
            if (this.currentUserId == member.userId) {
              this.isMember = true;
            }
          }
        }
      }
    )
  }

  goBack() {
    this.location.back()
  }

  joinProject() {
    this.projectService.joinProject(this.projectId, this.currentUserId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Welcome to the project.',
          duration: 2000
        });
        toast.present();
        location.reload();
      }
    );
  }

  leaveProject() {
    this.projectService.removeMember(this.projectId, this.currentUserId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Goodbye.',
          duration: 2000
        });
        toast.present();
        location.reload();
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

  checkAdmin(user: User): boolean {
    for(let member of this.project.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  async segmentChanged() {
    this.segment;
  }

  editProject() {
    this.router.navigate(["tab-panel/" + this.projectId]);
  }

  async leaveProjectDialog() {
    const alert = await this.alertController.create({
      header: "Leave Project",
      message: "Are you sure you want to leave this project?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: "Leave",
          handler: () => {
            this.leaveProject();
          }
        }
      ]
    });

    await alert.present();
  }

  get projectType(): typeof ProjectType{
    return ProjectType;
  }

  async reportProject() {
    const modal = await this.modalController.create({
      component: ReportProjectPage,
      componentProps: {projectId: this.projectId}
    });
    return await modal.present();
  }
}
