import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    $('#datetimepicker').datetimepicker({
      format: 'DD/MM/YYYY',
    });
    bsCustomFileInput.init();
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
      this.userService.updateUser(this.updatedUser).subscribe(
        (responsedata: User) => {
          console.log(responsedata);
          this.user = responsedata;
          this.userChanged.emit(this.user);
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
}
