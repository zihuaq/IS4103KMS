import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectType } from 'src/app/enum/project-type.enum';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

declare var Camera: any;
declare var navigator: any;

@Component({
  selector: 'app-edit-project-details',
  templateUrl: './edit-project-details.page.html',
  styleUrls: ['./edit-project-details.page.scss'],
})
export class EditProjectDetailsPage implements OnInit {

  projectId: number;
  projectToEdit: Project;
  owner: User;
  dateCreated: string;
  noOfMembers: number;
  currentUserId: number;  
  segment: string;
  tagList: Tag[];
  tagListString: string[];
  selectedTagNames: string[] = [];
  projectStatusList: ProjectType[];
  hasLoaded: boolean = false;

  constructor(public toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private actionSheetController: ActionSheetController,
    private app: ApplicationRef,
    private tagService: TagService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.projectToEdit = new Project();
      this.owner = new User();
      this.segment = "details";
    }

  ngOnInit() {    
    console.log('detailsTab: ngOnInit ')
    this.refreshProject();
  }

  refreshProject() {
    this.projectService.getProjectStatusList().subscribe(
      response => {
        this.projectStatusList = response;
      }
    );

    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );

    this.tagService.getAllSDGTags().subscribe(      
      response => {
        this.tagListString = [];
        this.tagList = response;
        for (let tag of this.tagList) {
          this.tagListString.push(tag.name);
        }
      }
    );

    // this.selectedTagNames = [];
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToEdit = response;
        this.hasLoaded = true;
        this.noOfMembers = this.projectToEdit.projectMembers.length;
        this.owner = this.projectToEdit.projectOwner;

        this.dateCreated = this.projectToEdit.dateCreated.toString().slice(0,10);

        for (let tag of this.projectToEdit.sdgs) {
          this.selectedTagNames.push(tag.name);       
        }
      }
    );
  }

  async segmentChanged() {
    this.segment;
  }

  async edit(editProjectForm: NgForm) {
    this.projectToEdit.sdgs = [];
    if (this.selectedTagNames.length == 0) {
      const toast = await this.toastController.create({
        message: "Please select at least one SDG tags.",
        duration: 2000
      })
      toast.present();
      return;
    }
    for (let tagString of this.selectedTagNames) {
      for (let tag of this.tagList) {
        if (tag.name == tagString) {
          this.projectToEdit.sdgs.push(tag);
        }
      }
    }
    if (editProjectForm.valid) {
      this.projectToEdit.dateCreated = new Date();
      this.projectService.updateProject(this.projectToEdit).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Project updated successfully.',
            duration: 2000
          });
          toast.present();
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
                this.projectToEdit.profilePicture =
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
                this.projectToEdit.profilePicture =
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
            this.projectToEdit.profilePicture = null;
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
