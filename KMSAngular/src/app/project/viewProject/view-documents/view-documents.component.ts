import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as async from 'async';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.css']
})
export class ViewDocumentsComponent implements OnInit {

  projectId: number;
  s3: AWS.S3;
  bucket: string = "is4103kms";
  awsCredential = {
    region: "us-east-2",
    accessKeyId: "AKIAIY62RH5Q6ADCWR6Q",
    secretAccessKey: "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"
  };
  files;

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
     console.log(this.files)
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
}
