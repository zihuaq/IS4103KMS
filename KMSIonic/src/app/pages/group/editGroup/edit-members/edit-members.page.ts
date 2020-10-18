import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Group } from 'src/app/classes/group';
import { GroupService } from 'src/app/services/group.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.page.html',
  styleUrls: ['./edit-members.page.scss'],
})
export class EditMembersPage implements OnInit {

  groupId: number;
  group: Group;
  owner: User;
  dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  noOfMembers: number;
  currentUserId: number;
  segment: string;
  isOwner: boolean = false;

  constructor(public actionSheetController: ActionSheetController,
    public toastController: ToastController,
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
    this.refreshGroup();
  }

  ionViewWillEnter() {
    this.refreshGroup();
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
        if (this.group.groupOwner.userId == this.currentUserId) {
          this.isOwner = true;
        }
        this.noOfMembers = this.group.groupMembers.length;

        this.owner = this.group.groupOwner;

        this.dateCreated = this.group.dateCreated.toString().slice(0,10);

        for (let admin of this.group.groupAdmins) {
          if (this.currentUserId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
          }
        }

        if (!this.isAdmin) {
          for (let member of this.group.groupMembers) {
            if (this.currentUserId == member.userId) {
              this.isMember = true;
            }
          }
        }
      }
    )
  }

  checkAdmin(user: User): boolean {
    for(let member of this.group.groupAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  removeMember(user: User) {
    this.groupService.removeMember(this.groupId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' as Member!.',
          duration: 2000
        });
        this.groupService.getGroupById(this.groupId).subscribe(
          async response => {
            this.group = response;
            if (this.group.groupOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.group.groupMembers.length;
    
            this.owner = this.group.groupOwner;
    
            this.dateCreated = this.group.dateCreated.toString().slice(0,10);
    
            for (let admin of this.group.groupAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.group.groupMembers) {
                if (this.currentUserId == member.userId) {
                  this.isMember = true;
                }
              }
            }
          }
        )
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

  promoteToAdmin(user: User) {
    this.groupService.addAdmin(this.groupId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Successfully promoted ' + user.firstName + ' ' + user.lastName + ' to Admin!',
          duration: 2000
        });
        toast.present();
        this.groupService.getGroupById(this.groupId).subscribe(
          async response => {
            this.group = response;
            if (this.group.groupOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.group.groupMembers.length;
    
            this.owner = this.group.groupOwner;
    
            this.dateCreated = this.group.dateCreated.toString().slice(0,10);
    
            for (let admin of this.group.groupAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.group.groupMembers) {
                if (this.currentUserId == member.userId) {
                  this.isMember = true;
                }
              }
            }
          }
        )
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

  removeAsAdmin(user: User) {
    this.groupService.removeAdmin(this.groupId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' to Admin!',
          duration: 2000
        });
        toast.present();
        this.groupService.getGroupById(this.groupId).subscribe(
          async response => {
            this.group = response;
            if (this.group.groupOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.group.groupMembers.length;
    
            this.owner = this.group.groupOwner;
    
            this.dateCreated = this.group.dateCreated.toString().slice(0,10);
    
            for (let admin of this.group.groupAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.group.groupMembers) {
                if (this.currentUserId == member.userId) {
                  this.isMember = true;
                }
              }
            }
          }
        )
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

  passOwnerStatus(user: User) {
    this.groupService.changeOwner(this.groupId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Owner status succesfully changed to ' + user.firstName + ' ' + user.lastName + '!',
          duration: 2000
        });
        toast.present();
        this.groupService.getGroupById(this.groupId).subscribe(
          async response => {
            this.group = response;
            if (this.group.groupOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.group.groupMembers.length;
    
            this.owner = this.group.groupOwner;
    
            this.dateCreated = this.group.dateCreated.toString().slice(0,10);
    
            for (let admin of this.group.groupAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.group.groupMembers) {
                if (this.currentUserId == member.userId) {
                  this.isMember = true;
                }
              }
            }
          }
        )
      },
      async error => {
        const toast = await this.toastController.create({
          message: error,
          duration: 2000
        });
        toast.present();
      }
    )
  }

  async ownerActionForAdmin(user: User) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Pass Owner',
        handler: () => {
          this.passOwnerStatus(user);
        }
      }, {
        text: 'Demote to Member',
        handler: () => {
          this.removeAsAdmin(user);
        }
      }, {
        text: 'Remove Member',
        handler: () => {
          this.removeMember(user);
        }
      }]
    })
    await actionSheet.present();
  }

  async adminAction(user: User) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Prmote to Admin',
        handler: () => {
          this.promoteToAdmin(user);
        }
      }, {
        text: 'Remove Member',
        handler: () => {
          this.removeMember(user);
        }
      }]
    })
    await actionSheet.present();
  }
}
