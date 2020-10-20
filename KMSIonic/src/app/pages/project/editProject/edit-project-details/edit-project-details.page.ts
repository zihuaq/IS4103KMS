import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-edit-project-details',
  templateUrl: './edit-project-details.page.html',
  styleUrls: ['./edit-project-details.page.scss'],
})
export class EditProjectDetailsPage implements OnInit {

  projectId: number;
  projectToEdit: Project;
  owner: User;
  dateCreated: string;
  noOfMembers: number;
  currentUserId: number;  
  segment: string;
  tagList: Tag[];
  tagListString: string[];
  selectedTagNames: string[] = [];
  projectStatusList: ProjectType[];

  constructor(public toastController: ToastController,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private tagService: TagService,
    private authenticationService: AuthenticationService,
    private location: Location) { 
      this.projectToEdit = new Project();
      this.owner = new User();
      this.segment = "details";
    }

  ngOnInit() {    
    console.log('detailsTab: ngOnInit ')
    this.refreshProject();
  }

  refreshProject() {
    this.projectService.getProjectStatusList().subscribe(
      response => {
        this.projectStatusList = response;
      }
    );

    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );

    this.tagService.getAllSDGTags().subscribe(      
      response => {
        this.tagListString = [];
        this.tagList = response;
        for (let tag of this.tagList) {
          this.tagListString.push(tag.name);
        }
      }
    );

    // this.selectedTagNames = [];
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToEdit = response;
        this.noOfMembers = this.projectToEdit.projectMembers.length;
        this.owner = this.projectToEdit.projectOwner;

        this.dateCreated = this.projectToEdit.dateCreated.toString().slice(0,10);

        for (let tag of this.projectToEdit.sdgs) {
          this.selectedTagNames.push(tag.name);       
        }
      }
    );
  }

  async segmentChanged() {
    this.segment;
  }

  edit(editProjectForm: NgForm) {
    this.projectToEdit.sdgs = [];
    for (let tagString of this.selectedTagNames) {
      for (let tag of this.tagList) {
        if (tag.name == tagString) {
          this.projectToEdit.sdgs.push(tag);
        }
      }
    }
    if (editProjectForm.valid) {
      this.projectToEdit.dateCreated = new Date();
      this.projectService.updateProject(this.projectToEdit).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Project updated successfully.',
            duration: 2000
          });
          toast.present();
        },
        async error => {
          const toast = await this.toastController.create({
            message: error,
            duration: 2000
          });
          toast.present();
        }
      );
    }
  }
}
