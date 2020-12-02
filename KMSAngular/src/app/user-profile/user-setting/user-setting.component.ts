import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/classes/user';
import { AdminService } from 'src/app/admin.service';
import { NgForm } from '@angular/forms';
import { SessionService } from 'src/app/session.service';
import { UserType } from 'src/app/classes/user-type.enum';

declare var $: any;

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {

  @Input() user: User;
  @Output() userChanged = new EventEmitter<User>();
  settingStatus = ['Active', 'Deactive'];
  UserType = UserType;
  loggedInUser: User;

  constructor(private adminService: AdminService, private sessionService: SessionService) { }

  ngOnInit(): void {
    this.loggedInUser = this.sessionService.getCurrentUser();
  }

  promoteToAdmin() {
    this.adminService.promoteUserToAdmin(this.user.userId)
      .subscribe(
        (responsedata) => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Promoted User to Admin successfully',
          })
          this.userChanged.emit(this.user);
        },
        (error) => {
          $(document).Toasts('create', {
            class: 'bg-warning',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      )
  }

  resignFromAdmin() {
    this.adminService.resignFromAdmin(this.loggedInUser.userId)
      .subscribe(
        (responsedata) => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Resigned from Admin successfully',
          })
          this.userChanged.emit(this.user);
        },
        (error) => {
          $(document).Toasts('create', {
            class: 'bg-warning',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      )
  }

  onEditUser(disableForm: NgForm) {
    if (disableForm.valid) {
      console.log(disableForm)
    }
    let active: boolean
    if (disableForm.value.status == "Active") {
      active = true;
    }
    else {
      active = false;
    }
    this.adminService.changeUserStatus(this.sessionService.getCurrentUser().email, this.user.email, active)
      .subscribe(
        (responsedata: User) => {
          this.user = {
            ...this.user,
            firstName: responsedata.firstName,
            lastName: responsedata.lastName,
            email: responsedata.email,
            dob: responsedata.dob,
            profilePicture: responsedata.profilePicture,
            sdgs: responsedata.sdgs,
            isActive: responsedata.isActive
          };
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Profile picture updated successfully',
          })
          this.userChanged.emit(this.user);
        },
        (error) => {
          $(document).Toasts('create', {
            class: 'bg-warning',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      )


  }

}
