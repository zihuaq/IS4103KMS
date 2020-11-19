import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/classes/project';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { ProjectService } from 'src/app/project.service';
import { UserService } from 'src/app/user.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  @Input() profile: User;
  @Input() shared: boolean;
  @Output() userChanged = new EventEmitter<User>();

  projectsJoined: Project[];
  noProjects: boolean = true;

  constructor(
    public projectService: ProjectService,
    public userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService
      .getProjectsJoined(this.profile.userId)
      .subscribe((response) => {
        this.projectsJoined = response;
        if (this.projectsJoined.length > 0) {
          this.noProjects = false;
        }
      });
  }

  onSelect(project: Project): void {
    this.router.navigate(['/projectDetails/' + project.projectId + "/basic-details"]);
  }

  get projectType(): typeof ProjectType {
    return ProjectType;
  }
}
