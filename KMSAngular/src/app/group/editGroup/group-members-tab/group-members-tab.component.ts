import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { ActivatedRoute} from '@angular/router';

import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/group.service';
import { SessionService } from 'src/app/session.service';
import { User } from 'src/app/classes/user';

declare var $: any;

@Component({
  selector: 'app-group-members-tab',
  templateUrl: './group-members-tab.component.html',
  styleUrls: ['./group-members-tab.component.css']
})
export class GroupMembersTabComponent implements OnInit {

  @Input() groupToEdit: Group;
  @Output() groupChanged = new EventEmitter<Group>();
  groupId: number;
  loggedInUser: User;
  isOwner: boolean = false;

  constructor(public groupService: GroupService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get("groupId"));
    console.log("Group ID: " + this.groupId);
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.groupService.getGroupById(this.groupId).subscribe(
      response => {
        this.groupToEdit = response;
        if (this.groupToEdit.groupOwner.userId == this.loggedInUser.userId) {
          this.isOwner = true;
        }
      }
    );
  }

  isAdmin(user: User): boolean {
    for(let member of this.groupToEdit.groupAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  promoteToAdmin(user: User) {
    this.groupService.addAdmin(this.groupToEdit.groupId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Successfully promoted ' + user.firstName + ' ' + user.lastName + ' to Admin!',
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

  passOwnerStatus(user: User) {
    this.groupService.changeOwner(this.groupToEdit.groupId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Owner status succesfully changed to ' + user.firstName + ' ' + user.lastName + '!',
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

  removeAsAdmin(user: User) {
    this.groupService.removeAdmin(this.groupToEdit.groupId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' as Admin!',
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

  removeFromGroup(user: User) {
    this.groupService.removeMember(this.groupToEdit.groupId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' as Member!',
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
}
