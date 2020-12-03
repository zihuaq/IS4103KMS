import { ProfileService } from './../../profile.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-upload-profiles',
  templateUrl: './upload-profiles.component.html',
  styleUrls: ['./upload-profiles.component.css'],
})
export class UploadProfilesComponent implements OnInit {
  @ViewChild('uploadProfileFile') uploadProfileFileInput: ElementRef;
  fileToUpload: String | ArrayBuffer;
  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {}

  postMethod(files: FileList) {
    let file = files.item(0);
    if (file != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fileToUpload = e.target.result;
        console.log(this.uploadProfileFileInput.nativeElement.value);
      };
      reader.readAsDataURL(file);
    } else {
      this.fileToUpload = undefined;
    }
  }

  upload() {
    let uploadProfilesReq = { file: this.fileToUpload };
    this.profileService.uploadProfiles(uploadProfilesReq).subscribe(
      (val) => {
        this.fileToUpload = undefined;
        this.uploadProfileFileInput.nativeElement.value = '';
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Profiles are generated successfully',
        });
      },
      (err) => {
        this.fileToUpload = undefined;
        this.uploadProfileFileInput.nativeElement.value = '';
        $(document).Toasts('create', {
          class: 'bg-warning',
          title: 'Unable to generate profiles',
          autohide: true,
          delay: 2500,
          body: 'Problem generating profiles',
        });
      }
    );
  }
}
