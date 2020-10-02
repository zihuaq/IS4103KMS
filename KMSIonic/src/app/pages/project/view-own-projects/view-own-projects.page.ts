import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-view-own-projects',
  templateUrl: './view-own-projects.page.html',
  styleUrls: ['./view-own-projects.page.scss'],
})
export class ViewOwnProjectsPage implements OnInit {

  projects: Project[];

  constructor(private location: Location,
    private projectService: ProjectService,
    private router: Router) { }

  ngOnInit() {
  }

  

}
