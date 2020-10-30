import { SharePostModalPage } from './../../../share-post-modal/share-post-modal.page';
import { UserService } from './../../../../services/user.service';
import { PostService } from './../../../../services/post.service';
import { Post } from './../../../../classes/post';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/services/group.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss']
})
export class GroupDetailsPage implements OnInit {
  groupId: number;
  group: Group;
  owner: User;
  //dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  noOfMembers: number;
  loggedInUser: User;
  segment: string;
  newsfeedPosts: Post[];

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public alertController: AlertController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupService: GroupService,
    private authenticationService: AuthenticationService,
    private location: Location,
    private userService: UserService,
    private app: ApplicationRef,
    private postService: PostService,
    private actionSheetController: ActionSheetController
  ) {
    this.group = new Group();
    this.owner = new User();
    this.segment = 'newsfeed';
  }

  ngOnInit() {
    console.log('ngOnInit ');
    this.refreshGroup();
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ');
    this.refreshGroup();
  }

  ionViewDidEnter() {
    this.refreshGroup();
    console.log('ionViewDidEnter ');
  }

  refreshGroup() {
    this.groupId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('groupId')
    );
    this.authenticationService.getCurrentUser().then((user: User) => {
      let loggedInUserId = user.userId;
      forkJoin([
        this.userService.getUser(loggedInUserId.toString()),
        this.postService.getPostForGroupNewsfeed(this.groupId),
        this.groupService.getGroupById(this.groupId)
      ]).subscribe((result) => {
        this.loggedInUser = result[0];
        this.newsfeedPosts = result[1];
        this.group = result[2];
        this.noOfMembers = this.group.groupMembers.length;

        this.owner = this.group.groupOwner;

        // this.dateCreated = this.group.dateCreated.toString().slice(0,10);

        for (let admin of this.group.groupAdmins) {
          if (this.loggedInUser.userId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
            console.log('User is admin.');
          }
        }

        if (!this.isAdmin) {
          for (let member of this.group.groupMembers) {
            if (this.loggedInUser.userId == member.userId) {
              this.isMember = true;
              console.log('User is member.');
            }
          }
        }
        this.app.tick();
      });
    });
  }

  goBack() {
    this.location.back();
  }

  joinGroup() {
    this.groupService
      .joinGroup(this.groupId, this.loggedInUser.userId)
      .subscribe(async (response) => {
        const toast = await this.toastController.create({
          message: 'Welcome to the group.',
          duration: 2000
        });
        toast.present();
        this.isMember = true;
      });
  }

  leaveGroup() {
    this.groupService
      .removeMember(this.groupId, this.loggedInUser.userId)
      .subscribe(
        async (response) => {
          const toast = await this.toastController.create({
            message: 'Goodbye.',
            duration: 2000
          });
          toast.present();
          this.isMember = false;
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: error,
            duration: 2000
          });
          toast.present();
        }
      );
  }

  checkAdmin(user: User): boolean {
    for (let member of this.group.groupAdmins) {
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
    this.router.navigate(['tab-panel/group/' + this.groupId]);
  }

  async leaveGroupDialog() {
    const alert = await this.alertController.create({
      header: 'Leave Group',
      message: 'Are you sure you want to leave this group?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Leave',
          handler: () => {
            this.leaveGroup();
          }
        }
      ]
    });

    await alert.present();
  }

  async reportGroup() {
    const modal = await this.modalController.create({
      component: ReportGroupPage,
      componentProps: { groupId: this.groupId }
    });
    return await modal.present();
  }

  async groupActionSheet() {
    let actionSheet;
    if (this.isMember) {
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Leave Group',
            icon: 'exit',
            handler: () => {
              this.leaveGroupDialog();
            }
          },
          {
            text: 'Share Group',
            icon: 'arrow-redo',
            handler: () => {
              this.share();
            }
          }
        ]
      });
    } else {
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Report Group',
            icon: 'flag',
            handler: async () => {
              console.log('Report chosen');
              this.reportGroup();
            }
          }
        ]
      });
    }
    actionSheet.onDidDismiss().then(() => {
      console.log('Dismissed');
    });

    await actionSheet.present();
  }

  async share() {
    console.log('share', this.groupId);
    const modal = await this.modalController.create({
      component: SharePostModalPage,
      swipeToClose: true,
      showBackdrop: true,
      cssClass: 'share-post-modal',
      componentProps: {
        groupId: this.groupId,
        loggedInUser: this.loggedInUser
      }
    });
    modal.present();
    modal.onDidDismiss().then(() => {
      this.refreshGroup();
    });
  }
}
