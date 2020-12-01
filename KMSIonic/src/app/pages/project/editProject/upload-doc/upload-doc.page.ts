import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from "@angular/router";
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Location } from "@angular/common";

import { User } from 'src/app/classes/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { Project } from 'src/app/classes/project'; 
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-upload-doc',
  templateUrl: './upload-doc.page.html',
  styleUrls: ['./upload-doc.page.scss'],
})
export class UploadDocPage implements OnInit {

  projectId: number;
  project: Project;
  fileToUpload: File = null;
  bucket: string = "is4103kms";
  aws = require('aws-sdk');
  s3;
  currentUser: User;
  description: string;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private fileChooser: FileChooser,
    private location: Location,
    private modalCtrl: ModalController,
    public toastController: ToastController,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private projectService: ProjectService) {
    
   }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUser = user;
      }
    );

    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
      }
    );
    this.s3 = new this.aws.S3({
      signatureVersion: 'v4',
      region: 'eu-east-2',
      accessKeyId: "AKIAIY62RH5Q6ADCWR6Q",
      secretAccessKey: "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"
    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  dismiss() {
    this.location.back();
  }

  async uploadFile() {
    if (this.fileToUpload == null) {
      const toast = await this.toastController.create({
        message: 'Please select a file.',
        duration: 2500
      });
      return;
    }
    const params = {
      Bucket: this.bucket,
      Key: this.projectId + "/" + this.fileToUpload.name,
      Body: this.fileToUpload
    }

    this.s3.upload(params, 
      {
        tags: [
          {
            Key: 'author',
            Value: this.currentUser.firstName + " " + this.currentUser.lastName,
          },
          {
              Key: 'description',
              Value: this.description,
          },            
        ],
    },
      function(err, data) {
      if (err) {
        console.log(err);
      }
    }).promise().then(
      async () => {
        let newNotification = new Notification();
        newNotification.msg = "A new document has been uploaded to " + this.project.name;
        newNotification.projectId = this.projectId;
        newNotification.groupId = null;
        newNotification.tabName = "document-tab";
        for (let member of this.project.projectMembers) {
          if (member.userId != this.currentUser.userId) {
            this.notificationService.createNewNotification(newNotification, member.userId).subscribe();
          }
        }
        const toast = await this.toastController.create({
          message: 'Document is uploaded successfully.',
          duration: 2500
        });
        toast.present();
        this.fileToUpload = null;  
        this.router.navigate(["tab-panel/" + this.projectId]);      
      }
    )    
  }

}
