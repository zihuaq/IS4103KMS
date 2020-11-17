import { Component, OnInit, SimpleChanges } from '@angular/core';

import { Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { Project } from '../../classes/project';
import { ProjectService } from '../../project.service';
import { SessionService } from '../../session.service';
import { Tag } from '../../classes/tag';
import { TagService } from '../../tag.service';

declare var $: any;

@Component({
  selector: 'app-create-new-project',
  templateUrl: './create-new-project.component.html',
  styleUrls: ['./create-new-project.component.css']
})
export class CreateNewProjectComponent implements OnInit {

  newProject: Project;
  ownerId: number;
  infoMessage: string;
  errorMessage: string;
  tags: Tag[];
  projectCreated = false;
  projectCreationError = false;
  tagIdsSelected: number[];
  selectedTagNames: string[];
  selectedProfilePicture: string | ArrayBuffer;
  selectedProfilePictureName: string;

  constructor(public projectService: ProjectService,
    private tagService: TagService,
    private sessionService: SessionService,
    private router: Router) {
      this.newProject = new Project();
  }

  ngOnInit(): void {
    this.checkAccessRight();

    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
        $('#sdgselect2').select2({
          data: this.tags.map((item) => {
            return item.name;
          }),
          allowClear: true,
        });
      }
    );

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
    this.newProject = changes.profile.currentValue;
  }

  getFiles(event) {
    if (event.target.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedProfilePicture = e.target.result;
        console.log(this.selectedProfilePicture);
      };
      this.selectedProfilePictureName = event.target.files[0].name;
      console.log(event.target.files[0].name);
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.selectedProfilePicture = undefined;
    }
  }

  removePicture() {
    this.selectedProfilePicture = undefined;
  }

  create(createProjectForm: NgForm) {
    this.ownerId = this.sessionService.getCurrentUser().userId;
    this.selectedTagNames = $('#sdgselect2').val();
    this.tagIdsSelected = [];
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to submit SDG tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one SDG tags',
      });
      return;
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.tagIdsSelected.push(element.tagId);
      }
    });

    if (createProjectForm.valid) {
      this.newProject.dateCreated = new Date();
      this.newProject.isActive = true;
      this.newProject.profilePicture = this.selectedProfilePicture;
      this.projectService.createNewProject(this.newProject, this.ownerId, this.tagIdsSelected).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Project created successfully',
          })
          this.router.navigate(["/projectDetails/" + response.projectId + "/basic-details"]);
          this.projectCreated = true;
          this.projectCreationError = false;
        },
        error => {
          this.infoMessage = null;
          this.errorMessage = error;
          this.projectCreationError = true;
          this.projectCreated = false;
        }
      );
    }
  }

  checkAccessRight() {
    console.log(this.sessionService.getIsLogin);
    if(!this.sessionService.getIsLogin) {
      this.router.navigate(["/login"]);
    }
  }

}
