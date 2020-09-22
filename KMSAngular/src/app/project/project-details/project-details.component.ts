import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';
import { UserService } from '../../user.service';

declare var $: any;

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  projectId: number;
  projectToView: Project;
  owner: User;
  startDate: string;
  endDate: string;
  isMember: boolean = false;
  isAdmin: boolean = false;

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
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    console.log("Project ID: " + this.projectId);

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToView = response;
        console.log(this.projectToView.name);
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
        console.log(this.projectToView.projectMembers);
        this.startDate = this.projectToView.startDate.toString().substring(0,10);
        this.endDate = this.projectToView.endDate.toString().substring(0,10);
      }
    )
  }

  joinProject() {
    console.log("******** joinProject()");
    this.projectService.joinProject(this.projectId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-sucess',
          title: 'Sucess',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the project',
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

  leaveProject() {
    this.projectService.removeMember(this.projectId, this.sessionService.getCurrentUser().userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-sucess',
        title: 'Sucess',
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
}
