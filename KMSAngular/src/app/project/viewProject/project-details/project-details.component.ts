import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';
import { ProjectType } from 'src/app/classes/project-type.enum';

declare var $: any;

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  loaded: boolean = false;
  projectId: number;
  projectToView: Project;
  loggedInUser: User
  owner: User;
  dateCreated: string;
  isMember: boolean = false;
  isAdmin: boolean = false;
  profilePicture: string | ArrayBuffer;
  selectedProfilePicture: string | ArrayBuffer;
  selectedProfilePictureName: string;
  noOfMembers: number;

  constructor(public projectService: ProjectService,
    private userService: UserService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { 
      this.projectToView = new Project();
      this.owner = new User();
    }

  ngOnInit(): void {
    this.checkAccessRight();
    this.loggedInUser = this.sessionService.getCurrentUser();
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToView = response;
        this.loaded = true;
        this.noOfMembers = this.projectToView.projectMembers.length;
        this.profilePicture = this.projectToView.profilePicture;
        //console.log(this.profilePicture);
        this.owner = this.projectToView.projectOwner;

        for (let admin of this.projectToView.projectAdmins) {
          if (this.sessionService.getCurrentUser().userId == admin.userId) {
            this.isMember = true;
            this.isAdmin = true;
          }
        }

        if (!this.isAdmin) {
          for (let member of this.projectToView.projectMembers) {
            if (this.sessionService.getCurrentUser().userId == member.userId) {
              this.isMember = true;
            }
          }
        }
        this.dateCreated = this.projectToView.dateCreated.toString().substring(0,10);
      }, 
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        })
        this.router.navigate(["/error"]);
      }
    )
  }

  joinProject() {
    console.log("******** joinProject()");
    this.projectService.joinProject(this.projectId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the project',
        });
        location.reload();
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      });  
  }

  leaveProject() {
    this.projectService.removeMember(this.projectId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Goodbye',
      })
      location.reload();
    },
    error => {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: error,
      })
    });
  }

  onSelect() {
    this.router.navigate(["/editProject/" + this.projectId]);
  }

  checkAdmin(user: User): boolean {
    for(let member of this.projectToView.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

  getFiles(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedProfilePicture = e.target.result;
        //console.log(this.selectedProfilePicture);
      };
      this.selectedProfilePictureName = event.target.files[0].name;
      //console.log(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedProfilePicture = undefined;
    }
  }

  removePicture() {
    if (this.profilePicture != undefined) {
      this.profilePicture = undefined;
      this.selectedProfilePicture = undefined;
    }
  }

  saveChanges() {
    this.projectToView.profilePicture = this.selectedProfilePicture;
    this.projectService.updateProject(this.projectToView).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Profile picture updated successfully',
        })
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-warning',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    );
    this.profilePicture = this.selectedProfilePicture;
    this.selectedProfilePicture = undefined;
  }

  cancel() {
    this.profilePicture = this.projectToView.profilePicture;
    this.selectedProfilePicture = undefined;
  }

  get projectType(): typeof ProjectType{
    return ProjectType;
  }
  
}
