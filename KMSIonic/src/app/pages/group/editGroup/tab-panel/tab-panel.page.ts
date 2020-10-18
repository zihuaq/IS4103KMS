import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/services/group.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-tab-panel',
  templateUrl: './tab-panel.page.html',
  styleUrls: ['./tab-panel.page.scss'],
})
export class TabPanelPage implements OnInit {

  groupId: number;
  groupToEdit: Group;
  owner: User;
  dateCreated: string;
  noOfMembers: number;
  currentUserId: number;  
  segment: string;
  isOwner: boolean = false;

  constructor(public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.groupToEdit = new Group();
      this.owner = new User();
      this.segment = "details";
    }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );
  }

  ionViewWillEnter() {
    this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get("groupId"));
    this.groupService.getGroupById(this.groupId).subscribe(
      async response => {
        this.groupToEdit = response;
        if (this.groupToEdit.groupOwner.userId == this.currentUserId) {
          this.isOwner = true;
        }
        this.noOfMembers = this.groupToEdit.groupMembers.length;

        this.owner = this.groupToEdit.groupOwner;

        this.dateCreated = this.groupToEdit.dateCreated.toString().slice(0,10);
      }
    )
  }

  async segmentChanged() {
    this.segment;
  }

  deleteGroup() {
    if (this.isOwner) {
      this.groupService.deleteGroup(this.groupId).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Group deleted successfully.',
            duration: 2000
          });
          toast.present();
          this.router.navigate(["view-all-group"]);
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

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Delete Group",
      message: "Are you sure you want to delete this group?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: "Delete",
          handler: () => {
            this.deleteGroup();
          }
        }
      ]
    });

    await alert.present();
  }
}
