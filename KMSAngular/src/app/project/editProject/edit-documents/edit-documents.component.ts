import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/classes/user';
import { SessionService } from 'src/app/session.service';
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/notification.service';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';

declare var $: any;

@Component({
  selector: 'app-edit-documents',
  templateUrl: './edit-documents.component.html',
  styleUrls: ['./edit-documents.component.css']
})
export class EditDocumentsComponent implements OnInit {

  projectId: number;
  s3: AWS.S3;
  bucket: string = "is4103kms";
  awsCredential = {
    region: "us-east-2",
    accessKeyId: "AKIAIY62RH5Q6ADCWR6Q",
    secretAccessKey: "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"
  };
  files;
  fileToUpload: File = null;
  fileToDelete;
  project: Project;
  currentUser: User;
  description: string;
  docs: Document[];

  constructor(private activatedRouter: ActivatedRoute,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private projectService: ProjectService) { 
    this.files = [];
    this.docs = [];
  }

  ngOnInit(): void {
    this.currentUser = this.sessionService.getCurrentUser();
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.project = response;
      }
    );

    AWS.config.update(this.awsCredential);
    this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
    this.getObjects();
  }

  async getObjects() {
    this.docs = [];
    const { Contents } = await this.s3
     .listObjectsV2({ Bucket: this.bucket, Prefix: this.projectId.toString(), StartAfter: this.projectId.toString() + "/"})
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
      await this.s3.getObjectTagging(par, function(err, data) {
        if (err) {
          // error
        }
        else {
          doc.author = data.TagSet[0].Value;
          doc.description = data.TagSet[1].Value;
          
        }        
      }).promise().then(
        () => {
          this.docs.push(doc);
        }        
      )      
    }
    return Contents;
   }
  

  viewFile(key) {
    var params = {
      Bucket: this.bucket,
      Key: key,
    }
    console.log(params);
    let url = this.s3.getSignedUrl("getObject", params)
    window.open(url);
  }

  formatFileKey(file) {
    let index = file.indexOf("/");
    return file.substring(index + 1);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFile() {
    if (this.fileToUpload == null) {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: 'Please select a file',
      });
      return;
    }

    const params = {
      Bucket: this.bucket,
      Key: this.projectId + "/" + this.fileToUpload.name,
      Body: this.fileToUpload,
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
      () => {
        let newNotification = new Notification();
        newNotification.msg = "A new document has been uploaded to " + this.project.name;
        newNotification.projectId = this.projectId;
        newNotification.groupId = null;
        newNotification.projectTab = "document-tab";
        for (let member of this.project.projectMembers) {
          if (member.userId != this.currentUser.userId) {
            this.notificationService.createNewNotification(newNotification, member.userId).subscribe();
          }
        }
        $('#uploadCloseBtn').click();
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Document uploaded successfully',
        });
        this.getObjects();
        this.fileToUpload = null;
      }
    )    
  }

  clickDelete(file) {
    this.fileToDelete = file;
  }

  deleteFile() {
    const params = {
      Bucket: this.bucket,
      Key: this.fileToDelete.Key
    }

    this.s3.deleteObject(params).promise().then(
      () => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Document deleted successfully',
        });
        this.getObjects();
      }
    );        
  }

}

export class Document {
  key: string;
  author: string;
  description: string;
  timeStamp: string;

  constructor(key?: string, author?: string, description?: string, timeStamp?: string) {
    this.key = key;
    this.author = author;
    this.description = description;
    this.timeStamp = timeStamp;
  }
}
