import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';

@Component({
  selector: 'app-view-all-project',
  templateUrl: './view-all-project.component.html',
  styleUrls: ['./view-all-project.component.css']
})
export class ViewAllProjectComponent implements OnInit {

  projects: Project[];

  constructor(public projectService: ProjectService,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkAccessRight();
    
    this.projectService.getAllProject().subscribe(
      response => {
        this.projects = response.projects;
      }
    )
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
