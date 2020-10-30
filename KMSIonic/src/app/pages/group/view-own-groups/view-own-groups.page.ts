import { Tag } from './../../../classes/tag';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/services/group.service';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Tag } from 'src/app/classes/tag';

@Component({
  selector: 'app-view-own-groups',
  templateUrl: './view-own-groups.page.html',
  styleUrls: ['./view-own-groups.page.scss']
})
export class ViewOwnGroupsPage implements OnInit {
  @ViewChild('searchBar') searchBar: IonSearchbar;
  groupsJoined: Group[];
  groupsManaged: Group[];
  groupsOwned: Group[];
  noGroups: boolean = true;
  loggedInUser: User;
  filteredGroups: Group[];
  preliminarySearchGroup: Group[];

  constructor(
    private location: Location,
    private groupService: GroupService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.loggedInUser = new User();
    this.groupsJoined = [];
    this.groupsManaged = [];
    this.groupsOwned = [];
  }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUser = user;
    });
  }

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then((user: User) => {
      this.loggedInUser = user;

      this.userService
        .getGroupsJoined(this.loggedInUser.userId)
        .subscribe((response) => {
          this.groupsJoined = response;
          this.filteredGroups = this.groupsJoined;
          if (this.groupsJoined.length > 0) {
            this.noGroups = false;
          }
        });

      this.userService
        .getGroupsManaged(this.loggedInUser.userId)
        .subscribe((response) => {
          this.groupsManaged = response;
        });

      this.userService
        .getGroupsOwned(this.loggedInUser.userId)
        .subscribe((response) => {
          this.groupsOwned = response;
        });
    });
  }

  setFilteredItems(searchTerm) {
    console.log(searchTerm);

    if (searchTerm && searchTerm != '') {
      this.filteredGroups = this.groupsJoined.filter((group) => {
        return group.name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    } else {
      this.filteredGroups = this.groupsJoined;
    }
    this.preliminarySearchGroup = this.filteredGroups.slice(0, 6);
  }

  goBack() {
    this.location.back();
  }

  viewGroupDetails(event, group) {
    this.router.navigate(['group-details/' + group.groupId]);
  }

  createGroup() {
    this.router.navigate(['create-new-group']);
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => a.tagId - b.tagId);
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }
}
