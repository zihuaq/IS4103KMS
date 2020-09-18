import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountPrivacySettingEnum } from 'src/app/classes/privacy-settings.enum';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { TagService } from 'src/app/tag.service';
import { UserService } from 'src/app/user.service';

declare var $: any;
declare var bsCustomFileInput: any;
declare var moment: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  profilePictureFile: string | ArrayBuffer;
  selectedFile: string | ArrayBuffer;
  updatedUser: User;
  privacySettings = AccountPrivacySettingEnum;
  allSDGTags: Tag[];
  selectedTags: Tag[] = [];
  
  constructor(private userService: UserService, private tagService: TagService) {}

  ngOnInit(): void {
    $('#datetimepicker').datetimepicker({
      format: 'DD/MM/YYYY',
    });
    bsCustomFileInput.init();
    this.profilePictureFile = this.user.profilePicture;
    this.selectedTags = Object.assign([], this.user.sdgs);
    $('#datetimepicker').datetimepicker('date', moment(this.user.dob));
    this.tagService.getAllSDGTags().subscribe((response) => {
      this.allSDGTags = response;
    });
  }

  getFiles(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedFile = e.target.result;
        console.log(this.selectedFile);
      };
      console.log(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedFile = undefined;
    }
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
      if (this.selectedFile == undefined) {
        this.updatedUser.profilePicture = this.profilePictureFile;
      } else {
        this.updatedUser.profilePicture = this.selectedFile;
      }
      this.updatedUser.sdgs = this.selectedTags;
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
            sdgs: responsedata.sdgs
          };
          this.profilePictureFile = responsedata.profilePicture;
          this.userChanged.emit(this.user);
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Profile updated',
          });
        },
        (err) => {
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
      this.selectedFile = undefined;
      $('#modal-default').modal('hide');
    }
  }

  checkIfTagSelectedByUser(tag: Tag) {
    return this.selectedTags.includes(tag);
  }

  removeSDG(tag: Tag) {
    this.selectedTags.splice(this.selectedTags.indexOf(tag),1);
  }

  addSDG(tag: Tag) {
    this.selectedTags.push(tag);
  }
}
