import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/services/group.service';
// import { Tag } from 'src/app/classes/tag';
// import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-create-new-group',
  templateUrl: './create-new-group.page.html',
  styleUrls: ['./create-new-group.page.scss'],
})
export class CreateNewGroupPage implements OnInit {

  newGroup: Group;
  // tagList: Tag[];
  currentUserId: number;

  constructor(public toastController: ToastController,
    private router: Router,
    private groupService: GroupService,
    // private tagService: TagService,
    private authenticationService: AuthenticationService) { 
      this.newGroup = new Group();
    }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );
  }

  ionViewWillEnter() {
    // this.tagService.getAllSDGTags().subscribe(
    //   response => {
    //     this.tagList = response;
    //   }
    // )
  }

  create(createGroupForm: NgForm) {
    // let tagIds: number[] = [];
    // for (let tag of this.newGroup.sdgs) {
    //   tagIds.push(tag.tagId);
    // }
    // this.newGroup.sdgs = [];
    if (createGroupForm.valid) {
      //this.newGroup.dateCreated = new Date();
      this.groupService.createNewGroup(this.newGroup, this.currentUserId,).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Group created successfully.',
            duration: 2000
          });
          toast.present();
          this.router.navigate(["group-details/" + response.groupId]);
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
