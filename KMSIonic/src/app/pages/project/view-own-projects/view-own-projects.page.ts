import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from '@angular/router';
import { IonSearchbar } from "@ionic/angular";

import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { Tag } from 'src/app/classes/tag';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-view-own-projects',
  templateUrl: './view-own-projects.page.html',
  styleUrls: ['./view-own-projects.page.scss'],
})
export class ViewOwnProjectsPage implements OnInit {

  @ViewChild("searchBar") searchBar: IonSearchbar
  projectsJoined: Project[];
  projectsManaged: Project[];
  projectsOwned: Project[];
  noProjects: boolean = true;
  loggedInUser: User;
  filteredProjects: Project[];
  preliminarySearchProject: Project[];

  constructor(private location: Location,
    private projectService: ProjectService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router) { 
      this.loggedInUser = new User();
      this.projectsJoined = [];
      this.projectsManaged = [];
      this.projectsOwned = [];
    }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.loggedInUser = user;
      }
    );
  }

  ionViewWillEnter() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.loggedInUser = user;

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
    );    
  }

  setFilteredItems(searchTerm) {
    console.log(searchTerm)

    if (searchTerm && searchTerm != "") {
      this.filteredProjects = this.projectsOwned.filter(
        (project) => {
          return project.name.toLowerCase().includes(searchTerm.toLowerCase())
        }
      )
    } else {
      this.filteredProjects = this.projectsOwned
    }
    this.preliminarySearchProject = this.filteredProjects.slice(0, 6)
  }

  goBack() {
    this.location.back()
  }

  viewProjectDetails(event, project) {
    this.router.navigate(["project-details/" + project.projectId]);
  }

  createProject() {
    this.router.navigate(["create-new-project"]);
  }

  sortSDG(sdgList: Tag[]): Tag[] {
    return sdgList.sort((a, b) => (a.tagId - b.tagId));
  }
}
