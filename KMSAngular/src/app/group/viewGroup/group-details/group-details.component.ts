import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/group.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';
import { NgForm } from '@angular/forms';
// import { GroupType } from 'src/app/classes/group-type.enum';

declare var $: any;

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  loaded: boolean = false;
  groupId: number;
  groupToView: Group;
  loggedInUser: User
  owner: User;
  dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  profilePicture: string | ArrayBuffer;
  selectedProfilePicture: string | ArrayBuffer;
  selectedProfilePictureName: string;
  noOfMembers: number;
  settingStatus = ['Active', 'Deactive'];

  constructor(public groupService: GroupService,
    private userService: UserService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.groupToView = new Group();
      this.owner = new User();
    }

  ngOnInit(): void {
    this.checkAccessRight();
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get("groupId"));

    this.groupService.getGroupById(this.groupId).subscribe(
      response => {
        console.log(response)
        this.groupToView = response;
        this.loaded = true;
        this.noOfMembers = this.groupToView.groupMembers.length;
        this.profilePicture = this.groupToView.profilePicture;
        //console.log(this.profilePicture);
        this.owner = this.groupToView.groupOwner;

        for (let admin of this.groupToView.groupAdmins) {
          if (this.sessionService.getCurrentUser().userId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
          }
        }

        if (!this.isAdmin) {
          for (let member of this.groupToView.groupMembers) {
            if (this.sessionService.getCurrentUser().userId == member.userId) {
              this.isMember = true;
            }
          }
        }
        // this.dateCreated = this.groupToView.dateCreated.toString().substring(0,10);
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        })
        this.router.navigate(["/error"]);
      }
    )
  }

  joinGroup() {
    console.log("******** joinGroup()");
    this.groupService.joinGroup(this.groupId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the group',
        });
        location.reload();
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      });
  }

  leaveGroup() {
    this.groupService.removeMember(this.groupId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Goodbye',
      })
      location.reload();
    },
    error => {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: error,
      })
    });
  }

  onSelect() {
    this.router.navigate(["/editGroup/" + this.groupId]);
  }

  checkAdmin(user: User): boolean {
    for(let member of this.groupToView.groupAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

  getFiles(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedProfilePicture = e.target.result;
        //console.log(this.selectedProfilePicture);
      };
      this.selectedProfilePictureName = event.target.files[0].name;
      //console.log(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedProfilePicture = undefined;
    }
  }

  removePicture() {
    if (this.profilePicture != undefined) {
      this.profilePicture = undefined;
      this.selectedProfilePicture = undefined;
    }
  }

  saveChanges() {
    this.groupToView.profilePicture = this.selectedProfilePicture;
    this.groupService.updateGroup(this.groupToView).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Profile picture updated successfully',
        })
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-warning',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    );
    this.profilePicture = this.selectedProfilePicture;
    this.selectedProfilePicture = undefined;
  }

  cancel() {
    this.profilePicture = this.groupToView.profilePicture;
    this.selectedProfilePicture = undefined;
  }

  onEditGroupSetting(disableForm: NgForm){
    if (disableForm.valid) {
      console.log(disableForm)
    }
    let active: boolean
    if(disableForm.value.status == "Active"){
      this.groupToView.isActive = true
    }
    else{
      this.groupToView.isActive = false;
    }
    this.groupService.updateGroup(this.groupToView).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Group Setting Updated',
        })
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-warning',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    );

  }

  // get groupType(): typeof GroupType{
  //   return GroupType;
  // }

}
