import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/services/project.service';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/services/tag.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.page.html',
  styleUrls: ['./create-new-project.page.scss'],
})
export class CreateNewProjectPage implements OnInit {

  newProject: Project;
  tagList: Tag[];
  currentUserId: number;

  constructor(public toastController: ToastController,
    private router: Router,
    private projectService: ProjectService,
    private tagService: TagService,
    private authenticationService: AuthenticationService) { 
      this.newProject = new Project();
      this.tagList = [];
    }

  ngOnInit() {
    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.currentUserId = user.userId;
      }
    );
  }

  ionViewWillEnter() {
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tagList = response;
      }
    )
  }

  create(createProjectForm: NgForm) {
    let tagIds: number[] = [];
    for (let tag of this.newProject.sdgs) {
      tagIds.push(tag.tagId);
    }
    this.newProject.sdgs = [];
    if (createProjectForm.valid) {
      this.newProject.dateCreated = new Date();
      this.projectService.createNewProject(this.newProject, this.currentUserId, tagIds).subscribe(
        async response => {
          const toast = await this.toastController.create({
            message: 'Project created successfully.',
            duration: 2000
          });
          toast.present();
          this.router.navigate(["project-details/" + response.projectId]);
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
