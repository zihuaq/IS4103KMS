import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { Router } from '@angular/router';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/tag.service';
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
  projectToLeaveId: number;
  tags: Tag[];

  constructor(public projectService: ProjectService,
    public tagService: TagService,
    public userService: UserService,
    private sessionService: SessionService,
    private router: Router) {
      this.projects = [];
      this.projectsJoined = [];
      this.tags = [];
     }

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
      }
    );

    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
        $('#sdgselect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
        $('#sdgselect2').on("change", () => {
          this.sdgFilter()
        });
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

  clickLeaveProject(project: Project) {
    this.projectToLeaveId = project.projectId;
  }

  leaveProject() {
    console.log("******** leaveProject()");
    this.projectService.removeMember(this.projectToLeaveId, this.loggedInUser.userId).subscribe(
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

  isMember(projectId: number): boolean {
    return this.projectsJoined
      .map((project) => project.projectId)
      .includes(projectId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tagService.getAllSDGTags().subscribe((response) => {
      this.tags = response;
      $('#sdgselect2').select2({
        data: this.tags.map((item) => {
          return item.name;
        }),
        allowClear: true,
      });
    });
  }

  sdgFilter() {    
    this.projectService.getAllProject().subscribe(
      response => {
        this.projects = response.projects;
        let selectedTagNames = $('#sdgselect2').val();
        if (selectedTagNames.length > 0) {
          let allProject = this.projects;
          this.projects = [];
          let selectedTag: Tag[] = [];
          this.tags.forEach((element) => {
            if (selectedTagNames.includes(element.name)) {
              selectedTag.push(element);
            }
          });
          for (let tag of selectedTag) {
            for (let project of allProject) {
              for (let sdg of project.sdgs) {
                if (sdg.name === tag.name && !this.containProject(project)) {
                  this.projects.push(project);                  
                }
              }
            }
          }
        }    
      }
    );   
  }

  containProject(project: Project) {
    for (let proj of this.projects) {
      if (project.projectId == proj.projectId) {
        return true;
      }
    }
    false;
  }
  
}

