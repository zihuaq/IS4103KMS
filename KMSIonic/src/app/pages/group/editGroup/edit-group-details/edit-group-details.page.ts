import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { User } from 'src/app/classes/user';
import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/services/group.service';
import { GroupType } from 'src/app/classes/group-type.enum';
// import { Tag } from 'src/app/classes/tag';
// import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-group-details',
  templateUrl: './edit-group-details.page.html',
  styleUrls: ['./edit-group-details.page.scss'],
})
export class EditGroupDetailsPage implements OnInit {

  groupId: number;
  groupToEdit: Group;
  owner: User;
  //dateCreated: string;
  noOfMembers: number;
  currentUserId: number;  
  segment: string;
  // tagList: Tag[];
  selectedTagNames: string[];
  groupStatusList: GroupType[];

  constructor(public toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    // private tagService: TagService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.groupToEdit = new Group();
      this.owner = new User();
      this.segment = "details";
    }

  ngOnInit() {    
    console.log('ngOnInit ')
    this.refreshGroup();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ')
    this.refreshGroup();
  }

  ionViewDidEnter() {
    this.refreshGroup();
    console.log('ionViewDidEnter ')
  }

  refreshGroup() {
    this.groupService.getGroupStatusList().subscribe(
      response => {
        this.groupStatusList = response;
      }
    );

    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );

    // this.tagService.getAllSDGTags().subscribe(
    //   response => {
    //     this.tagList = response;
    //   }
    // );

    // this.selectedTagNames = [];
    this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get("groupId"));
    this.groupService.getGroupById(this.groupId).subscribe(
      async response => {
        this.groupToEdit = response;
        this.noOfMembers = this.groupToEdit.groupMembers.length;

        this.owner = this.groupToEdit.groupOwner;

        //this.dateCreated = this.groupToEdit.dateCreated.toString().slice(0,10);

        // for (let tag of this.groupToEdit.sdgs) {
        //   this.selectedTagNames.push(tag.name);
        //   console.log("Tags: " + tag.name);          
        // }
      }
    );
  }

  async segmentChanged() {
    this.segment;
  }

  edit(editGroupForm: NgForm) {
    //this.groupToEdit.sdgs = [];
    // for (let tagString of this.selectedTagNames) {
    //   for (let tag of this.tagList) {
    //     if (tag.name == tagString) {
    //       this.groupToEdit.sdgs.push(tag);
    //     }
    //   }
    // }
    if (editGroupForm.valid) {
      //this.groupToEdit.dateCreated = new Date();
      this.groupService.updateGroup(this.groupToEdit).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Group updated successfully.',
            duration: 2000
          });
          toast.present();
        },
        async error => {
          const toast = await this.toastController.create({
            message: error,
            duration: 2000
          });
          toast.present();
        }
      );
    }
  }
}
