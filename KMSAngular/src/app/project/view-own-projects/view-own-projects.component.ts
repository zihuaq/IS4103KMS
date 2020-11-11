import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/classes/project';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { ProjectService } from 'src/app/project.service';
import { SessionService } from 'src/app/session.service';
import { UserService } from 'src/app/user.service';

declare var $: any;

@Component({
  selector: 'app-view-own-projects',
  templateUrl: './view-own-projects.component.html',
  styleUrls: ['./view-own-projects.component.css']
})
export class ViewOwnProjectsComponent implements OnInit {

  @Input() searchModel;
  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();

  projectsJoined: Project[];
  projectsManaged: Project[];
  projectsOwned: Project[];
  noProjects: boolean = true;
  loggedInUser: User;

  constructor(public projectService: ProjectService,
    public userService: UserService,
    private sessionService: SessionService,
    private router: Router) {
      this.projectsJoined = [];
      this.projectsManaged = [];
      this.projectsOwned = [];
     }

  ngOnInit(): void {
    this.checkAccessRight();
    this.loggedInUser = this.sessionService.getCurrentUser();

    this.userService.getProjectsJoined(this.loggedInUser.userId).subscribe(
      response => {
        this.projectsJoined = response;
        if (this.projectsJoined.length > 0) {
          this.noProjects = false;
        }
      }
    );

    this.userService.getProjectsManaged(this.loggedInUser.userId).subscribe(
      response => {
        this.projectsManaged = response;
      }
    );

    this.userService.getProjectsOwned(this.loggedInUser.userId).subscribe(
      response => {
        this.projectsOwned = response;
      }
    );
  }

  updateSearchModel(value) {
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }

  onSelect(project: Project): void {
    this.router.navigate(["/projectDetails/" + project.projectId + "/basic-details"]);
  }

  checkAccessRight() {
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

  get projectType(): typeof ProjectType{
    return ProjectType;
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }

  isAdmin(projectId: number): boolean {
    return this.projectsManaged
      .map((project) => project.projectId)
      .includes(projectId);
  }

  isOwner(projectId: number): boolean {
    return this.projectsOwned
      .map((project) => project.projectId)
      .includes(projectId);
  }

}
