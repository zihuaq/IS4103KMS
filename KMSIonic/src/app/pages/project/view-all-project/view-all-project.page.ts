import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { IonSearchbar } from "@ionic/angular";

@Component({
  selector: 'app-view-all-project',
  templateUrl: './view-all-project.page.html',
  styleUrls: ['./view-all-project.page.scss'],
})
export class ViewAllProjectPage implements OnInit {

  @ViewChild("searchBar") searchBar: IonSearchbar
  projects: Project[];
  filteredProjects: Project[];
  preliminarySearchProject: Project[];

  constructor(private location: Location,
    private projectService: ProjectService,
    private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.projectService.getAllProject().subscribe(
      response => {
        this.projects = response.projects;
        this.filteredProjects = this.projects;
      }
    );
  }

  goBack() {
    this.location.back()
  }

  setFilteredItems(searchTerm) {
    console.log(searchTerm)

    if (searchTerm && searchTerm != "") {
      this.filteredProjects = this.projects.filter(
        (project) => {
          return project.name.toLowerCase().includes(searchTerm.toLowerCase())
        }
      )
    } else {
      this.filteredProjects = this.projects
    }
    this.preliminarySearchProject = this.filteredProjects.slice(0, 6)
  }

  viewProjectDetails(event, project) {
    this.router.navigate(["project-details/" + project.projectId]);
  }

  createProject() {
    this.router.navigate(["create-new-project"]);
  }

}
