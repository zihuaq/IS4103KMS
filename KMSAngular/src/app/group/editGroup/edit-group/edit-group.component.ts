import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/group.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';

declare var $: any;

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {

  @Input() groupToEdit: Group;
  @Output() groupChanged = new EventEmitter<Group>();
  groupId: number;
  isOwner: boolean = false;
  loggedInUser: User;

  constructor(private groupService: GroupService,
    private userService: UserService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.groupToEdit = new Group();
      this.loggedInUser = sessionService.getCurrentUser();
    }

  ngOnInit(): void {
    this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get("groupId"));

    this.groupService.getGroupById(this.groupId).subscribe(
      response => {
        this.groupToEdit = response;
        if (this.groupToEdit.groupOwner.userId == this.sessionService.getCurrentUser().userId) {
          this.isOwner = true;
        }
      },
      error => {
        this.router.navigate(["/error"]);
      }
    );
  }

  back() {
    this.router.navigate(["/groupDetails/" + this.groupToEdit.groupId + "/basic-details"]);
  }

  handleGroupChanged(event) {
    this.groupToEdit = event;
    this.groupChanged.emit(this.groupToEdit);
  }

  updateGroup() {
    this.groupService.updateGroup(this.groupToEdit).subscribe(
      response => {
        this.groupChanged.emit(this.groupToEdit);
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Group updated',
        });
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    )
  }

  deleteGroup() {
    if (this.isOwner) {
      this.groupService.deleteGroup(this.groupId).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Group deleted successfully',
          });
          this.router.navigate(["/viewAllGroups"]);
        }
      );
    } else {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: "Only owner of group can delete this group",
      });
    }
  }
}
