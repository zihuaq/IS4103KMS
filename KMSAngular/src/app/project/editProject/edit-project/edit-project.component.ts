import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';

declare var $: any;

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css']
})
export class EditProjectComponent implements OnInit {

  @Input() projectToEdit: Project;
  @Output() projectChanged = new EventEmitter<Project>();
  projectId: number;
  isOwner: boolean = false;

  constructor(private projectService: ProjectService,
    private userService: UserService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { 
      this.projectToEdit = new Project();
    }

  ngOnInit(): void {
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));

    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToEdit = response;
        if (this.projectToEdit.projectOwner.userId == this.sessionService.getCurrentUser().userId) {
          this.isOwner = true;
        }
      }, 
      error => {
        this.router.navigate(["/error"]);
      }
    );
  }

  back() {
    this.router.navigate(["/projectDetails/" + this.projectToEdit.projectId + "/basic-details"]);
  }

  handleProjectChanged(event) {
    this.projectToEdit = event;
    this.projectChanged.emit(this.projectToEdit);
  }

  updateProject() {
    this.projectService.updateProject(this.projectToEdit).subscribe(
      response => {
        this.projectChanged.emit(this.projectToEdit);
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Project updated',
        });
      },
      error => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    )
  }

  deleteProject() {
    if (this.isOwner) {
      this.projectService.deleteProject(this.projectId).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Project deleted successfully',
          });
          this.router.navigate(["/viewAllProjects"]);
        }
      );
    } else {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: "Only owner of project can delete this project",
      });
    }
  }
}
