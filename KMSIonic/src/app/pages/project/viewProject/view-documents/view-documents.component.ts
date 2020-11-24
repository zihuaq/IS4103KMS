import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import * as async from 'async';
import { ActivatedRoute } from '@angular/router';

import { Document } from 'src/app/classes/document';

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
  docs: Document[];

  constructor(private activatedRouter: ActivatedRoute) {
    this.files = [];
    this.docs = [];
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
     this.hasLoad = true;
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

  formatFileKey(key) {
    let index = key.indexOf("/");
    return key.substring(index + 1);
  }


}
