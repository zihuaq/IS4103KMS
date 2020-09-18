import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit {

  newProject: Project;
  ownerId: number;
  infoMessage: string;
  errorMessage: string;

  constructor(public projectService: ProjectService,
    private sessionService: SessionService,
    private router: Router) { 
      this.newProject = new Project();

  }

  ngOnInit(): void {
    this.checkAccessRight();
  }

  create(createProjectForm: NgForm) {
    this.ownerId = this.sessionService.getCurrentUser().userId;
    if (createProjectForm.valid) {
      console.log(this.newProject);
      this.newProject.startDate = new Date(this.newProject.startDate);
      this.newProject.endDate = new Date(this.newProject.endDate);
      this.projectService.createNewProject(this.newProject, this.ownerId).subscribe(
        response => {
          this.infoMessage = "Project created successfully."
          this.errorMessage = null;
          // go to project details page
          this.router.navigate(["/index"]);
        },
        error => {
          this.infoMessage = null;
          this.errorMessage = error;
        }
      );
    }
  }

  checkAccessRight() {
    console.log(this.sessionService.getIsLogin);
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
