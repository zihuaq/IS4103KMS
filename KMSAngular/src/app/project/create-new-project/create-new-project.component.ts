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
  minDate = new Date().toISOString().slice(0, 10);
  minEndDate = new Date().toISOString().slice(0, 10);
  tagIdsSelected: number[];
  selectedTagNames: string[];

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
      console.log(this.newProject);
      this.newProject.startDate = new Date(this.newProject.startDate);
      this.newProject.endDate = new Date(this.newProject.endDate);
      this.projectService.createNewProject(this.newProject, this.ownerId, this.tagIdsSelected).subscribe(
        response => {
          this.infoMessage = "Project created successfully";
          this.errorMessage = null;
          this.router.navigate(["/projectDetails/" + response.projectId]);
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
