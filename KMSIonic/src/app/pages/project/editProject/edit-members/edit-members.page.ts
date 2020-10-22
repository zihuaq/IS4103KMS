import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-members',
  templateUrl: './edit-members.page.html',
  styleUrls: ['./edit-members.page.scss'],
})
export class EditMembersPage implements OnInit {

  projectId: number;
  project: Project;
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
    private projectService: ProjectService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.project = new Project();
      this.owner = new User();
      this.segment = "details";
    }

  ngOnInit() {
    console.log('memberTab: ngOnInit ')
    this.refreshProject();
  }

  ionViewWillEnter() {
    console.log('memberTab: ionViewWillEnter ')
    this.refreshProject();
  }

  refreshProject() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
        console.log(this.currentUserId);
      }
    );
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      async response => {
        this.project = response;
        if (this.project.projectOwner.userId == this.currentUserId) {
          this.isOwner = true;
        }
        this.noOfMembers = this.project.projectMembers.length;

        this.owner = this.project.projectOwner;

        this.dateCreated = this.project.dateCreated.toString().slice(0,10);

        for (let admin of this.project.projectAdmins) {
          if (this.currentUserId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
          }
        }

        if (!this.isAdmin) {
          for (let member of this.project.projectMembers) {
            if (this.currentUserId == member.userId) {
              this.isMember = true;
            }
          }
        }
      }
    )
  }

  checkAdmin(user: User): boolean {
    for(let member of this.project.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  removeMember(user: User) {
    this.projectService.removeMember(this.projectId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' as Member!.',
          duration: 2000
        });
        this.projectService.getProjectById(this.projectId).subscribe(
          async response => {
            this.project = response;
            if (this.project.projectOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.project.projectMembers.length;
    
            this.owner = this.project.projectOwner;
    
            this.dateCreated = this.project.dateCreated.toString().slice(0,10);
    
            for (let admin of this.project.projectAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.project.projectMembers) {
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
    this.projectService.addAdmin(this.projectId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Successfully promoted ' + user.firstName + ' ' + user.lastName + ' to Admin!',
          duration: 2000
        });
        toast.present();
        this.projectService.getProjectById(this.projectId).subscribe(
          async response => {
            this.project = response;
            if (this.project.projectOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.project.projectMembers.length;
    
            this.owner = this.project.projectOwner;
    
            this.dateCreated = this.project.dateCreated.toString().slice(0,10);
    
            for (let admin of this.project.projectAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.project.projectMembers) {
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
    this.projectService.removeAdmin(this.projectId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' to Admin!',
          duration: 2000
        });
        toast.present();
        this.projectService.getProjectById(this.projectId).subscribe(
          async response => {
            this.project = response;
            if (this.project.projectOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.project.projectMembers.length;
    
            this.owner = this.project.projectOwner;
    
            this.dateCreated = this.project.dateCreated.toString().slice(0,10);
    
            for (let admin of this.project.projectAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.project.projectMembers) {
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
    this.projectService.changeOwner(this.projectId, user.userId).subscribe(
      async response => {
        const toast = await this.toastController.create({
          message: 'Owner status succesfully changed to ' + user.firstName + ' ' + user.lastName + '!',
          duration: 2000
        });
        toast.present();
        this.projectService.getProjectById(this.projectId).subscribe(
          async response => {
            this.project = response;
            if (this.project.projectOwner.userId == this.currentUserId) {
              this.isOwner = true;
            }
            this.noOfMembers = this.project.projectMembers.length;
    
            this.owner = this.project.projectOwner;
    
            this.dateCreated = this.project.dateCreated.toString().slice(0,10);
    
            for (let admin of this.project.projectAdmins) {
              if (this.currentUserId == admin.userId) {
                this.isMember = true;
                this.isAdmin = true;
              }
            }
    
            if (!this.isAdmin) {
              for (let member of this.project.projectMembers) {
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
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })
    await actionSheet.present();
  }

  async adminAction(user: User) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Promote to Admin',
        handler: () => {
          this.promoteToAdmin(user);
        }
      }, {
        text: 'Remove Member',
        handler: () => {
          this.removeMember(user);
        }
      }, {
        text: 'Cancel',
        role: 'cancel'
      }]
    })
    await actionSheet.present();
  }
}
