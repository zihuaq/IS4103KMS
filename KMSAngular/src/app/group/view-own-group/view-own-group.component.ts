import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from 'src/app/classes/group';

import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { GroupService } from 'src/app/group.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';

declare var $: any;

@Component({
  selector: 'app-view-own-group',
  templateUrl: './view-own-group.component.html',
  styleUrls: ['./view-own-group.component.css']
})
export class ViewOwnGroupComponent implements OnInit {

  @Input() searchModel;
  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();

  groupsJoined: Group[];
  groupsManaged: Group[];
  groupsOwned: Group[];
  noGroups: boolean = true;
  loggedInUser: User;

  constructor(public groupService: GroupService,
    public userService: UserService,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkAccessRight();
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.userService.getGroupsJoined(this.loggedInUser.userId).subscribe(
      response => {
        this.groupsJoined = response;
        if (this.groupsJoined.length > 0) {
          this.noGroups = false;
        }
      }
    );

    this.userService.getGroupsManaged(this.loggedInUser.userId).subscribe(
      response => {
        this.groupsManaged = response;
      }
    );

    this.userService.getGroupsOwned(this.loggedInUser.userId).subscribe(
      response => {
        this.groupsOwned = response;
      }
    );
  }

  updateSearchModel(value) {
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }

  onSelect(group: Group): void {
    this.router.navigate(["/groupDetails/" + group.groupId + "/basic-details"]);
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }



  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }

  isAdmin(groupId: number): boolean {
    return this.groupsManaged
      .map((group) => group.groupId)
      .includes(groupId);
  }

  isOwner(groupId: number): boolean {
    return this.groupsOwned
      .map((group) => group.groupId)
      .includes(groupId);
  }

}

