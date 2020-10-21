import { PostService } from './../../../../services/post.service';
import { Post } from './../../../../classes/post';
import { UserService } from 'src/app/services/user.service';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { forkJoin } from 'rxjs';

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

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private location: Location,
    private userService: UserService,
    private app: ApplicationRef,
    private postService: PostService
  ) {
    this.project = new Project();
    this.owner = new User();
    this.segment = 'newsfeed';
  }

  ngOnInit() {
    console.log('ngOnInit ');
    this.refreshProject();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ');
    this.refreshProject();
  }

  ionViewDidEnter() {
    this.refreshProject();
    console.log('ionViewDidEnter ');
  }

  refreshProject() {
    this.projectId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('projectId')
    );
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
        this.isMember = true;
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
          this.isMember = false;
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
}
