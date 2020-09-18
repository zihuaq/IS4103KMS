import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  projectId: number;
  projectToView: Project;

  constructor(public projectService: ProjectService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.checkAccessRight();
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    console.log("Project ID: " + this.projectId);
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
