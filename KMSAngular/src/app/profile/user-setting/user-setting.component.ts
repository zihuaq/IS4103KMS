import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/classes/user';
import { AdminService } from 'src/app/admin.service';
import { NgForm } from '@angular/forms';
import { SessionService } from 'src/app/session.service';

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

  constructor(private adminService: AdminService, private sessionService: SessionService) { }

  ngOnInit(): void {
  }

  onEditUser(disableForm: NgForm) {
    if (disableForm.valid) {
      console.log(disableForm)
    }
    let active: boolean
    if(disableForm.value.status == "Active"){
      active = true;
    }
    else{
      active = false;
    }
    this.adminService.changeUserStatus(this.sessionService.getCurrentUser().email, this.user.email, active)
    .subscribe(
      (responsedata: User)=>{
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
        this.userChanged.emit(this.user);
      },
      (error)=>{
        console.log('error');
      }
    )


  }

}
