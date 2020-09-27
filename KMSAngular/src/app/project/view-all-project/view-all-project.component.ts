import { Component, EventEmitter, Input, NgModule, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { Tag } from 'src/app/classes/tag';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/user.service';

import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';

declare var $: any;

@Component({
  selector: 'app-view-all-project',
  templateUrl: './view-all-project.component.html',
  styleUrls: ['./view-all-project.component.css']
})
export class ViewAllProjectComponent implements OnInit {

  @Input() searchModel;
  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();

  projects: Project[];
  noProjects: boolean = true;
  projectsJoined: Project[];
  loggedInUser: User;


  constructor(public projectService: ProjectService,
    public userService: UserService,
    private sessionService: SessionService,
    private router: Router) { }

  ngOnInit(): void {
    this.checkAccessRight();
    this.loggedInUser = this.sessionService.getCurrentUser();
    
    this.projectService.getAllProject().subscribe(
      response => {
        this.projects = response.projects;
        if (this.projects.length > 0) {
          this.noProjects = false;
        }
      }
    );

    this.userService.getProjectsJoined(this.loggedInUser.userId).subscribe(
      response => {
        this.projectsJoined = response;
        console.log(this.projectsJoined)
      }
    );
  }

  joinProject(project: Project) {
    console.log("******** joinProject()");
    this.projectService.joinProject(project.projectId, this.loggedInUser.userId).subscribe(
      response => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Welcome to the project',
        })
        this.userService.getProjectsJoined(this.loggedInUser.userId).subscribe(
          response => {
            this.projectsJoined = response;
            console.log(this.projectsJoined)
          }
        );
        
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

  leaveProject(project: Project) {
    console.log("******** leaveProject()");
    this.projectService.removeMember(project.projectId, this.loggedInUser.userId).subscribe(
      response => {
      $(document).Toasts('create', {
        class: 'bg-success',
        title: 'Success',
        autohide: true,
        delay: 2500,
        body: 'Goodbye',
      })
      this.userService.getProjectsJoined(this.loggedInUser.userId).subscribe(
        response => {
          this.projectsJoined = response;
          console.log(this.projectsJoined)
        }
      );
    },
    error => {
      $(document).Toasts('create', {
        class: 'bg-danger',
        title: 'Error',
        autohide: true,
        delay: 2500,
        body: "Owner cannot leave the project",
      })
    });
  }

  updateSearchModel(value) {
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }

  onSelect(project: Project): void {
    this.router.navigate(["/projectDetails/" + project.projectId]);
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

  isMember(projectId: number): boolean {
    return this.projectsJoined
      .map((project) => project.projectId)
      .includes(projectId);
  }
}

