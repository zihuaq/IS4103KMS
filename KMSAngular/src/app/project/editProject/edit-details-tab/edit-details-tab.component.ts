import { Component, Input, OnInit, OnChanges, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { ActivatedRoute} from '@angular/router';

import { Project } from 'src/app/classes/project';
import { ProjectService } from 'src/app/project.service';
import { ProjectType } from 'src/app/classes/project-type.enum';
import { Tag } from 'src/app/classes/tag';
import { TagService } from 'src/app/tag.service';

declare var $: any;

@Component({
  selector: 'app-edit-details-tab',
  templateUrl: './edit-details-tab.component.html',
  styleUrls: ['./edit-details-tab.component.css']
})
export class EditDetailsTabComponent implements OnInit, OnChanges {

  @Input() projectToEdit: Project;
  @Output() projectChanged = new EventEmitter<Project>();
  projectId: number;
  tags: Tag[];
  selectedTags: Tag[];
  selectedTagNames: string[];
  infoMessage: string;
  errorMessage: string;
  projectStatusList: ProjectType[];
  descriptionLen: number;

  constructor(public projectService: ProjectService,
    private tagService: TagService,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.tags = response;
      }
    )
    this.projectService.getProjectStatusList().subscribe(
      response => {
        this.projectStatusList = response;
      }
    )
    this.projectId = parseInt(this.activatedRoute.snapshot.paramMap.get("projectId"));
    this.selectedTagNames = [];
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectToEdit = response;
        this.descriptionLen = this.projectToEdit.description.length;
        for (let tag of this.projectToEdit.sdgs) {
          this.selectedTagNames.push(tag.name);
        }
        $("#sdgselect2")
        .val($("#sdgselect2")
        .val()
        .concat( this.selectedTagNames));
        $("#sdgselect2")
        .trigger("change");
      }
    );

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {   
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
    this.projectToEdit = changes.projectToEdit.currentValue;
  }

  descriptionChange() {
    this.descriptionLen = this.projectToEdit.description.length;
  }

  edit(editProjectForm: NgForm) {
    console.log("******** edit()");
    this.selectedTags = [];
    this.selectedTagNames = $('#sdgselect2').val();
    if (this.selectedTagNames.length == 0) {
      $(document).Toasts('create', {
        class: 'bg-warning',
        title: 'Unable to edit Sdg tags',
        autohide: true,
        delay: 2500,
        body: 'Please select at least one Sdg tags',
      });
      return;
    }
    this.tags.forEach((element) => {
      if (this.selectedTagNames.includes(element.name)) {
        this.selectedTags.push(element);
      }
    });
    if (editProjectForm.valid) {
      this.projectToEdit.sdgs = this.selectedTags;
      if (!this.projectToEdit.monetaryFundingRequired) {
        this.projectToEdit.monetaryFundingRequired = 0.0;
      }
      if (!this.projectToEdit.paypalMerchantId) {
        this.projectToEdit.paypalMerchantId = null;
      }
      this.projectService.updateProject(this.projectToEdit).subscribe(
        response => {
          $(document).Toasts('create', {
            class: 'bg-success',
            title: 'Success',
            autohide: true,
            delay: 2500,
            body: 'Project updated successfully',
          })
        },
        error => {
          $(document).Toasts('create', {
            class: 'bg-warning',
            autohide: true,
            delay: 2500,
            body: error,
          });
        }
      );
    }
  }

}
