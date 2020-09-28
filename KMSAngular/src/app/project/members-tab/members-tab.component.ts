import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';

import { ActivatedRoute} from '@angular/router';

import { Project } from 'src/app/classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';
import { User } from '../../classes/user';

declare var $: any;

@Component({
  selector: 'app-members-tab',
  templateUrl: './members-tab.component.html',
  styleUrls: ['./members-tab.component.css']
})
export class MembersTabComponent implements OnInit {

  @Input() projectToEdit: Project;
  @Output() projectChanged = new EventEmitter<Project>();
  projectId: number;
  loggedInUser: User;
  isOwner: boolean = false;

  constructor(public projectService: ProjectService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    console.log("Project ID: " + this.projectId);
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToEdit = response;
        if (this.projectToEdit.projectOwner.userId == this.loggedInUser.userId) {
          this.isOwner = true;
        }
      }
    );
  }

  isAdmin(user: User): boolean {
    for(let member of this.projectToEdit.projectAdmins) {
      if (member.userId == user.userId) {
        return true;
      }
    }
    return false;
  }

  promoteToAdmin(user: User) {
    this.projectService.addAdmin(this.projectToEdit.projectId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Successfully promoted ' + user.firstName + ' ' + user.lastName + ' to Admin!',
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

  passOwnerStatus(user: User) {
    this.projectService.changeOwner(this.projectToEdit.projectId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Owner status succesfully changed to ' + user.firstName + ' ' + user.lastName + '!',
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

  removeAsAdmin(user: User) {
    this.projectService.removeAdmin(this.projectToEdit.projectId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' as Admin!',
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

  removeFromProject(user: User) {
    this.projectService.removeMember(this.projectToEdit.projectId, user.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Successfully removed ' + user.firstName + ' ' + user.lastName + ' as Member!',
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
}
