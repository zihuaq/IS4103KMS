import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as async from 'async';
import { ActivatedRoute } from '@angular/router';

var global = global || window;

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.scss'],
})
export class ViewDocumentsComponent implements OnInit {

  projectId: number;
  aws = require('aws-sdk');
  files;
  bucket: string = "is4103kms";
  s3;
  hasLoad = false;

  constructor(private activatedRouter: ActivatedRoute) {
    this.files = [];
   }

  ngOnInit() {
    this.projectId = parseInt(this.activatedRouter.snapshot.paramMap.get("projectId"));
    this.s3 = new this.aws.S3({
      signatureVersion: 'v4',
      region: 'eu-east-2',
      accessKeyId: "AKIAIY62RH5Q6ADCWR6Q",
      secretAccessKey: "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"
    });
    this.getObjects();
  }

  async getObjects() {
    const { Contents } = await this.s3
     .listObjectsV2({ Bucket: this.bucket, Prefix: this.projectId.toString(), StartAfter: this.projectId.toString() + "/"})
     .promise();
     this.files = Contents;
     this.hasLoad = true;
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
