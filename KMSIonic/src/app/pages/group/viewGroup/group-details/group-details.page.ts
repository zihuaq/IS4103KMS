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
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
})
export class GroupDetailsPage implements OnInit {

  groupId: number;
  group: Group;
  owner: User;
  dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  noOfMembers: number;
  currentUserId: number;
  segment: string;

  constructor(public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.group = new Group();
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
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
        console.log(this.currentUserId);
      }
    );
    this.groupId = parseInt(this.activatedRoute.snapshot.paramMap.get("groupId"));
    this.groupService.getGroupById(this.groupId).subscribe(
      async response => {
        this.group = response;
        this.noOfMembers = this.group.groupMembers.length;

        this.owner = this.group.groupOwner;

        // this.dateCreated = this.group.dateCreated.toString().slice(0,10);

        for (let admin of this.group.groupAdmins) {
          if (this.currentUserId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
            console.log("User is admin.");
          }
        }

        if (!this.isAdmin) {
          for (let member of this.group.groupMembers) {
            if (this.currentUserId == member.userId) {
              this.isMember = true;
              console.log("User is member.");
            }
          }
        }
      }
    )
  }

  goBack() {
    this.location.back()
  }

  joinGroup() {
    this.groupService.joinGroup(this.groupId, this.currentUserId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Welcome to the group.',
          duration: 2000
        });
        toast.present();
        this.isMember = true;
      }
    );
  }

  leaveGroup() {
    this.groupService.removeMember(this.groupId, this.currentUserId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Goodbye.',
          duration: 2000
        });
        toast.present();
        this.isMember = false;
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

  checkAdmin(user: User): boolean {
    for(let member of this.group.groupAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  async segmentChanged() {
    this.segment;
  }

  editGroup() {
    this.router.navigate(["tab-panel/group/" + this.groupId]);
  }

  async leaveGroupDialog() {
    const alert = await this.alertController.create({
      header: "Leave Group",
      message: "Are you sure you want to leave this group?",
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: "Leave",
          handler: () => {
            this.leaveGroup();
          }
        }
      ]
    });

    await alert.present();
  }

}
