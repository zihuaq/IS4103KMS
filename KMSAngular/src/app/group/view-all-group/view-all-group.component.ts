import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Router } from '@angular/router';

import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/user.service';

import { Group } from '../../classes/group';
import { GroupService } from '../../group.service';
import { SessionService } from '../../session.service';

declare var $: any;

@Component({
  selector: 'app-view-all-group',
  templateUrl: './view-all-group.component.html',
  styleUrls: ['./view-all-group.component.css']
})
export class ViewAllGroupComponent implements OnInit {

  @Input() searchModel;
  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();

  groups: Group[];
  noGroups: boolean = true;
  groupsJoined: Group[];
  loggedInUser: User;
  groupToLeaveId: number;

  constructor(public groupService: GroupService,
    public userService: UserService,
    private sessionService: SessionService,
    private router: Router) {
      this.groups = [];
     }

  ngOnInit(): void {
    this.checkAccessRight();
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.groupService.getAllGroup().subscribe(
      response => {
        console.log(response)
        this.groups = response.groups;
        if (this.groups.length > 0) {
          this.noGroups = false;
        }
      }
    );

    this.userService.getGroupsJoined(this.loggedInUser.userId).subscribe(
      response => {
        this.groupsJoined = response;
        console.log(this.groupsJoined)
      }
    );
  }

  joinGroup(group: Group) {
    console.log("******** joinGroup()");
    this.groupService.joinGroup(group.groupId, this.loggedInUser.userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the group',
        })
        this.userService.getGroupsJoined(this.loggedInUser.userId).subscribe(
          response => {
            this.groupsJoined = response;
            console.log(this.groupsJoined)
          }
        );

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

  clickLeaveGroup(group: Group) {
    this.groupToLeaveId = group.groupId;
  }

  leaveGroup() {
    console.log("******** leaveGroup()");
    this.groupService.removeMember(this.groupToLeaveId, this.loggedInUser.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Goodbye',
      })
      this.userService.getGroupsJoined(this.loggedInUser.userId).subscribe(
        response => {
          this.groupsJoined = response;
          console.log(this.groupsJoined)
        }
      );
    },
    error => {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: "Owner cannot leave the group",
      })
    });
  }

  updateSearchModel(value) {
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }

  onSelect(group: Group): void {
    this.router.navigate(["/groupDetails/" + group.groupId]);
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }


  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }

  isMember(groupId: number): boolean {
    return this.groupsJoined
      .map((group) => group.groupId)
      .includes(groupId);
  }


}

