import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private activatedRouter: ActivatedRoute) { 
    this.files = [];
  }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));

    AWS.config.update(this.awsCredential);
    this.s3 = new AWS.S3({apiVersion: '2006-03-01'});
    this.getObjects();
  }

  async getObjects() {
    const { Contents } = await this.s3
     .listObjectsV2({ Bucket: this.bucket, Prefix: this.projectId.toString(), StartAfter: this.projectId.toString() + "/"})
     .promise();
     this.files = Contents;
    return Contents;
   }
  

  viewFile(file) {
    var params = {
      Bucket: this.bucket,
      Key: file.Key,
    }
    console.log(params);
    let url = this.s3.getSignedUrl("getObject", params)
    window.open(url);
  }

  formatFileKey(file) {
    let index = file.Key.indexOf("/");
    return file.Key.substring(index + 1);
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
      Body: this.fileToUpload
    }

    this.s3.upload(params, function(err, data) {
      if (err) {
        console.log(err);
      }
    }).promise().then(
      () => {
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
