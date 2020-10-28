import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/services/group.service';
import { IonSearchbar } from "@ionic/angular";
import { Tag } from 'src/app/classes/tag';

@Component({
  selector: 'app-view-all-group',
  templateUrl: './view-all-group.page.html',
  styleUrls: ['./view-all-group.page.scss'],
})
export class ViewAllGroupPage implements OnInit {

  @ViewChild("searchBar") searchBar: IonSearchbar
  groups: Group[];
  filteredGroups: Group[];
  preliminarySearchGroup: Group[];

  constructor(private location: Location,
    private groupService: GroupService,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.groupService.getAllGroup().subscribe(
      response => {
        this.groups = response.groups;
        this.filteredGroups = this.groups;
      }
    );
  }

  goBack() {
    this.location.back()
  }

  setFilteredItems(searchTerm) {
    console.log(searchTerm)

    if (searchTerm && searchTerm != "") {
      this.filteredGroups = this.groups.filter(
        (group) => {
          return group.name.toLowerCase().includes(searchTerm.toLowerCase())
        }
      )
    } else {
      this.filteredGroups = this.groups
    }
    this.preliminarySearchGroup = this.filteredGroups.slice(0, 6)
  }

  viewGroupDetails(event, group) {
    this.router.navigate(["group-details/" + group.groupId]);
  }

  createGroup() {
    this.router.navigate(["create-new-group"]);
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }

}
