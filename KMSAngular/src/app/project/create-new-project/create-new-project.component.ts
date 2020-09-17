import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

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

  constructor(public projectService: ProjectService,
    private sessionService: SessionService,
    private router: Router) { 
      this.newProject = new Project();

  }

  ngOnInit(): void {
    this.checkAccessRight();
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
