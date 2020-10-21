import { Component, OnInit, ApplicationRef } from '@angular/core';

import { NgForm } from '@angular/forms';
import { ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

declare var Camera: any;
declare var navigator: any;

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.page.html',
  styleUrls: ['./create-new-project.page.scss'],
})
export class CreateNewProjectPage implements OnInit {

  newProject: Project;
  tags: Tag[];
  currentUserId: number;

  constructor(public modalCtrl: ModalController,
    public toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private app: ApplicationRef,
    private projectService: ProjectService,
    private tagService: TagService,
    private authenticationService: AuthenticationService) { 
      this.newProject = new Project();
      this.tags = [];
    }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );
  }

  ionViewWillEnter() {
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
      }
    )
  }

  async create(createProjectForm: NgForm) {
    let tagIds: number[] = [];
    if (this.newProject.sdgs.length > 0) {
      for (let tag of this.newProject.sdgs) {
        tagIds.push(tag.tagId);
      }
    } else {
      const toast = await this.toastController.create({
        message: "Please select at least one SDG tags.",
        duration: 2000
      })
      toast.present();
      return;
    }

    this.newProject.sdgs = [];
    if (createProjectForm.valid) {
      this.newProject.dateCreated = new Date();
      this.projectService.createNewProject(this.newProject, this.currentUserId, tagIds).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Project created successfully.',
            duration: 2000
          });
          toast.present();
          this.modalCtrl.dismiss({
            'dismissed': true
          });
          this.router.navigate(["project-details/" + response.projectId]);
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

  dismissModal() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async choosePictureActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Profile Picture',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            console.log('Camera chosen');
            navigator.camera.getPicture(
              (imageUri) => {
                console.log(imageUri);
                this.newProject.profilePicture =
                  'data:image/jpeg;base64,' + imageUri;
                this.app.tick();
              },
              (error) => {
                console.debug('Unable to obtain picture: ' + error, 'app');
              },
              this.setOptions(Camera.PictureSourceType.CAMERA)
            );
          }
        },
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            console.log('Gallery chosen');
            navigator.camera.getPicture(
              (imageUri) => {
                console.log(imageUri);
                this.newProject.profilePicture =
                  'data:image/jpeg;base64,' + imageUri;
                this.app.tick();
              },
              (error) => {
                console.debug('Unable to obtain picture: ' + error, 'app');
              },
              this.setOptions(Camera.PictureSourceType.PHOTOLIBRARY)
            );
          }
        },
        {
          text: 'Remove Existing',
          icon: 'trash',
          handler: () => {
            this.newProject.profilePicture = null;
          }
        }
      ]
    });

    actionSheet.onDidDismiss().then(() => {
      console.log('Dismissed');
    });

    await actionSheet.present();
  }

  setOptions(srcType) {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      correctOrientation: true
    };
    return options;
  }

}
