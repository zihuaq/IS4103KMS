import { ProfileService } from './../../profile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-profiles',
  templateUrl: './upload-profiles.component.html',
  styleUrls: ['./upload-profiles.component.css'],
})
export class UploadProfilesComponent implements OnInit {
  fileToUpload: File;
  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {}

  postMethod(files: FileList) {
    this.fileToUpload = files.item(0);
    let formData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    this.profileService.uploadProfile(formData).subscribe((val) => {
      console.log(val);
    });
    return false;
  }
}
