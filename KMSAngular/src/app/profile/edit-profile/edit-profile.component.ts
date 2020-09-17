import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountPrivacySettingEnum } from 'src/app/classes/privacy-settings.enum';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/user.service';

declare var $: any;
declare var bsCustomFileInput: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  profilePictureFile: string | ArrayBuffer;
  updatedUser: User;
  privacySettings = AccountPrivacySettingEnum;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    $('#datetimepicker').datetimepicker({
      format: 'DD/MM/YYYY',
    });
    bsCustomFileInput.init();
    this.profilePictureFile = this.user.profilePicture;
  }

  getFiles(event) {
    var reader = new FileReader();
    reader.onload = (e) => {
      this.profilePictureFile = e.target.result;
      console.log(this.profilePictureFile);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  onEditProfile(editForm: NgForm) {
    this.updatedUser = new User();
    if (editForm.valid) {
      this.updatedUser.userId = this.user.userId;
      this.updatedUser.firstName = editForm.value.firstName;
      this.updatedUser.lastName = editForm.value.lastName;
      this.updatedUser.email = editForm.value.email;
      this.updatedUser.dob = new Date(
        $('#datetimepicker').datetimepicker('viewDate')
      );
      this.updatedUser.profilePicture = this.profilePictureFile;
      this.updatedUser.accountPrivacySetting = editForm.value.privacySettings;
      this.userService.updateUser(this.updatedUser).subscribe(
        (responsedata: User) => {
          console.log(responsedata);
          this.user = {
            ...this.user,
            firstName: responsedata.firstName,
            lastName: responsedata.lastName,
            email: responsedata.email,
            dob: responsedata.dob,
            profilePicture: responsedata.profilePicture,
          };
          this.userChanged.emit(this.user);
          $(document).Toasts('create', {
            class: 'bg-primary',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Profile updated',
          });
        },
        (err) => {
          console.log(err);
          $(document).Toasts('create', {
            class: 'bg-danger',
            title: 'Error',
            autohide: true,
            delay: 2500,
            body: err,
          });
        }
      );
    }
  }

  removePic() {
    if (this.profilePictureFile != undefined) {
      this.profilePictureFile = undefined;
      $('#profilePictureFile').next('label').text('Choose file');
    }
  }
}
