import { SharePostModalPage } from './../../../share-post-modal/share-post-modal.page';
import { PostService } from './../../../../services/post.service';
import { Post } from './../../../../classes/post';
import { UserService } from 'src/app/services/user.service';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ToastController,
  AlertController,
  ModalController,
  ActionSheetController
} from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { forkJoin } from 'rxjs';
import { ProjectType } from 'src/app/enum/project-type.enum';
import { ReportProjectPage } from '../report-project/report-project.page';
import { DonateToProjectModalPage } from '../donate-to-project-modal/donate-to-project-modal.page';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss']
})
export class ProjectDetailsPage implements OnInit {
  projectId: number;
  project: Project;
  owner: User;
  dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  noOfMembers: number;
  segment: string;
  loggedInUser: User;
  newsfeedPosts: Post[];
  hasLoaded: boolean = false;

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private location: Location,
    private userService: UserService,
    private app: ApplicationRef,
    private postService: PostService,
    private actionSheetController: ActionSheetController
  ) {
    this.project = new Project();
    this.owner = new User();
    this.segment = 'projectfeed-tab';
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.refreshProject();
  }

  refreshProject() {
    this.segment = this.activatedRoute.snapshot.paramMap.get('tabName')    
    this.projectId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('projectId')
    );
    if (this.segment == 'activity-tab' || this.segment == 'task-tab') {
      this.presentAlert();
      this.segment = 'projectfeed-tab'
    }
    this.authenticationService.getCurrentUser().then((user: User) => {
      let loggedInUserId = user.userId;
      forkJoin([
        this.userService.getUser(loggedInUserId.toString()),
        this.postService.getPostForProjectNewsfeed(this.projectId),
        this.projectService.getProjectById(this.projectId)
      ]).subscribe((result) => {
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.project = result[2];
        this.hasLoaded = true;
        this.noOfMembers = this.project.projectMembers.length;

        this.owner = this.project.projectOwner;

        this.dateCreated = this.project.dateCreated.toString().slice(0, 10);

        for (let admin of this.project.projectAdmins) {
          if (this.loggedInUser.userId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
          }
        }

        if (!this.isAdmin) {
          for (let member of this.project.projectMembers) {
            if (this.loggedInUser.userId == member.userId) {
              this.isMember = true;
            }
          }
        }
        this.app.tick();
      });
    });
  }

  async presentAlert() {
    console.log("test")
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      subHeader: this.segment + " not availble in mobile app.",
      message: 'Please use the web browser to view it.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
  }

  goBack() {
    this.location.back();
  }

  joinProject() {
    this.projectService
      .joinProject(this.projectId, this.loggedInUser.userId)
      .subscribe(async (response) => {
        const toast = await this.toastController.create({
          message: 'Welcome to the project.',
          duration: 2000
        });
        toast.present();
        location.reload();
      });
  }

  leaveProject() {
    this.projectService
      .removeMember(this.projectId, this.loggedInUser.userId)
      .subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Goodbye.',
            duration: 2000
          });
          toast.present();
          location.reload();
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

  checkAdmin(user: User): boolean {
    for (let member of this.project.projectAdmins) {
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
    this.router.navigate(['tab-panel/' + this.projectId]);
  }

  async leaveProjectDialog() {
    const alert = await this.alertController.create({
      header: 'Leave Project',
      message: 'Are you sure you want to leave this project?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Leave',
          handler: () => {
            this.leaveProject();
          }
        }
      ]
    });

    await alert.present();
  }

  get projectType(): typeof ProjectType {
    return ProjectType;
  }

  async reportProject() {
    const modal = await this.modalController.create({
      component: ReportProjectPage,
      componentProps: { projectId: this.projectId }
    });
    return await modal.present();
  }

  async projectActionSheet() {
    let actionSheet;
    if (this.isMember) {
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Leave Project',
            icon: 'exit',
            handler: () => {
              this.leaveProjectDialog();
            }
          },
          {
            text: 'Share Project',
            icon: 'arrow-redo',
            handler: () => {
              this.share();
            }
          }
        ]
      });
    } else {
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Report Project',
            icon: 'flag',
            handler: async () => {
              console.log('Report chosen');
              this.reportProject();
            }
          }
        ]
      });
    }
    actionSheet.onDidDismiss().then(() => {
      console.log('Dismissed');
    });

    await actionSheet.present();
  }

  async share() {
    console.log('share', this.projectId);
    const modal = await this.modalController.create({
      component: SharePostModalPage,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: 'share-post-modal',
      componentProps: {
        projectId: this.projectId,
        loggedInUser: this.loggedInUser
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshProject();
    });
  }

  async presentDonateToProjectModal() {
    const modal = await this.modalController.create({
      component: DonateToProjectModalPage,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: 'donate-to-project-modal',
      componentProps: {
        loggedInUser: this.loggedInUser,
        project: this.project
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshProject();
    });
  }
}
