import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  projectId: number;
  projectToView: Project;
  isOwner: boolean = false;
  owner: User;
  startDate: string;
  endDate: string;

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
        if (this.owner.userId == this.sessionService.getCurrentUser().userId) {
          this.isOwner = true;
        }
        this.startDate = this.projectToView.startDate.toString().substring(0,10);
        this.endDate = this.projectToView.endDate.toString().substring(0,10);
      }
    )
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
